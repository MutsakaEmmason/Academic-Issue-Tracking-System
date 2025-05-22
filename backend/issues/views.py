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
import logging
from .permissions import IsStudent, IsLecturer, IsRegistrar
from django.shortcuts import get_object_or_404,render
from django.http import HttpResponse
import requests
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework_simplejwt.views import TokenObtainPairView, TokenVerifyView  # Import the correct TokenVerifyView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import CustomUser, Issue, Comment, Notification, AuditLog, IssueAttachment
from .serializers import CustomUserSerializer, IssueSerializer, CommentSerializer, NotificationSerializer, AuditLogSerializer, IssueAttachmentSerializer

# Define a view for the root URL to render index.html
def home(request):
    return render(request, 'index.html')
# CustomUser ViewSet
class CustomUserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [permissions.IsAuthenticated]

# Issue ViewSet
class IssueViewSet(viewsets.ModelViewSet):
    queryset = Issue.objects.all()
    serializer_class = IssueSerializer
    permission_classes = [permissions.IsAuthenticated]  # Add role-specific permissions below
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
        elif user.role == 'registrar':
            # Ensure that the registrar can only view issues from their respective college
            college = user.college
            queryset = queryset.filter(college=user.college)


        # Additional search filter
        search_query = self.request.query_params.get('search', None)
        if search_query:
            queryset = queryset.filter(
                Q(title__icontains=search_query) |
                Q(description__icontains=search_query)
            )

        return queryset

    # views.py
    def create(self, request, *args, **kwargs):
        if request.user.role != 'student':
            return Response({"error": "Only students can submit issues."}, status=403)

        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            student_name = request.data.get('studentName')
            issue = serializer.save(
                student=request.user,
                studentName=student_name,
                college=request.user.college  # Always pull from logged-in student
            )

            # Automatically assign registrar of that college
            registrar = CustomUser.objects.filter(
                college=issue.college,
                role='registrar'
            ).first()

            if registrar:
                issue.assigned_to = registrar
                issue.save()

            # Handle attachments
            files = request.FILES.getlist('attachments', [])
            for file in files:
                IssueAttachment.objects.create(issue=issue, file=file)

            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



    def update(self, request, *args, **kwargs):
        instance = self.get_object()

        # Ensure the user is trying to update an issue they are allowed to
        user = request.user
        
        if user.role == 'student' and instance.student != user:
            # Students can only update their own issues
            return Response({"detail": "You cannot update an issue that is not yours."}, status=status.HTTP_403_FORBIDDEN)

        if user.role == 'lecturer' and instance.assigned_to != user:
            # Lecturers can only update issues assigned to them
            return Response({"detail": "You cannot update an issue that is not assigned to you."}, status=status.HTTP_403_FORBIDDEN)

        if user.role == 'registrar' and instance.college != user.college:
            # Registrars can only update issues related to their own college
            return Response({"detail": "You cannot update issues outside your college."}, status=status.HTTP_403_FORBIDDEN)

        # Continue with the update process if permission checks pass
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            log_action(request.user, f"Issue updated: {instance.title}")
            send_issue_update_email(instance)
            return Response(serializer.data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
logger = logging.getLogger(__name__)

class RegistrarProfileView(APIView):
    permission_classes = [IsAuthenticated]  # This ensures the user is authenticated

    def get(self, request):
        user = request.user  # The user should be authenticated if the token is valid

        if user.role != 'registrar':
            logger.error(f"Access denied for user {user.username}. Not a registrar.")
            return Response({"error": "Access denied. You are not a registrar."}, status=403)

        # If user is registrar, return profile data
        full_name = f"{user.first_name} {user.last_name}".strip()
        data = {
            'id': user.id,
            'fullName': full_name,
            'email': user.email,
            'role': user.role,
            'college': user.college
        }

        return Response(data, status=200)



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
@method_decorator(csrf_exempt, name='dispatch')
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
@method_decorator(csrf_exempt, name='dispatch')
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
    
class ResolveIssueView(APIView):
    permission_classes = [IsAuthenticated, IsRegistrar]  # Only allow registrars to access this view

    def post(self, request, issue_id, *args, **kwargs):
        # Ensure the user is a registrar
        user = request.user
        if user.role != 'registrar':
            return Response({"error": "Only registrars can resolve issues."}, status=status.HTTP_403_FORBIDDEN)

        # Get the issue object
        issue = get_object_or_404(Issue, id=issue_id)

        # Check if the registrar is from the same college as the issue
        if issue.college != user.college:
            return Response({"error": "You can only resolve issues from your own college."}, status=status.HTTP_403_FORBIDDEN)

        # Update the issue status to 'resolved'
        issue.status = 'resolved'
        issue.resolution_note = request.data.get("resolution_note", "No resolution note provided.")  # Optional note
        issue.save()

        # Optionally, create a comment indicating the issue was resolved by the registrar
        Comment.objects.create(
            issue=issue,
            user=user,
            text=f"Issue resolved by registrar: {issue.resolution_note}"
        )

        # Send a notification (or email) about the resolution
        send_email_notification(issue.student, "Issue Resolved", f"Your issue '{issue.title}' has been resolved by the registrar.")

        return Response({"message": "Issue resolved successfully."}, status=status.HTTP_200_OK)
    
class AssignIssueView(APIView):
    permission_classes = [IsAuthenticated, IsRegistrar]
    
    def patch(self, request, issue_id, *args, **kwargs):
        # Ensure the user is a registrar
        user = request.user
        if user.role != 'registrar':
            return Response({"error": "Only registrars can assign issues."}, status=status.HTTP_403_FORBIDDEN)
        
        # Get the issue object
        issue = get_object_or_404(Issue, id=issue_id)
        
        # Check if the registrar is from the same college as the issue
        if issue.college != user.college:
            return Response({"error": "You can only assign issues from your own college."}, status=status.HTTP_403_FORBIDDEN)
        
        # Get the lecturer to assign the issue to
        lecturer_id = request.data.get('assigned_to')
        if not lecturer_id:
            return Response({"error": "No lecturer specified."}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            lecturer = CustomUser.objects.get(id=lecturer_id, role='lecturer', college=user.college)
        except CustomUser.DoesNotExist:
            return Response({"error": "Lecturer not found or not from your college."}, status=status.HTTP_404_NOT_FOUND)
        
        # Assign the issue to the lecturer
        issue.assigned_to = lecturer
        issue.status = 'assigned'  # Update status to reflect assignment
        issue.save()
        
        # Create a comment to log the assignment
        Comment.objects.create(
            issue=issue,
            user=user,
            text=f"Issue assigned to lecturer {lecturer.first_name} {lecturer.last_name} by registrar."
        )
        
        # Return the updated issue
        serializer = IssueSerializer(issue)
        return Response(serializer.data, status=status.HTTP_200_OK)

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



def api_proxy(request, path):
    """
    Proxy API requests from hardcoded localhost URLs to the current domain
    """
    url = f"{request.scheme}://{request.get_host()}/api/{path}"
    
    # Forward the request to the actual API endpoint
    try:
        response = requests.request(
            method=request.method,
            url=url,
            headers={k: v for k, v in request.headers.items() if k != 'Host'},
            data=request.body,
            cookies=request.COOKIES,
            allow_redirects=False
        )
        
        # Return the response from the API
        django_response = HttpResponse(
            content=response.content,
            status=response.status_code,
        )
        
        # Copy relevant headers from the API response
        for header, value in response.headers.items():
            if header.lower() not in ['content-length', 'content-encoding', 'transfer-encoding']:
                django_response[header] = value
                
        return django_response
    except Exception as e:
        return HttpResponse(f"Error proxying request: {str(e)}", status=500)
