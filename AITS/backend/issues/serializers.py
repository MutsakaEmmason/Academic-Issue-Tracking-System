from rest_framework import serializers
from .models import CustomUser, Issue, Comment, Notification, AuditLog
from .models import IssueAttachment

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'role']

class IssueSerializer(serializers.ModelSerializer):
    student = serializers.ReadOnlyField(source='student.username')
    assigned_to = serializers.ReadOnlyField(source='assigned_to.username') 

    class Meta:
        model = Issue
        fields = '__all__'
    def validate_title(self, value):
        if len(value) < 5:
            raise serializers.ValidationError("Title must be at least 5 characters long.")
        return value
        
        
class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = '__all__'

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'

class AuditLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuditLog
        fields = '__all__'
        
        
class IssueAttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = IssueAttachment
        fields = '__all__'
