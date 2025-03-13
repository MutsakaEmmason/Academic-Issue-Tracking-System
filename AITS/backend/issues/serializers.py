# issues/serializers.py

from rest_framework import serializers
from .models import CustomUser, Issue, Comment, Notification, AuditLog, IssueAttachment
from django.contrib.auth.hashers import make_password

class CustomUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})

    class Meta:
        model = CustomUser
        fields = ('id', 'username', 'password', 'email', 'first_name', 'last_name', 'role', 'studentRegNumber', 'fullName', 'college', 'department', 'yearOfStudy')

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = CustomUser(**validated_data)
        user.set_password(password)
        user.save()
        return user

class IssueSerializer(serializers.ModelSerializer):
    # Display username directly from CustomUser
    student_username = serializers.ReadOnlyField(source='student.username')
    assigned_to_username = serializers.ReadOnlyField(source='assigned_to.username')

    class Meta:
        model = Issue
        fields = '__all__'  # Or specify the fields you need
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