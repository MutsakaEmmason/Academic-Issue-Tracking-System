from rest_framework import viewsets, permissions, generics
from .models import CustomUser, Issue, Comment, Notification, AuditLog, IssueAttachment
from .serializers import CustomUserSerializer, IssueSerializer, CommentSerializer, NotificationSerializer, AuditLogSerializer, IssueAttachmentSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework import status

class CustomUserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [permissions.IsAuthenticated]

class IssueViewSet(viewsets.ModelViewSet):
    queryset = Issue.objects.all()
    serializer_class = IssueSerializer
    permission_classes = [permissions.IsAuthenticated]

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]

class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

class AuditLogViewSet(viewsets.ModelViewSet):
    queryset = AuditLog.objects.all()
    serializer_class = AuditLogSerializer
    permission_classes = [permissions.IsAuthenticated]

class IssueAttachmentViewSet(viewsets.ModelViewSet):
    queryset = IssueAttachment.objects.all()
    serializer_class = IssueAttachmentSerializer
    permission_classes = [permissions.IsAuthenticated]

class StudentRegistrationView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            print("Serializer is valid!")
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            res = {
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            }
            return Response(res, status=status.HTTP_201_CREATED)
        else:
            print("Serializer is NOT valid!")
            print(serializer.errors)  # Print the errors
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# New View for Student Profile
class StudentProfileView(generics.RetrieveAPIView):
    serializer_class = CustomUserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

    def retrieve(self, request, *args, **kwargs):
        user = self.get_object()
        serializer = self.get_serializer(user)
        issues = Issue.objects.filter(student=user).values('id', 'title','description', 'category', 'priority', 'status', 'created_at', 'updated_at') # get issues.
        data = serializer.data
        data['issues'] = list(issues)
        return Response(data)

# Helper function to log actions (like updates to issues)
def log_action(user, action):
    AuditLog.objects.create(user=user, action=action)

# Issue Update Email Notification
def send_issue_update_email(issue):
    subject = f"Issue Update: {issue.title}"
    message = f"The issue '{issue.title}' has been updated. Status: {issue.status}."
    send_email_notification(issue.student, subject, message)
    if issue.assigned_to:
        send_email_notification(issue.assigned_to, subject, message)