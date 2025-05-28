# your_app_name/serializers.py (Corrected Indentation and minor syntax)
from rest_framework import serializers
from .models import CustomUser, Issue, Comment, Notification, AuditLog, IssueAttachment
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import make_password

# Serializer for CustomUser
class CustomUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    role = serializers.CharField(default='registrar') # Removed write_only=True based on previous discussion for general use
    courses_taught = serializers.ListField(child=serializers.CharField(), allow_empty=True, required=False)

    class Meta:
        model = CustomUser
        fields = (
            'id', 'username', 'password', 'email', 'first_name', 'last_name', 'role',
            'studentRegNumber', 'fullName', 'college', 'department', 'yearOfStudy', 'courses_taught'
        )
        extra_kwargs = {
            'password': {'write_only': True},
            'first_name': {'required': False},
            'last_name': {'required': False},
        }

    # --- CORRECTED INDENTATION FOR create METHOD ---
    def create(self, validated_data):
        password = validated_data.pop('password')
        courses_taught_list = validated_data.pop('courses_taught', [])
        full_name = validated_data.pop('fullName', '')

        validated_data['courses_taught'] = ', '.join(courses_taught_list) if courses_taught_list else ''

        first_name = validated_data.pop('first_name', '')
        last_name = validated_data.pop('last_name', '')

        user = CustomUser.objects.create_user(
            username=validated_data.get('username'),
            email=validated_data.get('email'),
            password=password,
            fullName=full_name,
            **validated_data
        )

        if full_name:
            name_parts = full_name.split(' ', 1)
            user.first_name = name_parts[0]
            if len(name_parts) > 1:
                user.last_name = name_parts[1]
            user.save()

        print("Saved user:", user.__dict__)

        return user

    # --- CORRECTED INDENTATION FOR update METHOD ---
    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        if password:
            instance.set_password(password)

        courses_taught_list = validated_data.pop('courses_taught', None)
        if courses_taught_list is not None:
            instance.courses_taught = ', '.join(courses_taught_list) if courses_taught_list else ''

        full_name = validated_data.pop('fullName', None)
        if full_name is not None:
            instance.fullName = full_name
            name_parts = full_name.split(' ', 1)
            instance.first_name = name_parts[0]
            if len(name_parts) > 1:
                instance.last_name = name_parts[1]

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance


# SimpleUserSerializer to retrieve only basic user info (for related user fields)
class SimpleUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        # --- SYNTAX FIX: Removed stray comma after 'role' ---
        fields = ('id', 'username', 'role', 'fullName')


# Serializer for Issue Attachments
class IssueAttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = IssueAttachment
        fields = '__all__'


class IssueSerializer(serializers.ModelSerializer):
    student = SimpleUserSerializer(read_only=True)
    assigned_to = SimpleUserSerializer(read_only=True, allow_null=True)
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

    def validate_title(self, value):
        if len(value) < 5:
            raise serializers.ValidationError("Title must be at least 5 characters long.")
        return value

    def create(self, validated_data):
        student = validated_data.pop('student_id', None)
        assigned_to = validated_data.pop('assigned_to_id', None)
        student_name = validated_data.pop('studentName', None)

        if student is None:
            request = self.context.get('request')
            if request and hasattr(request, 'user'):
                student = request.user

        if not assigned_to:
            registrar = CustomUser.objects.filter(college=student.college, role='registrar').first()
            if registrar:
                assigned_to = registrar

        validated_data.pop('student', None)
        validated_data.pop('assigned_to', None)

        issue = Issue.objects.create(
            student=student,
            assigned_to=assigned_to,
            studentName=student_name,
            **validated_data
        )

        request = self.context.get('request')
        if request and hasattr(request, 'FILES'):
            attachments_data = request.FILES.getlist('attachments')
            for attachment_data in attachments_data:
                IssueAttachment.objects.create(issue=issue, file=attachment_data)

        return issue


# Serializer for Comments on Issues
class CommentSerializer(serializers.ModelSerializer):
    user = SimpleUserSerializer(read_only=True)

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


# Custom Token Serializer to support Lecturer login
class CustomTokenObtainPairSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')

        try:
            user = CustomUser.objects.get(username=username)
        except CustomUser.DoesNotExist:
            raise serializers.ValidationError("User with this username does not exist.")

        if not user.check_password(password):
            raise serializers.ValidationError("Incorrect password.")

        if user.role not in ['student', 'lecturer', 'registrar', 'hod', 'admin']:
            raise serializers.ValidationError("Invalid user role.")

        refresh = RefreshToken.for_user(user)
        data = {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'role': user.role
        }
        return data
