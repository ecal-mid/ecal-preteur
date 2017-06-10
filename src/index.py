""" Index """

from flask import Blueprint, render_template, jsonify, request
from functools import wraps
from itsdangerous import URLSafeSerializer
import os
import cloudstorage as gcs
import base64
import re
import time
import datetime
from google.appengine.api import app_identity
from google.appengine.api import mail
from google.appengine.api import users
from google.appengine.ext import ndb

from .models import Loan

bp = Blueprint(
    'index', __name__,
    static_folder='../static',
    template_folder='../templates')

ancestor_key = ndb.Key('Loan', '2016-2017')

# Setup list of authorized users.
authorized_users = open('config/authorized.txt').read().splitlines()
authorized_users = '(' + ')|(^'.join(authorized_users) + '$)'

def get_photo_prefix():
    prefix = 'https://storage.googleapis.com'
    is_prod = os.getenv('SERVER_SOFTWARE', '').startswith('Google App Engine/')
    if not is_prod:
        prefix = 'http://localhost:8080/_ah/gcs'
    return prefix


def login_required(f):
  """Provides decorator for login."""

  @wraps(f)
  def decorated_function(*args, **kwargs):
    user = users.get_current_user().email()
    if re.match(authorized_users, user):
      return f(*args, **kwargs)
    else:
      logout_url = users.create_logout_url('/')
      return render_template('forbidden.html', user=user, logout_url=logout_url), 403

  return decorated_function



def upload_file(file_name, file_data, loaner):
    bucket_name = os.environ.get('BUCKET_NAME',
                                 app_identity.get_default_gcs_bucket_name())
    write_retry_params = gcs.RetryParams(backoff_factor=1.1)
    file_name = '/' + bucket_name + '/' + file_name
    gcs_file = gcs.open(file_name,
                        'w',
                        content_type='image/png',
                        options={'x-goog-acl': 'public-read',
                                 'x-goog-meta-loaner': loaner},
                        retry_params=write_retry_params)
    gcs_file.write(file_data)
    gcs_file.close()
    return file_name


@bp.route('/')
@login_required
def index():
    """Return the homepage."""
    return render_template('index.html')


@bp.route('/loans')
@login_required
def list_loans():
    """Return the list of loans."""
    loans = Loan.query(Loan.date_out == None, ancestor=ancestor_key).order(-Loan.date_in).fetch()
    return render_template('loans.html', loans=loans, prefix=get_photo_prefix())


@bp.route('/loans', methods=['POST'])
@login_required
def create_loan():
    """Records a new loan."""
    loaner = request.form['loaner']
    item = request.form['item']
    item_id = None
    if item[:2] == 'g-':
        print('saving generic item: ' + item)
        item_id = item
    else:
        image_b64 = item
        img_data = re.sub('^data:image/.+;base64,', '', image_b64).decode('base64')
        filename = time.strftime("%Y%m%d-%H%M%S") + '-' + loaner
        file_id = upload_file(filename, img_data, loaner)
        item_id = file_id
    # save entry to datastore
    loan = Loan(parent=ancestor_key)
    loan.loaner = loaner
    loan.photo = item_id
    loan.date_in = datetime.datetime.now()
    loan.date_out = None
    loan.reporter = users.get_current_user().email()
    loan.put()
    # send confirmation email
    send_email(loan.key.id(), 'confirm_email', 'Confirmation d\'emprunt')
    return 'Success'


@bp.route('/loans/validate/<int:id>', methods=['POST'])
@login_required
def validate_loan(id):
    """Validate a loan."""
    loan = Loan.get_by_id(id, parent=ancestor_key)
    loan.date_out = datetime.datetime.now()
    loan.put()
    send_email(loan.key.id(), 'return_email', 'Confirmation de retour')
    return 'Success'

def send_email(id, template, subject):
    """Sends an email related to a loan."""
    loan = Loan.get_by_id(id, parent=ancestor_key)
    # render email's template
    body = render_template(template + '.html', loan=loan, prefix=get_photo_prefix())
    # send email
    mail.send_mail(sender="ECAL - Bureau CV <do-not-reply@ecal-preteur.appspotmail.com>",
                   to=loan.loaner,
                   subject="Bureau CV - " + subject,
                   body=body,
                   html=body)
    return 'Sent'

@bp.errorhandler(404)
def page_not_found(e):
    """Return a custom 404 error."""
    return 'Sorry, nothing at this URL.', 404
