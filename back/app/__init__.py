from flask import Flask
from config import Config
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app, resources=r'/api/*', supports_credentials=True)
app.config.from_object(Config)

from app import routes

