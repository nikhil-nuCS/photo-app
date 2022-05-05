from flask import Response, request
from flask_restful import Resource
from models import LikePost, db
from models import Post
import json
from sqlalchemy import and_
from views import get_authorized_user_ids

class PostLikesListEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user
    
    def post(self):
        body = request.get_json()
        like_post_id = body.get("post_id")
        if not like_post_id:
            return Response(json.dumps({"message": "No post id found. Post id required."}), mimetype="application/json", status=400)
        try:
            like_post_id = int(like_post_id)
            does_post_exist = db.session.query(Post.query.filter_by(id=like_post_id).exists()).scalar()
            if not does_post_exist:
                return Response(json.dumps({"message": "Post id does not exist."}), mimetype="application/json",status=404)
        except:
            return Response(json.dumps({"message": "Post id invalid. It must be of type: int"}), mimetype="application/json",status=400)

     
        auth_ids = get_authorized_user_ids(self.current_user)
        post_ids = Post.query.with_entities(Post.id).filter(Post.user_id.in_(auth_ids)).all()        
        post_ids = [id for (id,) in post_ids]
        if like_post_id not in post_ids:
            return Response(json.dumps({"message": "Unauthorized post id like."}), mimetype="application/json",status=404)

        does_like_exist = LikePost.query.filter(and_(LikePost.user_id==self.current_user.id, LikePost.post_id == like_post_id)).all()
        if does_like_exist:
            return Response(json.dumps({"message": "Post like exists."}), mimetype="application/json",status=400)

        like_post = LikePost(
            user_id = self.current_user.id,
            post_id = like_post_id
        )
        db.session.add(like_post)
        db.session.commit()

        return Response(json.dumps(like_post.to_dict()), mimetype="application/json", status=201)

class PostLikesDetailEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user
    
    def delete(self, id):
        # delete "like_post" where "id"=id
        try:
            id = int(id)
        except:
            return Response(json.dumps({"message": "Like id invalid. It must be of type: int"}), mimetype="application/json",status=400)

        like_posts = LikePost.query.get(id)
        
        if not like_posts:
            return Response(json.dumps({"message":  "id={0} is invalid".format(id)}), mimetype="application/json", status=404)

        if like_posts.user_id != self.current_user.id:
            return Response(json.dumps({"message":  "id={0} is invalid".format(id)}), mimetype="application/json", status=404)

        LikePost.query.filter_by(id=id).delete()
        db.session.commit()
        return Response(json.dumps({"message":  "Post id={0} successfully deleted".format(id)}), mimetype="application/json", status=200)



def initialize_routes(api):
    api.add_resource(
        PostLikesListEndpoint, 
        '/api/posts/likes', 
        '/api/posts/likes/', 
        resource_class_kwargs={'current_user': api.app.current_user}
    )

    api.add_resource(
        PostLikesDetailEndpoint, 
        '/api/posts/likes/<int:id>', 
        '/api/posts/likes/<int:id>/',
        resource_class_kwargs={'current_user': api.app.current_user}
    )
