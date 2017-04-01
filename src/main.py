""" Main """

from flask import Flask

from .index import bp as index

app = Flask(__name__)
# app.config['DEBUG'] = True

app.register_blueprint(index)
