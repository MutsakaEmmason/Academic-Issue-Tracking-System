from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import send_mail
from .models import Issue

@receiver(post_save, sender=Issue)
def send_issue_notification(sender, instance, **kwargs):
    subject = f"Issue Update: {instance.title}"
    message = f"The status of your issue '{instance.title}' has been updated to '{instance.status}'."
    recipient_list = [instance.student.email]

    send_mail(subject, message, 'noreply@aits.com', recipient_list)
