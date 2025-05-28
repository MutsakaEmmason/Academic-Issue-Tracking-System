from rest_framework import viewsets, permissions
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework import  viewsets, permissions, generics, status, filters
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django_filters.rest_framework import DjangoFilterBackend
from django.core.mail import send_mail
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.db.models import Q
import logging
from .permissions import IsStudent, IsLecturer, IsRegistrar # Ensure these are correct
from django.shortcuts import get_object_or_404,render
from django.http import HttpResponse
from django.http import JsonResponse
import requests
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework_simplejwt.views import TokenObtainPairView, TokenVerifyView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.middleware.csrf import get_token
from django.utils import timezone
from rest_framework.exceptions import PermissionDenied
from .models import CustomUser, Issue, Comment, Notification, AuditLog, IssueAttachment
from .serializers import CustomUserSerializer, IssueSerializer, CommentSerializer, NotificationSerializer, AuditLogSerializer, IssueAttachmentSerializer,CustomTokenObtainPairSerializer
# Removed: from rest_framework.decorators import action # No longer needed for IssueViewSet actions


# Define a view for the root URL to render index.html
def home(request):
    return render(request, 'index.html')


# EMPHASIZE: Add the GetCSRFToken view here
class GetCSRFToken(APIView):
    permission_classes = [permissions.AllowAny] # Allow anyone to get the CSRF token
    def get(self, request):
        csrf_token = get_token(request)
        return JsonResponse({'csrfToken': csrf_token})

# CustomUser ViewSet
class CustomUserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [permissions.IsAuthenticated]

