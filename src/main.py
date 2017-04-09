""" Main """

from google.appengine.api import urlfetch
from flask import Flask, request, redirect, Response, stream_with_context

from .index import bp as index

app = Flask(__name__)
# app.config['DEBUG'] = True

app.register_blueprint(index)


@app.route('/img/<string:filename>', methods=['GET'])
def get_image(filename):
    result = urlfetch.fetch('http://intranet.ecal.ch/img/photo/' + filename)
    return Response(result.content, content_type=result.headers['content-type'])


@app.before_request
def before_request():
    if request.url.startswith('http://') and 'localhost' not in request.url:
        url = request.url.replace('http://', 'https://', 1)
        code = 301
        return redirect(url, code=code)
