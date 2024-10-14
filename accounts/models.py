from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    USER_TYPES = (
        ('agent', 'Agent'),
        ('administration', 'Administration'),
        ('professor', 'Professor'),
    )
    user_type = models.CharField(max_length=20, choices=USER_TYPES)
    

    def __str__(self):
        return self.email