# Issue ViewSet
class IssueViewSet(viewsets.ModelViewSet):
    queryset = Issue.objects.all()
    serializer_class = IssueSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['category', 'status', 'assigned_to', 'student']
    search_fields = ['category', 'title', 'description']

    def get_queryset(self):
        user = self.request.user
        queryset = Issue.objects.all()

        if user.role == 'student':
            queryset = queryset.filter(student=user)
        elif user.role == 'lecturer':
            queryset = queryset.filter(assigned_to=user)
        elif user.role == 'registrar':
            queryset = queryset.filter(college=user.college)

        status_param = self.request.query_params.get('status')
        if status_param:
            queryset = queryset.filter(status=status_param)

        assigned_to_param = self.request.query_params.get('assigned_to')
        if assigned_to_param:
            queryset = queryset.filter(assigned_to=assigned_to_param)

        search_query = self.request.query_params.get('search')
        if search_query:
            queryset = queryset.filter(Q(title__icontains=search_query) | Q(description__icontains=search_query))

        return queryset

    def get_permissions(self):
        if self.action == 'create':
            return [IsAuthenticated(), IsStudent()]
        elif self.action in ['update', 'partial_update']:
            return [IsAuthenticated()]
        elif self.action == 'destroy':
            return [IsAuthenticated(), IsRegistrar()]
        return [IsAuthenticated()]

    def create(self, request, *args, **kwargs):
        if request.user.role != 'student':
            return Response({"error": "Only students can submit issues."}, status=status.HTTP_403_FORBIDDEN)

        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            issue = serializer.save(
                student=request.user,
                studentName=request.data.get('studentName'),
                college=request.user.college
            )

            registrar = CustomUser.objects.filter(college=issue.college, role='registrar').first()
            if registrar:
                issue.assigned_to = registrar
                issue.status = 'pending'
                issue.save()

            files = request.FILES.getlist('attachments', [])
            for file in files:
                IssueAttachment.objects.create(issue=issue, file=file)

            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        user = request.user

        if user.role == 'student' and instance.student != user:
            return Response({"detail": "You cannot update an issue that is not yours."}, status=status.HTTP_403_FORBIDDEN)
        elif user.role == 'registrar' and instance.college != user.college:
            return Response({"detail": "You cannot update issues outside your college."}, status=status.HTTP_403_FORBIDDEN)

        serializer = self.get_serializer(instance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # REMOVED: @action(detail=True, methods=['patch'], permission_classes=[IsAuthenticated, IsLecturer])
    # def resolve(self, request, pk=None):
    #     # Functionality moved to ResolveIssueView
    #     pass

    # REMOVED: @action(detail=True, methods=['patch'], permission_classes=[IsAuthenticated, IsRegistrar])
    # def assign_to_lecturer(self, request, pk=None):
    #     # Functionality moved to AssignIssueView
    #     pass

logger = logging.getLogger(__name__)

# RegistrarProfileView (Keep as is, it's fine for registrar profiles)
class LecturerListView(generics.ListAPIView):
    queryset = CustomUser.objects.filter(role='lecturer')
    serializer_class = CustomUserSerializer # Use CustomUserSerializer for full details, or a simpler one if needed
    permission_classes = [permissions.IsAuthenticated, IsRegistrar] # Only registrars can see this list

    def get_queryset(self):
        # Further restrict to lecturers within the registrar's college if desired
        user = self.request.user
        if user.role == 'registrar':
            return self.queryset.filter(college=user.college)
        return self.queryset.none()
class RegistrarProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        if user.role != 'registrar':
            logger.error(f"Access denied for user {user.username}. Not a registrar.")
            return Response({"error": "Access denied. You are not a registrar."}, status=403)

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
class UserRegistrationView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            role = request.data.get('role')
            if role not in ['student', 'lecturer']:
                return Response({"error": "Invalid role"}, status=status.HTTP_400_BAD_REQUEST)
            user = serializer.save(role=role)
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
    pass

# Student Registration View
class StudentRegistrationView(UserRegistrationView):
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
            if role != 'registrar':
                return Response({"error": "Only registrars can sign up using this endpoint."}, status=status.HTTP_400_BAD_REQUEST)
            user = serializer.save(role='registrar')
            refresh = RefreshToken.for_user(user)
            res = {
                "message": "Registrar registered successfully",
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            }
            return Response(res, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# REINTRODUCED: ResolveIssueView to match urls.py
class ResolveIssueView(APIView):
    # Combine permissions: either a Lecturer (who is assigned) OR a Registrar
    # You might need to adjust IsLecturer's has_object_permission if it's too restrictive
    permission_classes = [IsAuthenticated] # Start with just authenticated, then add custom logic

    def patch(self, request, issue_id, *args, **kwargs):
        try:
            issue = Issue.objects.get(id=issue_id)
        except Issue.DoesNotExist:
            return Response({"error": "Issue not found."}, status=status.HTTP_404_NOT_FOUND)

        user = request.user # The logged-in user

        # --- IMPORTANT PERMISSION LOGIC REVISION ---
        # A lecturer can only resolve issues assigned to them.
        # A registrar can resolve any issue (or specific types, as per your rule).

        # Check if the user is a lecturer and if they are assigned to this issue
        is_assigned_lecturer = user.role == 'lecturer' and issue.assigned_to == user

        # Check if the user is a registrar
        is_registrar = user.role == 'registrar'

        # If it's a lecturer, they MUST be the assigned lecturer
        if user.role == 'lecturer' and not is_assigned_lecturer:
            return Response(
                {"detail": "As a lecturer, you are not authorized to resolve this issue unless it's assigned to you."},
                status=status.HTTP_403_FORBIDDEN
            )

        # If it's neither a lecturer (who is assigned) nor a registrar, forbid access
        if not is_assigned_lecturer and not is_registrar:
            return Response(
                {"detail": "You are not authorized to resolve issues."},
                status=status.HTTP_403_FORBIDDEN
            )

        # Optional: Additional check for registrars if they can ONLY resolve unassigned issues
        # if is_registrar and issue.assigned_to is not None:
        #     return Response(
        #         {"detail": "Registrars can only resolve unassigned issues."},
        #         status=status.HTTP_403_FORBIDDEN
        #     )


        # Common logic for both roles once authorized
        if issue.status == 'resolved':
            return Response({"error": "Issue is already resolved."}, status=status.HTTP_400_BAD_REQUEST)

        resolution_note = request.data.get('resolution_note')
        if not resolution_note:
            return Response({"error": "Resolution note is required."}, status=status.HTTP_400_BAD_REQUEST)

        issue.resolution_note = resolution_note
        issue.resolved_by = user # Set the user who resolved it
        issue.resolved_at = timezone.now() # Make sure to import timezone: `from django.utils import timezone`
        issue.status = 'resolved'
        issue.save()

        # Assuming you have log_action and send_email_notification functions
        # log_action(user, f"Issue '{issue.title}' (ID: {issue.id}) resolved by {user.username}.")
        # send_email_notification(issue.student, "Issue Resolved", f"Your issue '{issue.title}' has been resolved.")
        # if issue.assigned_to: # Notify assigned lecturer if any
        #     send_email_notification(issue.assigned_to, "Issue Resolved by Registrar", f"Issue '{issue.title}' was resolved by the Registrar.")


        serializer = IssueSerializer(issue)
        return Response(serializer.data, status=status.HTTP_200_OK)


# REINTRODUCED: AssignIssueView to match urls.py
class AssignIssueView(APIView):
    permission_classes = [IsAuthenticated, IsRegistrar] # Only registrars can assign

    def patch(self, request, issue_id, *args, **kwargs):
        try:
            issue = Issue.objects.get(id=issue_id)
        except Issue.DoesNotExist:
            return Response({"error": "Issue not found."}, status=status.HTTP_404_NOT_FOUND)

        user = request.user # This will be the registrar

        if user.role != 'registrar': # Redundant if IsRegistrar permission is used, but safe
            return Response({"error": "Only registrars can assign issues."}, status=status.HTTP_403_FORBIDDEN)

        if issue.college != user.college:
            return Response({"error": "You can only assign issues from your own college."}, status=status.HTTP_403_FORBIDDEN)

        lecturer_id = request.data.get('assigned_to_id') # Expecting lecturer ID
        if not lecturer_id:
            return Response({"error": "No lecturer ID specified."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            lecturer = CustomUser.objects.get(id=lecturer_id, role='lecturer', college=user.college)
        except CustomUser.DoesNotExist:
            return Response({"error": "Lecturer not found or not from your college."}, status=status.HTTP_404_NOT_FOUND)

        issue.assigned_to = lecturer
        issue.status = 'assigned' # Set status to assigned
        issue.save()

        log_action(user, f"Issue '{issue.title}' (ID: {issue.id}) assigned to lecturer {lecturer.username}.")
        send_email_notification(issue.student, "Issue Assigned", f"Your issue '{issue.title}' has been assigned to a lecturer.")
        send_email_notification(lecturer, "New Issue Assigned", f"Issue '{issue.title}' has been assigned to you. Please review.")


        serializer = IssueSerializer(issue) # Use IssueSerializer to return updated issue data
        return Response(serializer.data, status=status.HTTP_200_OK)


# Student Profile View (Keep as is)
class StudentProfileView(generics.RetrieveAPIView):
    serializer_class = CustomUserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        print(f"DEBUG: User object in StudentProfileView: {self.request.user}")
        print(f"DEBUG: User role in StudentProfileView: {self.request.user.role}")
        print(f"DEBUG: Is user authenticated? {self.request.user.is_authenticated}")

        if self.request.user.role == 'student':
            print("DEBUG: User role IS 'student'. Returning user.")
            return self.request.user
        else:
            print(f"DEBUG: User role is NOT 'student'. It's '{self.request.user.role}'. Raising PermissionDenied.")
            raise PermissionDenied("You do not have permission to view this profile.")

    def retrieve(self, request, *args, **kwargs):
        user = self.get_object()
        serializer = self.get_serializer(user)
        data = serializer.data

        issues = Issue.objects.filter(student=user).values(
            'id', 'title', 'description', 'category', 'priority', 'status', 'created_at', 'updated_at',
            'courseCode', 'studentId', 'lecturer', 'department', 'semester', 'academicYear', 'issueDate', 'studentName'
        )
        data['issues'] = list(issues)
        return Response(data)

# User Profile View (Keep as is, it already handles lecturer issues)
class UserProfileView(generics.RetrieveAPIView):
    serializer_class = CustomUserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

    def retrieve(self, request, *args, **kwargs):
        user = self.get_object()
        serializer = self.get_serializer(user)
        data = serializer.data

        if user.role == 'student':
            issues = Issue.objects.filter(student=user).values(
                'id', 'title', 'description', 'category', 'priority', 'status', 'created_at', 'updated_at',
                'courseCode', 'studentId', 'lecturer', 'department', 'semester', 'academicYear', 'issueDate', 'studentName'
            )
            data['issues'] = list(issues)
        elif user.role == 'lecturer':
            issues = Issue.objects.filter(assigned_to=user).values( # This is the key line for lecturer issues
                'id', 'title', 'description', 'category', 'priority', 'status', 'created_at', 'updated_at',
                'courseCode', 'lecturer', 'department', 'semester', 'academicYear', 'issueDate', 'studentName'
            )
            data['issues'] = list(issues)
        return Response(data)

# Token Verification View (Using built-in view)
class TokenVerifyView(TokenVerifyView):
    pass

# Lecturer Details View (Keep as is, it's for profile data)
class LecturerDetailsView(APIView):
    permission_classes = [IsAuthenticated, IsLecturer] # Add IsLecturer permission here for stronger check

    def get(self, request):
        try:
            user = request.user
            if user.role != 'lecturer': # Redundant if IsLecturer permission is used, but safe
                return Response({'error': 'Access denied. You are not a lecturer.'}, status=status.HTTP_403_FORBIDDEN)

            courses_taught = getattr(user, 'courses_taught', '').split(',') if getattr(user, 'courses_taught', '') else []

            response_data = {
                'id': user.id, # Add id, useful for frontend
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
        except Exception as e:
            logger.error(f"Error in LecturerDetailsView: {e}", exc_info=True)
            return Response({'error': 'An unexpected error occurred.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# Custom Token Obtain Pair View
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

# Utility functions (Keep as is)
def log_action(user, action):
    AuditLog.objects.create(user=user, action=action)

def send_email_notification(user, subject, message):
    from_email = 'your-email@example.com'
    recipient_list = [user.email]
    try:
        send_mail(subject, message, from_email, recipient_list, fail_silently=False)
        print(f"Email sent successfully to {user.email}")
    except Exception as e:
        print(f"Error sending email to {user.email}: {e}")

def send_issue_update_email(issue):
    subject = f"Issue Updated: {issue.title}"
    message = f"The issue '{issue.title}' has been updated. Please check the system for details."
    recipient_list = [issue.student.email]
    try:
        send_mail(subject, message, 'your-email@example.com', recipient_list, fail_silently=False)
        print(f"Issue update email sent successfully to {issue.student.email}")
    except Exception as e:
        print(f"Error sending issue update email to {issue.student.email}: {e}")


def api_proxy(request, path):
    url = f"{request.scheme}://{request.get_host()}/api/{path}"
    try:
        response = requests.request(
            method=request.method,
            url=url,
            headers={k: v for k, v in request.headers.items() if k != 'Host'},
            data=request.body,
            cookies=request.COOKIES,
            allow_redirects=False
        )
        django_response = HttpResponse(
            content=response.content,
            status=response.status_code,
        )
        for header, value in response.headers.items():
            if header.lower() not in ['content-length', 'content-encoding', 'transfer-encoding']:
                django_response[header] = value
        return django_response
    except Exception as e:
        return HttpResponse(f"Error proxying request: {str(e)}", status=500)
