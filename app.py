from dotenv import load_dotenv
load_dotenv()
from flask import Flask, request
from flask_restful import Api
from flask_cors import CORS
from flask import render_template
from tests import utils
import os
import requests
import json
from sqlalchemy import and_
from models import db, Post, User, Following, ApiNavigator, Story
from views import initialize_routes, get_authorized_user_ids


app = Flask(__name__)
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})

app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DB_URL')
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False    


db.init_app(app)
api = Api(app)

# set logged in user
with app.app_context():
    app.current_user = User.query.filter_by(id=12).one()


# Initialize routes for all of your API endpoints:
initialize_routes(api)

# Server-side template for the homepage:
@app.route('/')
def home():    
    post_api_url = utils.root_url + "/api/posts"
    stories_api_url = utils.root_url + "/api/stories"
    suggestion_api_url = utils.root_url + "/api/suggestions"

    posts = requests.get(post_api_url).json()
    stories = requests.get(stories_api_url).json()
    suggestions = requests.get(suggestion_api_url).json()
    curr_user = app.current_user.to_dict()
    return render_template(
        'starter_template.html',
        user=curr_user,
        posts=posts,
        stories=stories,
        suggestions=suggestions
    )
    # return '''
    #    <p>View  <a href="/api">REST API Tester</a>.</p>
    #    <p>Feel free to replace this code from HW2</p>
    # '''


@app.route('/api')
def api_docs():
    navigator = ApiNavigator(app.current_user)
    return render_template(
        'api/api_docs.html', 
        user=app.current_user,
        endpoints=navigator.get_endpoints(),
        url_root=request.url_root[0:-1] # trim trailing slash
    )



# enables flask app to run using "python3 app.py"
if __name__ == '__main__':
    app.run()
