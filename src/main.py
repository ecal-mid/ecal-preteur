""" Main """

from flask import Flask, request, redirect

from .index import bp as index

app = Flask(__name__)
# app.config['DEBUG'] = True

app.register_blueprint(index)


@app.before_request
def before_request():
    if request.url.startswith('http://') and 'localhost' not in request.url:
        url = request.url.replace('http://', 'https://', 1)
        code = 301
        return redirect(url, code=code)
