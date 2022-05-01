from flask import Response, request
from flask_restful import Resource
from models import Following, User, db
import json

def get_path():
    return request.host_url + 'api/posts/'

class FollowingListEndpoint(Resource):
    def __init__(self, current_user):
        self.current_user = current_user
    
    def get(self):
        # return all of the "following" records that the current user is following
        following = Following.query.filter_by(user_id=self.current_user.id).all()
        result = []
        for each_following in following:
            result.append(each_following.to_dict_following())
        return Response(json.dumps(result), mimetype="application/json", status=200)

    def post(self):
        # create a new "following" record based on the data posted in the body 
        body = request.get_json()
        
        following_acct_id = body.get("user_id")
        
        if not following_acct_id:
            return Response(json.dumps({ "message":  "Invalid argument. user id invalid" }), mimetype="application/json", status=400)
        try:
            following_acct_id = int(following_acct_id)
            does_user_exist = db.session.query(User.query.filter_by(id=following_acct_id).exists()).scalar()
            if not does_user_exist:
                return Response(json.dumps({"message": "User id does not exist."}), mimetype="application/json",status=404)
        
        except:
            return Response(json.dumps({"message": "Following id invalid. It must be of type: int"}), mimetype="application/json",status=400)
            
        result = db.session.execute('SELECT following_id FROM following WHERE user_id = :current_id',{"current_id":self.current_user.id})
        follows_ids = [id for (id,) in result]

        if following_acct_id in follows_ids:
            return Response(json.dumps({"message": "User already follows the id."}), mimetype="application/json", status=400)

        # following = Following.query.with_entities(Following.following_id).filter(and_(Following.user_id==self.current_user.id ,Following.following_id==following_acct_id)).all()

        new_following = Following (
            user_id = self.current_user.id,
            following_id = following_acct_id
        )
        db.session.add(new_following)
        db.session.commit()

        return Response(json.dumps(new_following.to_dict_following()), mimetype="application/json", status=201)

class FollowingDetailEndpoint(Resource):
    def __init__(self, current_user):
        self.current_user = current_user
    
    def delete(self, id):
        # delete "following" record where "id"=id
        if not id:
            return Response(json.dumps({ "message":  "Invalid argument. user id invalid" }), mimetype="application/json", status=400)
        try:
            delete_id = int(id)
            does_record_exist = Following.query.get(id)
            if not does_record_exist:
                return Response(json.dumps({"message": "Delete id invalid."}), mimetype="application/json",status=404)

            # does_user_exist = db.session.query(User.query.filter_by(id=delete_id).exists()).scalar()
            # if not does_user_exist:
            #     print("EXIST ???")
            #     return Response(json.dumps({"message": "User id does not exist."}), mimetype="application/json",status=404)
        
        except:
            return Response(json.dumps({"message": "Delete id invalid. It must be of type: int"}), mimetype="application/json",status=404)
        
        following_record = Following.query.get(id)
        if self.current_user.id != following_record.user_id:
            return Response(json.dumps({"message": "Unauthorized delete."}), mimetype="application/json", status=404)

        Following.query.filter_by(id=id).delete()


        # result = db.session.execute('SELECT following_id FROM following WHERE id = :current_id',{"current_id":self.current_user.id})
        # follows_ids = [id for (id,) in result]
        # print(follows_ids)
        # if id not in follows_ids:
        #     return Response(json.dumps({"message": "Unauthorized delete."}), mimetype="application/json", status=400)

        # result = db.session.execute('DELETE FROM following WHERE user_id = :current_id AND following_id = :follow_id',{"current_id":self.current_user.id, "follow_id":id})

        # Following.query.filter(and_(Following.user_id==self.current_user.id, Following.following_id==id)).delete()

        db.session.commit()
        return Response(json.dumps({"message":  "Follwing id={0} successfully deleted".format(id)}), mimetype="application/json", status=200)




def initialize_routes(api):
    api.add_resource(
        FollowingListEndpoint, 
        '/api/following', 
        '/api/following/', 
        resource_class_kwargs={'current_user': api.app.current_user}
    )
    api.add_resource(
        FollowingDetailEndpoint, 
        '/api/following/<int:id>', 
        '/api/following/<int:id>/', 
        resource_class_kwargs={'current_user': api.app.current_user}
    )
