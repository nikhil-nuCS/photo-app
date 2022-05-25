from flask import Response, request
from flask_restful import Resource
from models import Post, Bookmark, db
import json
from views import get_authorized_user_ids
from sqlalchemy import and_
import flask_jwt_extended

class BookmarksListEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user
    
    @flask_jwt_extended.jwt_required()
    def get(self):
        # get all bookmarks owned by the current user
        result = []
        bookmarks = Bookmark.query.filter_by(user_id = self.current_user.id)
        for each_bookmark in bookmarks:
            result.append(each_bookmark.to_dict())
        return Response(json.dumps(result), mimetype="application/json", status=200)

    @flask_jwt_extended.jwt_required()
    def post(self):
        # create a new "bookmark" based on the data posted in the body 
        body = request.get_json()
        bookmark_post_id = body.get("post_id")

        if not bookmark_post_id:
            return Response(json.dumps({"message": "No post id found. Post id required."}), mimetype="application/json", status=400)
        
        try:
            bookmark_post_id = int(bookmark_post_id)

            does_post_exist = Post.query.get(bookmark_post_id)
            if not does_post_exist:
                return Response(json.dumps({"message": "Post for bookmark does not exist."}), mimetype="application/json",status=404)

            is_bookmark_duplicate = db.session.query(db.session.query(Bookmark).filter(and_(Bookmark.post_id == bookmark_post_id, Bookmark.user_id == self.current_user.id)).exists()).scalar()
            if is_bookmark_duplicate:
                return Response(json.dumps({"message": "Bookmark does not exist."}), mimetype="application/json",status=400)
        
        except:
            return Response(json.dumps({"message": "Post id invalid. It must be of type: int"}), mimetype="application/json",status=400)
     
        auth_ids = get_authorized_user_ids(self.current_user)
        post_detail = Post.query.get(bookmark_post_id)
        if post_detail.user_id not in auth_ids:
            return Response(json.dumps({"message": "Unauthorized post id bookmark."}), mimetype="application/json",status=404)


        bookmark = Bookmark(
            user_id = self.current_user.id,
            post_id = bookmark_post_id
        )

        db.session.add(bookmark)
        db.session.commit()

        return Response(json.dumps(bookmark.to_dict()), mimetype="application/json", status=201)

class BookmarkDetailEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user
    
    @flask_jwt_extended.jwt_required()
    def delete(self, id):
        # delete "bookmark" record where "id"=id
        try:
            id = int(id)
            does_bookmark_entry_exist = Bookmark.query.get(id)
            if not does_bookmark_entry_exist:
                return Response(json.dumps({"message":  "id={0} is invalid".format(id)}), mimetype="application/json", status=404)
        except Exception as e:
            print(e)
            return Response(json.dumps({"message": "Bookmark id invalid. It must be of type: int"}), mimetype="application/json",status=404)

        bookmark_detail = Bookmark.query.get(id)
        if self.current_user.id != bookmark_detail.user_id:
            return Response(json.dumps({"message": "Unauthorised deletion."}), mimetype="application/json",status=404)

        Bookmark.query.filter_by(id=id).delete()
        db.session.commit()
        return Response(json.dumps({"message":  "Post id={0} successfully deleted".format(id)}), mimetype="application/json", status=200)


def initialize_routes(api):
    api.add_resource(
        BookmarksListEndpoint, 
        '/api/bookmarks', 
        '/api/bookmarks/', 
        resource_class_kwargs={'current_user': flask_jwt_extended.current_user}
    )

    api.add_resource(
        BookmarkDetailEndpoint, 
        '/api/bookmarks/<int:id>', 
        '/api/bookmarks/<int:id>',
        resource_class_kwargs={'current_user': flask_jwt_extended.current_user}
    )
