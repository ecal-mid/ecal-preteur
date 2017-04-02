""" Models """

from google.appengine.ext import ndb


class Loan(ndb.Model):
    loaner = ndb.StringProperty(required=True)
    photo = ndb.StringProperty(required=True)
    date_in = ndb.DateTimeProperty(auto_now=True)
    date_out = ndb.DateTimeProperty()
