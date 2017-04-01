""" Index """

from flask import Blueprint, render_template, jsonify, request
from itsdangerous import URLSafeSerializer

import os
import cloudstorage as gcs
import base64
import re
import time
from google.appengine.api import app_identity

# from .models import planning, refresh_planning

bp = Blueprint(
    'index', __name__,
    static_folder='../static',
    template_folder='../templates')


def upload_file(file_name, file_data, loaner):
    bucket_name = os.environ.get('BUCKET_NAME',
                                 app_identity.get_default_gcs_bucket_name())
    write_retry_params = gcs.RetryParams(backoff_factor=1.1)
    gcs_file = gcs.open('/' + bucket_name + '/' + file_name,
                        'w',
                        content_type='image/png',
                        options={'x-goog-acl': 'public-read',
                                 'x-goog-meta-loaner': loaner},
                        retry_params=write_retry_params)
    gcs_file.write(file_data)
    gcs_file.close()


@bp.route('/')
def index():
    """Return the homepage."""
    return render_template('index.html')


@bp.route('/loans')
def list_loans():
    """Return the list of loans."""
    bucket_name = os.environ.get('BUCKET_NAME',
                                 app_identity.get_default_gcs_bucket_name())
    page_size = 15
    stats = gcs.listbucket('/' + bucket_name, max_keys=page_size)
    files = []
    while True:
        count = 0
        for stat in stats:
            count += 1
            files.append(stat)
        if count != page_size or count == 0:
            break
        stats = gcs.listbucket('/' + bucket_name, max_keys=page_size, marker=stat.filename)
    print(files)
    return render_template('loans.html', files=files)


@bp.route('/loans', methods=['POST'])
def create_loan():
    """Records a new loan."""
    loaner = request.form['loaner']
    image_b64 = request.form['image']
    img_data = re.sub('^data:image/.+;base64,', '', image_b64).decode('base64')
    filename = time.strftime("%Y%m%d-%H%M%S") + '-' + loaner
    upload_file(filename, img_data, filename)
    return 'Success'


@bp.errorhandler(404)
def page_not_found(e):
    """Return a custom 404 error."""
    return 'Sorry, nothing at this URL.', 404
