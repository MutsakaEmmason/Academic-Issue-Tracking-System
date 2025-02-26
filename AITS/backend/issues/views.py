from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .permissions import IsStudent, IsLecturer, IsHOD, IsRegistrar
from .models import CustomUser, Issue, Comment, Notification, AuditLog
from .serializers import CustomUserSerializer, IssueSerializer, CommentSerializer, NotificationSerializer, AuditLogSerializer

# CustomUser ViewSet.
class CustomUserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [IsAuthenticated]

# Issue ViewSet
class IssueViewSet(viewsets.ModelViewSet):
    queryset = Issue.objects.all()
    serializer_class = IssueSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser:
            return Issue.objects.all()
        elif user.groups.filter(name="lecturers").exists():
            return Issue.objects.filter(assigned_to=user)
        return Issue.objects.filter(student=user)
    
    def get_permissions(self):
        permissions = super().get_permissions()
        if self.action in ['create', 'list']:
            permissions.append(IsStudent())
        elif self.action in ['update', 'partial_update']:
            permissions.append(IsLecturer() | IsHOD() | IsRegistrar())
        elif self.action == 'destroy':
            permissions.append(IsRegistrar())
        return permissions


# Comment ViewSet
class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

# Notification ViewSet
class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Notification.objects.filter(user=user)

# AuditLog ViewSet
class AuditLogViewSet(viewsets.ModelViewSet):
    queryset = AuditLog.objects.all()
    serializer_class = AuditLogSerializer
    permission_classes = [IsAuthenticated]
    
    
    