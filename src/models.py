""" Models """

from google.appengine.ext import ndb


class Loan(ndb.Model):
    loaner = ndb.StringProperty(required=True)
    photo = ndb.StringProperty(required=True)
    date_in = ndb.DateTimeProperty(indexed=True)
    date_out = ndb.DateTimeProperty(indexed=True)
