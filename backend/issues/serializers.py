# your_app_name/serializers.py (Corrected Indentation and minor syntax)
from rest_framework import serializers
from .models import CustomUser, Issue, Comment, Notification, AuditLog, IssueAttachment
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import make_password

# Serializer for CustomUser
class CustomUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    
    # 'role' field: It should be provided by the frontend.
    # If the frontend always sends it, you don't need a default here.
    # The 'create' method will handle what happens if it's missing.
    role = serializers.CharField(max_length=20) # Ensure max_length matches model

    # For 'fullName' being used by student/lecturer and first_name/last_name by registrar
    # Make fullName a read-write field that's not directly mapped to the model field
    # (since we'll manage first_name/last_name from it)
    # OR, better yet, map it to the model field directly and handle conversions.
    # Given your model *has* fullName, let's treat it as the primary source for those roles.

    # courses_taught will be a list in serializer, string in model
    courses_taught = serializers.ListField(child=serializers.CharField(), allow_empty=True, required=False)

    class Meta:
        model = CustomUser
        fields = (
            'id', 'username', 'password', 'email', 'first_name', 'last_name', 'role',
            'studentRegNumber', 'fullName', 'college', 'department', 'yearOfStudy', 'courses_taught'
        )
        extra_kwargs = {
            'password': {'write_only': True},
            # first_name and last_name are not required for input, as fullName might be used
            'first_name': {'required': False},
            'last_name': {'required': False},
            # Make other fields not required if they are null=True in model
            'studentRegNumber': {'required': False},
            'yearOfStudy': {'required': False},
            'college': {'required': False},
            'department': {'required': False},
            'email': {'required': False},
            'fullName': {'required': False} # fullName might not always be sent
        }

    # Custom validation for specific fields
    def validate(self, data):
        role = data.get('role')

        if role == 'student':
            if not data.get('studentRegNumber'):
                raise serializers.ValidationError({"studentRegNumber": "Student registration number is required for students."})
            if not data.get('yearOfStudy'):
                raise serializers.ValidationError({"yearOfStudy": "Year of study is required for students."})
            if not data.get('fullName'):
                raise serializers.ValidationError({"fullName": "Full name is required for students."})
        
        elif role == 'lecturer':
            if not data.get('fullName'):
                raise serializers.ValidationError({"fullName": "Full name is required for lecturers."})
            # Add checks for college/department if always required for lecturers
        
        elif role == 'registrar':
            if not data.get('first_name'):
                raise serializers.ValidationError({"first_name": "First name is required for registrars."})
            if not data.get('last_name'):
                raise serializers.ValidationError({"last_name": "Last name is required for registrars."})
            # Add checks for college/department if always required for registrars

        return data

    def create(self, validated_data):
        password = validated_data.pop('password')
        role = validated_data.pop('role', 'student') # Default to 'student' if not provided
        
        # Pop all fields that might be used as direct model attributes
        full_name = validated_data.pop('fullName', None) # Can be None if not sent
        first_name = validated_data.pop('first_name', None)
        last_name = validated_data.pop('last_name', None)
        courses_taught_list = validated_data.pop('courses_taught', [])
        
        # Prepare data for create_user (only standard AbstractUser fields initially)
        create_user_data = {
            'username': validated_data.get('username'),
            'email': validated_data.get('email'),
            'password': password,
        }

        # Handle first_name/last_name based on role or provided data
        if role in ['student', 'lecturer'] and full_name:
            name_parts = full_name.split(' ', 1)
            create_user_data['first_name'] = name_parts[0]
            create_user_data['last_name'] = name_parts[1] if len(name_parts) > 1 else ''
        elif role == 'registrar': # For registrar, directly use first_name/last_name if provided
            create_user_data['first_name'] = first_name
            create_user_data['last_name'] = last_name
        # If no specific name format, first_name/last_name might be empty, which is fine for AbstractUser.

        # Create the user object
        user = CustomUser.objects.create_user(**create_user_data)

        # Set role and custom fields (including fullName if it's a model field)
        user.role = role
        user.fullName = full_name # Assign directly to the model field if it exists
        user.college = validated_data.get('college')
        user.department = validated_data.get('department')
        user.studentRegNumber = validated_data.get('studentRegNumber')
        user.yearOfStudy = validated_data.get('yearOfStudy')
        user.courses_taught = ', '.join(courses_taught_list) if courses_taught_list else ''
        
        user.save() # Save after setting all custom fields

        print("Saved user:", user.__dict__)
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        if password:
            instance.set_password(password)

        role = validated_data.get('role') # Get role to determine naming strategy

        full_name = validated_data.pop('fullName', None)
        first_name = validated_data.pop('first_name', None)
        last_name = validated_data.pop('last_name', None)

        if role in ['student', 'lecturer'] and full_name is not None:
            instance.fullName = full_name
            name_parts = full_name.split(' ', 1)
            instance.first_name = name_parts[0]
            instance.last_name = name_parts[1] if len(name_parts) > 1 else ''
        elif role == 'registrar':
            if first_name is not None:
                instance.first_name = first_name
            if last_name is not None:
                instance.last_name = last_name
            # If registrar uses first/last but fullName needs to be derived for output
            if instance.first_name or instance.last_name:
                instance.fullName = f"{instance.first_name or ''} {instance.last_name or ''}".strip()
            else:
                instance.fullName = ''
        
        # Handle courses_taught list to string conversion
        courses_taught_list = validated_data.pop('courses_taught', None)
        if courses_taught_list is not None:
            instance.courses_taught = ', '.join(courses_taught_list) if courses_taught_list else ''
        
        # Apply remaining validated data directly to instance attributes
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance

    # For read operations (GET requests), ensure fullName is populated correctly
    def to_representation(self, instance):
        ret = super().to_representation(instance)
        # If the user role is student or lecturer, prioritize fullName
        if instance.role in ['student', 'lecturer']:
            if not instance.fullName and (instance.first_name or instance.last_name):
                ret['fullName'] = f"{instance.first_name or ''} {instance.last_name or ''}".strip()
            elif instance.fullName:
                 ret['fullName'] = instance.fullName
            else:
                ret['fullName'] = instance.username # Fallback

            # Ensure first_name and last_name are correctly represented based on fullName
            if instance.fullName:
                name_parts = instance.fullName.split(' ', 1)
                ret['first_name'] = name_parts[0]
                ret['last_name'] = name_parts[1] if len(name_parts) > 1 else ''
            else:
                ret['first_name'] = instance.first_name
                ret['last_name'] = instance.last_name
            
        elif instance.role == 'registrar':
            # For registrars, derive fullName from first_name and last_name for consistency in output
            ret['fullName'] = f"{instance.first_name or ''} {instance.last_name or ''}".strip()
            # first_name and last_name are already correctly populated by DRF in ret
        
        # Convert courses_taught string back to list for output
        if instance.courses_taught:
            ret['courses_taught'] = [c.strip() for c in instance.courses_taught.split(',') if c.strip()]
        else:
            ret['courses_taught'] = []

        return ret


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
