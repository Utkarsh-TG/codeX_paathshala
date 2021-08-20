from django.db import models
from django.db.models.fields.json import JSONField

# study resources
class Study_Material(models.Model):
    _class = models.IntegerField()
    subject = models.CharField(max_length=128)
    title = models.CharField(max_length=128)
    description = models.TextField()
    url = models.CharField(max_length=512)
    date = models.DateField()

    def __str__(self):
        return self.title

# practice resources
class Practice_Material(models.Model):
    _class = models.IntegerField()
    subject = models.CharField(max_length=128)
    title = models.CharField(max_length=128)
    description = models.TextField()
    questions = JSONField()
    date = models.DateField()

    def __str__(self):
        return self.title

# doubt questions
class Doubt(models.Model):
    user = models.CharField(max_length=122)
    content = models.CharField(max_length=2048)
    tags = JSONField()
    responses = JSONField()
    votes = JSONField()
    _id = models.CharField(max_length=128)
    date = models.DateField()

    def __str__(self):
        return self._id