from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import send_mail
from .models import Issue
from backend.settings import EMAIL_HOST_USER


@receiver(post_save, sender=Issue)
def send_issue_notification(sender, instance, created, **kwargs):
    """Send an email to the student when an issue status is updated"""
    if not created:  # Send email only when the issue is updated
        subject = f"Issue Update: {instance.title}"
        message = f"The status of your issue '{instance.title}' has been updated to '{instance.status}'."

        recipient_list = [instance.student.email]
        

        send_mail(subject, message, EMAIL_HOST_USER, recipient_list, fail_silently=True)
