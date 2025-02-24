from django.contrib.auth.models import AbstractUser
from django.db import models

# Abstract model for timestamps
class Timestamp(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        abstract = True

# Custom user model
class CustomUser(AbstractUser):
    ROLE_CHOICES = [
        ('student', 'Student'),
        ('lecturer', 'Lecturer'),
        ('hod', 'Head of Department'),
        ('registrar', 'Academic Registrar'),
        ('admin', 'Administrator'),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)

# Issue model
class Issue(Timestamp):
    CATEGORY_CHOICES = [
        ('missing_marks', 'Missing Marks'),
        ('appeals', 'Appeals'),
        ('corrections', 'Corrections'),
    ]
    STATUS_CHOICES = [
        ('open', 'Open'),
        ('in_progress', 'In Progress'),
        ('resolved', 'Resolved'),
        ('closed', 'Closed'),
    ]
    title = models.CharField(max_length=255)
    description = models.TextField()
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='open')
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    student = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='issues')
    assigned_to = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_issues')

    def __str__(self):
        return f"{self.title} ({self.status})"

# Comment model
class Comment(Timestamp):
    issue = models.ForeignKey(Issue, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    text = models.TextField()

    def __str__(self):
        return f"Comment by {self.user.username} on {self.issue.title}"

# Notification model.
class Notification(Timestamp):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    message = models.CharField(max_length=255)
    read = models.BooleanField(default=False)

    def __str__(self):
        return f"Notification for {self.user.username}: {self.message}"

# Audit Log model.
class AuditLog(Timestamp):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    action = models.CharField(max_length=255)
    
    def __str__(self):
        return f"{self.user.username} - {self.action}"