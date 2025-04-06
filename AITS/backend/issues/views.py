from rest_framework import viewsets, permissions
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework import generics, status, filters
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django_filters.rest_framework import DjangoFilterBackend
from django.core.mail import send_mail
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.db.models import Q

from django.shortcuts import get_object_or_404
from rest_framework_simplejwt.views import TokenObtainPairView, TokenVerifyView  # Import the correct TokenVerifyView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import CustomUser, Issue, Comment, Notification, AuditLog, IssueAttachment
from .serializers import CustomUserSerializer, IssueSerializer, CommentSerializer, NotificationSerializer, AuditLogSerializer, IssueAttachmentSerializer

# CustomUser ViewSet
class CustomUserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [permissions.IsAuthenticated]

# Issue ViewSet
class IssueViewSet(viewsets.ModelViewSet):
    queryset = Issue.objects.all()
    serializer_class = IssueSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['category']
    search_fields = ['category', 'title', 'status']
    
    def get_queryset(self):
        user = self.request.user
        queryset = Issue.objects.all()

        # Filter issues based on the user's role
        if user.role == 'student':
            queryset = queryset.filter(student=user)
        elif user.role == 'lecturer':
            queryset = queryset.filter(assigned_to=user)
        
        # Additional search filter
        search_query = self.request.query_params.get('search', None)
        if search_query:
            queryset = queryset.filter(
                Q(title__icontains=search_query) |
                Q(description__icontains=search_query)
            )
        
        return queryset

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            student_name = request.data.get('studentName')
            issue = serializer.save(student=request.user, studentName=student_name)
            
            # Check if files are provided
            files = request.FILES.getlist('attachments', [])
            if files:
                for file in files:
                    IssueAttachment.objects.create(issue=issue, file=file)
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            log_action(request.user, f"Issue updated: {instance.title}")
            send_issue_update_email(instance)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Comment ViewSet
class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]

# Notification ViewSet
class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

# AuditLog ViewSet
class AuditLogViewSet(viewsets.ModelViewSet):
    queryset = AuditLog.objects.all()
    serializer_class = AuditLogSerializer
    permission_classes = [permissions.IsAuthenticated]

# IssueAttachment ViewSet
class IssueAttachmentViewSet(viewsets.ModelViewSet):
    queryset = IssueAttachment.objects.all()
    serializer_class = IssueAttachmentSerializer
    permission_classes = [permissions.IsAuthenticated]

# User Registration View
class UserRegistrationView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            role = request.data.get('role')

            # Only allow students and lecturers to register via this endpoint
            if role not in ['student', 'lecturer']:
                return Response({"error": "Invalid role"}, status=status.HTTP_400_BAD_REQUEST)
            
            user = serializer.save(role=role)

            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            res = {
                "message": f"{role.capitalize()} registered successfully",
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            }
            return Response(res, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Lecturer Registration View (inherits from UserRegistrationView)
class LecturerRegistrationView(UserRegistrationView):
    """
    Handles lecturer registration. Same as User Registration with role='lecturer' functionality.
    """
    pass

# Student Registration View
class StudentRegistrationView(UserRegistrationView):
    """
    Handles student registration. Same as User Registration with role='student' functionality.
    """
    pass

# Registrar Signup View
class RegistrarSignupView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            role = request.data.get('role')

            # Only allow 'registrar' role to register via this endpoint
            if role != 'registrar':
                return Response({"error": "Only registrars can sign up using this endpoint."}, status=status.HTTP_400_BAD_REQUEST)
            
            user = serializer.save(role='registrar')

            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            res = {
                "message": "Registrar registered successfully",
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            }
            return Response(res, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Student Profile View
class StudentProfileView(generics.RetrieveAPIView):
    """
    Retrieves the profile of a student.
    """
    serializer_class = CustomUserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        # Ensure the user is a student before returning the profile data
        if self.request.user.role == 'student':
            return self.request.user
        else:
            raise permissions.PermissionDenied("You do not have permission to view this profile.")
    
    def retrieve(self, request, *args, **kwargs):
        # Call the parent class's retrieve method
        return super().retrieve(request, *args, **kwargs)

# User Profile View
class UserProfileView(generics.RetrieveAPIView):
    serializer_class = CustomUserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

    def retrieve(self, request, *args, **kwargs):
        user = self.get_object()
        serializer = self.get_serializer(user)
        data = serializer.data

        # Fetch issues if the user is a student or lecturer
        if user.role == 'student':
            issues = Issue.objects.filter(student=user).values(
                'id', 'title', 'description', 'category', 'priority', 'status', 'created_at', 'updated_at', 
                'courseCode', 'studentId', 'lecturer', 'department', 'semester', 'academicYear', 'issueDate', 'studentName'
            )
            data['issues'] = list(issues)
        elif user.role == 'lecturer':
            issues = Issue.objects.filter(assigned_to=user).values(
                'id', 'title', 'description', 'category', 'priority', 'status', 'created_at', 'updated_at',
                'courseCode', 'lecturer', 'department', 'semester', 'academicYear', 'issueDate', 'studentName'
            )
            data['issues'] = list(issues)

        return Response(data)

# Token Verification View (Using built-in view)
class TokenVerifyView(TokenVerifyView):
    pass

# Lecturer Details View
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import CustomUser
from rest_framework import status

class LecturerDetailsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user = request.user  # Assuming request.user is a CustomUser instance
            
            # Safely access courses_taught
            courses_taught = getattr(user, 'courses_taught', '').split(',') if getattr(user, 'courses_taught', '') else []

            # Create response data
            response_data = {
                'fullName': user.fullName,
                'email': user.email,
                'role': user.role,
                'courses_taught': courses_taught,
                'college': user.college,
                'department': user.department
            }

            return Response(response_data, status=status.HTTP_200_OK)

        except CustomUser.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

# Custom Token Obtain Pair View
class CustomTokenObtainPairView(TokenObtainPairView):
    """
    Custom view to handle JWT token generation with added functionality, if necessary.
    """
    serializer_class = TokenObtainPairSerializer

# Utility functions
def log_action(user, action):
    """
    Logs an action performed by the user.
    """
    AuditLog.objects.create(user=user, action=action)

def send_email_notification(user, subject, message):
    """
    Sends an email notification to the user.
    """
    from_email = 'your-email@example.com'
    recipient_list = [user.email]
    try:
        send_mail(subject, message, from_email, recipient_list, fail_silently=False)
        print(f"Email sent successfully to {user.email}")
    except Exception as e:
        print(f"Error sending email to {user.email}: {e}")

def send_issue_update_email(issue):
    """
    Sends an email notification when an issue is updated.
    """
    subject = f"Issue Updated: {issue.title}"
    message = f"The issue '{issue.title}' has been updated. Please check the system for details."
    recipient_list = [issue.student.email]
    try:
        send_mail(subject, message, 'your-email@example.com', recipient_list, fail_silently=False)
        print(f"Issue update email sent successfully to {issue.student.email}")
    except Exception as e:
        print(f"Error sending issue update email to {issue.student.email}: {e}")