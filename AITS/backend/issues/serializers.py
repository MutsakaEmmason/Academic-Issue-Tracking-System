from rest_framework import serializers
from .models import CustomUser, Issue, Comment, Notification, AuditLog, IssueAttachment
from django.contrib.auth.hashers import make_password

# Serializer for CustomUser
class CustomUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})

    class Meta:
        model = CustomUser
        fields = ('id', 'username', 'password', 'email', 'first_name', 'last_name', 'role', 'studentRegNumber', 'fullName', 'college', 'department', 'yearOfStudy')

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = CustomUser(**validated_data)
        user.set_password(password)  # Hash the password before saving
        user.save()
        return user

# SimpleUserSerializer to retrieve only basic user info (for related user fields)
class SimpleUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'username', 'role')

# Serializer for Issue Attachments
class IssueAttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = IssueAttachment
        fields = '__all__'

# IssueSerializer for creating and viewing issues
class IssueSerializer(serializers.ModelSerializer):
    student = SimpleUserSerializer(read_only=True)  # Display student info
    assigned_to = SimpleUserSerializer(read_only=True, allow_null=True)  # Display assigned lecturer info
    student_id = serializers.PrimaryKeyRelatedField(queryset=CustomUser.objects.all(), write_only=True, required=False)
    assigned_to_id = serializers.PrimaryKeyRelatedField(queryset=CustomUser.objects.all(), write_only=True, required=False, allow_null=True)
    attachments = IssueAttachmentSerializer(many=True, required=False, read_only=True)

    class Meta:
        model = Issue
        fields = (
            'id', 'title', 'description', 'student', 'student_id', 'assigned_to', 'assigned_to_id',
            'category', 'priority', 'status', 'created_at', 'updated_at', 'courseCode', 'studentId',
            'lecturer', 'department', 'semester', 'academicYear', 'issueDate', 'studentName', 'attachments'
        )

    # Validate the issue title length
    def validate_title(self, value):
        if len(value) < 5:
            raise serializers.ValidationError("Title must be at least 5 characters long.")
        return value

    # Create an Issue and handle attachments
    def create(self, validated_data):
        student = validated_data.pop('student_id', None)
        assigned_to = validated_data.pop('assigned_to_id', None)
        student_name = validated_data.pop('studentName', None)

        if student is None:  # If no student is provided, use the authenticated user
            request = self.context.get('request')
            if request and hasattr(request, 'user'):
                student = request.user  # The logged-in user is the student

        # Create the Issue
        validated_data.pop('student', None)  # Remove student field from validated data
        validated_data.pop('assigned_to', None)  # Remove assigned_to field from validated data

        issue = Issue.objects.create(
            student=student, 
            assigned_to=assigned_to, 
            studentName=student_name, 
            **validated_data 
        )

        # Handle attachments (if any)
        request = self.context.get('request')
        if request and hasattr(request, 'FILES'):
            attachments_data = request.FILES.getlist('attachments')
            for attachment_data in attachments_data:
                IssueAttachment.objects.create(issue=issue, file=attachment_data)

        return issue

# Serializer for Comments on Issues
class CommentSerializer(serializers.ModelSerializer):
    user = SimpleUserSerializer(read_only=True)  # Display user info for comments
    class Meta:
        model = Comment
        fields = ('id', 'issue', 'user', 'text', 'created_at')

# Serializer for Notifications
class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'

# Serializer for Audit Logs (logging actions)
class AuditLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuditLog
        fields = '__all__'
