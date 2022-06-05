from flask import Response, request
from flask_restful import Resource
from models import User
from views import get_authorized_user_ids
import json
import flask_jwt_extended

class SuggestionsListEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user

    @flask_jwt_extended.jwt_required()
    def get(self):
        authorized_users = get_authorized_user_ids(self.current_user)
        remaining_ids = User.query.filter(~User.id.in_(authorized_users)).all()
        suggested_users = []
        for index in range(7):
            suggested_users.append(remaining_ids[index].to_dict())
        return Response(json.dumps(suggested_users), mimetype="application/json", status=200)


def initialize_routes(api):
    api.add_resource(
        SuggestionsListEndpoint, 
        '/api/suggestions', 
        '/api/suggestions/', 
        resource_class_kwargs={'current_user': flask_jwt_extended.current_user}
    )
