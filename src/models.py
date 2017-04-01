""" Models """

import yaml
from google.appengine.ext import ndb
from flask import jsonify


class User(object):

    def __init__(self, data):
        self.data = data
        self.name = data['name']
        self.role = data['role']
        self.email = data['email']


class Loan(ndb.Model):
    user = ndb.StringProperty(required=True)
    task = ndb.StringProperty(required=True)
    date = ndb.DateProperty(required=True)
    is_pm = ndb.BooleanProperty(required=True)

    def get_dict(self):
        result = self.to_dict()
        result['key'] = self.key.id()
        return result
