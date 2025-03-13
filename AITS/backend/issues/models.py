# issues/models.py

from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models
from django.conf import settings
from django.utils.timezone import now


# Abstract model for timestamps.
class Timestamp(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


# Custom user model.
class CustomUser(AbstractUser):
    ROLE_CHOICES = [
        ('student', 'Student'),
        ('lecturer', 'Lecturer'),
        ('hod', 'Head of Department'),
        ('registrar', 'Academic Registrar'),
        ('admin', 'Administrator'),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='student')

    groups = models.ManyToManyField(
        Group,
        verbose_name='groups',
        blank=True,
        help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.',
        related_name="customuser_groups",  # added related_name
        related_query_name="customuser",
    )
    user_permissions = models.ManyToManyField(
        Permission,
        verbose_name='user permissions',
        blank=True,
        help_text='Specific permissions for this user.',
        related_name="customuser_user_permissions",  # added related_name
        related_query_name="customuser",
    )

    # Student-specific fields (optional for other roles)
    studentRegNumber = models.CharField(max_length=20, unique=True, blank=True, null=True)
    fullName = models.CharField(max_length=255, blank=True, null=True)
    email = models.EmailField(unique=True, blank=True, null=True)
    college = models.CharField(max_length=255, blank=True, null=True)
    department = models.CharField(max_length=255, blank=True, null=True)
    YEAR_CHOICES = [
        ('1', 'Year 1'),
        ('2', 'Year 2'),
        ('3', 'Year 3'),
        ('4', 'Year 4'),
        ('5', 'Year 5'),
        ('6', 'Year 6'),
    ]
    yearOfStudy = models.CharField(max_length=1, choices=YEAR_CHOICES, blank=True, null=True)

    def __str__(self):
        return f"{self.username} ({self.role})"

    def save(self, *args, **kwargs):
        if self.role == 'student' and self.studentRegNumber:
            self.username = self.studentRegNumber
        else:
            self.username = self.email # set username to email for other users
        super().save(*args, **kwargs)


# Issue model.
class Issue(Timestamp):
    CATEGORY_CHOICES = [
        ('missing_marks', 'Missing Marks'),
        ('appeals', 'Appeals'),
        ('corrections', 'Corrections'),
        ('technical', 'Technical'),
        ('administrative', 'Administrative'),
        ('course_registration', 'Course Registration'),
    ]

    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    ]
    STATUS_CHOICES = [
        ('open', 'Open'),
        ('submitted', 'Submitted'),
        ('assigned', 'Assigned'),
        ('in_progress', 'In Progress'),
        ('resolved', 'Resolved'),
        ('closed', 'Closed'),
    ]

    title = models.CharField(max_length=255)
    description = models.TextField()
    student = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='issues')
    assigned_to = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, blank=True,
                                    related_name='assigned_issues')
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='technical')
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='open')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} ({self.status})"


# Comment model..
class Comment(Timestamp):
    issue = models.ForeignKey(Issue, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comment by {self.user.username} on {self.issue.title}"


# Notification model..
class Notification(Timestamp):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    message = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    read = models.BooleanField(default=False)

    def __str__(self):
        return f"Notification for {self.user.username}: {self.message}"


# Audit Log model..
class AuditLog(Timestamp):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    action = models.CharField(max_length=255)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.action}"


class IssueAttachment(Timestamp):
    issue = models.ForeignKey(Issue, on_delete=models.CASCADE, related_name="attachments")
    file = models.FileField(upload_to="attachments/")
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Attachment for {self.issue.title}"