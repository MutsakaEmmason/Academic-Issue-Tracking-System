from django.contrib.auth.models import AbstractUser
from django.contrib.auth import get_user_model
from django.db import models


# Create your models here.


class CustomUser(AbstractUser):
    ROLE_CHOICES = [
        ('student', 'Student'),
        ('lecturer', 'Lecturer'),
        ('admin', 'Administrator'),
    ]
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)

class Issue(models.Model):
    STATUS_CHOICES = [
        ('open', 'Open'),
        ('in_progress', 'In Progress'),
        ('resolved', 'Resolved'),
    ]
    title = models.CharField(max_length=255)
    description = models.TextField()
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='open')
    student = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='issues')
    assigned_to = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_issues')
    created_at = models.DateTimeField(auto_now_add=True)

class Comment(models.Model):
    issue = models.ForeignKey(Issue, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
