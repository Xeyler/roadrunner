from django.db import models
from django.conf import settings

class Activity(models.Model):
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )
    activity_file = models.FileField()
