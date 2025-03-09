from rest_framework import viewsets, filters
from rest_framework.permissions import AllowAny
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status, permissions
from django.core.mail import send_mail
from django.conf import settings
from .permissions import IsStudent, IsLecturer, IsHOD, IsRegistrar
from .models import CustomUser, Issue, Comment, Notification, AuditLog, IssueAttachment
from .serializers import CustomUserSerializer, IssueSerializer, CommentSerializer, NotificationSerializer, AuditLogSerializer, IssueAttachmentSerializer

# CustomUser ViewSet.
class CustomUserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [IsAuthenticated]

# Issue ViewSet
class IssueViewSet(viewsets.ModelViewSet):
    queryset = Issue.objects.all()
    serializer_class = IssueSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['created_at', 'status', 'category']
       
       
    def get_queryset(self):
        user = self.request.user
        queryset = Issue.objects.all()
        
        if user.is_superuser:
            return queryset
        elif user.groups.filter(name="lecturers").exists():
            return queryset.filter(assigned_to=user)
        queryset = queryset.filter(student=user)

    
         
        # Filtering based on query params
        status = self.request.query_params.get('status', None)
        category = self.request.query_params.get('category', None)
        assigned_to = self.request.query_params.get('assigned_to', None)

        if status:
            queryset = queryset.filter(status=status)
        if category:
            queryset = queryset.filter(category=category)
        if assigned_to:
            queryset = queryset.filter(assigned_to__id=assigned_to)

        return queryset
    
    def perform_create(self, serializer):
        serializer.save(student=self.request.user)
        issue = serializer.save(student=self.request.user)
        Notification.objects.create(
            user=issue.student,
            message=f"Your issue '{issue.title}' has been submitted."
        )
    def get_permissions(self):
        if self.action == 'create':
            return [ IsStudent().permissions.IsAuthenticated()]
        elif self.action in ['update', 'partial_update']:
            return [IsAuthenticated(), (IsLecturer() | IsHOD() | IsRegistrar())]
        elif self.action == 'destroy':
            return [IsAuthenticated(), IsRegistrar()]
        return [IsAuthenticated()]
    
    def perform_update(self, serializer):
        instance = serializer.save()
        log_action(self.request.user, f"Updated issue '{instance.title}'")
        send_issue_update_email(instance)
 
 
     
     
    @action(detail=True, methods=['patch'], permission_classes=[IsAuthenticated])
    def assign(self, request, pk=None):
        """Assign an issue to a lecturer"""
        issue = self.get_object()
        if not request.user.is_registrar:
            return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)

        lecturer_id = request.data.get('assigned_to')
        if not lecturer_id:
            return Response({"error": "Lecturer ID is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            lecturer = CustomUser.objects.get(id=lecturer_id, role="lecturer")
            issue.assigned_to = lecturer
            issue.status = "Assigned"
            issue.save()

            # Send a notification to the lecturer
            Notification.objects.create(
                user=lecturer,
                message=f"You have been assigned issue {issue.id}."
            )

            return Response({"message": "Issue assigned successfully"}, status=status.HTTP_200_OK)
        except CustomUser.DoesNotExist:
            return Response({"error": "Lecturer not found"}, status=status.HTTP_404_NOT_FOUND)



# Comment ViewSet
class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_queryset(self):
        return Comment.objects.filter(issue__student=self.request.user) if self.request.user.role == "student" else Comment.objects.all()

# Notification ViewSet
class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)

# AuditLog ViewSet (Only Accessible by HOD & Registrar)
class AuditLogViewSet(viewsets.ModelViewSet):
    queryset = AuditLog.objects.all()
    serializer_class = AuditLogSerializer
    permission_classes = [IsAuthenticated, IsHOD | IsRegistrar]

    def get_queryset(self):
        user = self.request.user
        if user.role in ['hod', 'registrar']:
            return AuditLog.objects.all()
        return AuditLog.objects.none()

# IssueAttachment ViewSet
class IssueAttachmentViewSet(viewsets.ModelViewSet):
    queryset = IssueAttachment.objects.all()
    serializer_class = IssueAttachmentSerializer
    permission_classes = [IsAuthenticated]

# Audit Logging Function
def log_action(user, action):
    AuditLog.objects.create(user=user, action=action)

# Issue Update Email Notification
def send_issue_update_email(issue):
    send_mail(
        subject=f"Issue Update: {issue.title}",
        message=f"The issue '{issue.title}' has been updated. Status: {issue.status}.",
        from_email="no-reply@aits.com",
        recipient_list=[issue.student.email, issue.assigned_to.email] if issue.assigned_to else [issue.student.email],
    )



    @action(detail=True, methods=['patch'], permission_classes=[IsAuthenticated])
    def resolve(self, request, pk=None):
        """Mark an issue as resolved"""
        issue = self.get_object()
        if not request.user.is_registrar:
            return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)

        if issue.status != "Assigned":
            return Response({"error": "Issue must be assigned before resolving"}, status=status.HTTP_400_BAD_REQUEST)

        issue.status = "Resolved"
        issue.save()

        # Send notification to user

def send_notification(user, message):
    Notification.objects.create(user=user, message=message)

def perform_create(self, serializer):
    issue = serializer.save(student=self.request.user)
    send_notification(issue.student, f"Issue '{issue.title}' has been submitted.")

    
 
 
    

    def send_email_notification(user, subject, message):
        """Send an email notification"""
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
            fail_silently=False,
        )

    @action(detail=True, methods=['patch'], permission_classes=[IsAuthenticated])
    def assign(self, request, pk=None):
        """Assign an issue to a lecturer"""
        issue = self.get_object()
        lecturer_id = request.data.get('assigned_to')
        lecturer = CustomUser.objects.get(id=lecturer_id, role="lecturer")

        issue.assigned_to = lecturer
        issue.status = "Assigned"
        issue.save()

       
        #Send email
        send_email_notification(lecturer, "New Issue Assigned",
                                f"You have been assigned issue {issue.id}.")
        send_email_notification(issue.student, "Issue Status Updated",
                                f"Your issue {issue.id} has been assigned.")

        return Response({"message": "Issue assigned successfully"}, status=status.HTTP_200_OK)
      
      
      

