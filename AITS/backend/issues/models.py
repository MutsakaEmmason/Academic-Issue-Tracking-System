from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models

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

    # Common Fields
    fullName = models.CharField(max_length=255, blank=True, null=True)
    email = models.EmailField(unique=True, blank=True, null=True)
    college = models.CharField(max_length=255, blank=True, null=True)
    department = models.CharField(max_length=255, blank=True, null=True)

    # Lecturer-specific fields
    courses_taught = models.TextField(blank=True, null=True)  # Store courses as a comma-separated string

    # Student-specific fields
    studentRegNumber = models.CharField(max_length=20, unique=True, blank=True, null=True)
    yearOfStudy = models.CharField(
        max_length=1,
        choices=[(str(i), f"Year {i}") for i in range(1, 7)],
        blank=True, 
        null=True
    )

    # Related fields for permissions and groups
    groups = models.ManyToManyField(
        Group,
        verbose_name='groups',
        blank=True,
        related_name="custom_users",  # Changed this to avoid conflict
        related_query_name="customuser",
    )
    user_permissions = models.ManyToManyField(
        Permission,
        verbose_name='user permissions',
        blank=True,
        related_name="customuser_user_permissions",
        related_query_name="customuser",
    )

    def __str__(self):
        return f"{self.username} ({self.role})"

    def save(self, *args, **kwargs):
        if self.role == 'student' and self.studentRegNumber:
            self.username = self.studentRegNumber
        elif self.email:
            self.username = self.email

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
    assigned_to = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_issues')
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='technical')
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='open')
    courseCode = models.CharField(max_length=20, blank=True, null=True)
    studentId = models.CharField(max_length=20, blank=True, null=True)
    lecturer = models.CharField(max_length=255, blank=True, null=True)
    department = models.CharField(max_length=255, blank=True, null=True)
    semester = models.CharField(max_length=20, blank=True, null=True)
    academicYear = models.CharField(max_length=20, blank=True, null=True)
    issueDate = models.DateField(auto_now_add=True)
    studentName = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.title} ({self.status})"


# Comment model.
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


# Issue Attachment model.
class IssueAttachment(Timestamp):
    issue = models.ForeignKey(Issue, on_delete=models.CASCADE, related_name="attachments")
    file = models.FileField(upload_to="attachments/")

    def __str__(self):
        return f"Attachment for {self.issue.title}"
