from flask import Response, request
from flask_restful import Resource
import json
from models import db, Comment, Post
from views import get_authorized_user_ids

class CommentListEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user
    
    def post(self):
        # create a new "Comment" based on the data posted in the body 
        body = request.get_json()
        comment_text = body.get("text")
        
        if not comment_text:
            return Response(json.dumps({"message": "Comment text not found"}), mimetype="application/json",status=400)
        
        try:
            post_id = int(body.get("post_id"))
            does_post_exist = Post.query.get(post_id)
            if not does_post_exist:
                return Response(json.dumps({"message": "Post for comment does not exist."}), mimetype="application/json",status=404)
            
        except Exception as e:
            print(e)
            return Response(json.dumps({"message": "Post id invalid. It must be of type: int"}), mimetype="application/json",status=400)

        original_author = Post.query.get(post_id).user_id
        auth_ids = get_authorized_user_ids(self.current_user)
        if original_author not in auth_ids:
            return Response(json.dumps({"message": "Unauthorized access."}), mimetype="application/json",status=404)

        new_comment = Comment(
            user_id = self.current_user.id,
            post_id = post_id,
            text = comment_text
        )
        db.session.add(new_comment)
        db.session.commit()

        return Response(json.dumps(new_comment.to_dict()), mimetype="application/json", status=201)
        
class CommentDetailEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user
  
    def delete(self, id):
        # delete "Comment" record where "id"=id
        try:
            id = int(id)
            does_id_exist = Comment.query.get(id)
            if not does_id_exist:
                return Response(json.dumps({"message":  "id={0} is invalid".format(id)}), mimetype="application/json", status=404)

        except Exception as e:
            print(e)
            return Response(json.dumps({"message": "Comment id invalid. It must be of type: int"}), mimetype="application/json",status=404)


        get_comment_record = Comment.query.get(id)

        if self.current_user.id != get_comment_record.user_id:
            return Response(json.dumps({"message":  "Unauthorized access"}), mimetype="application/json", status=404)

        Comment.query.filter_by(id=id).delete()
        db.session.commit()
        return Response(json.dumps({"message":  "Post id={0} successfully deleted".format(id)}), mimetype="application/json", status=200)


def initialize_routes(api):
    api.add_resource(
        CommentListEndpoint, 
        '/api/comments', 
        '/api/comments/',
        resource_class_kwargs={'current_user': api.app.current_user}

    )
    api.add_resource(
        CommentDetailEndpoint, 
        '/api/comments/<int:id>', 
        '/api/comments/<int:id>/',
        resource_class_kwargs={'current_user': api.app.current_user}
    )
