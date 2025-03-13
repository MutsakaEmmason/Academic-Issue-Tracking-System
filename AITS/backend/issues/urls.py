from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CustomUserViewSet, IssueViewSet, CommentViewSet, NotificationViewSet, AuditLogViewSet
from .views import IssueAttachmentViewSet, StudentRegistrationView

# Initialize the router
router = DefaultRouter()
router.register(r'users', CustomUserViewSet)
router.register(r'issues', IssueViewSet)
router.register(r'comments', CommentViewSet)  # Corrected to plural for consistency
router.register(r'notifications', NotificationViewSet)
router.register(r'audit-logs', AuditLogViewSet)
router.register(r'attachments', IssueAttachmentViewSet)

urlpatterns = [
    path('', include(router.urls)),  # Include the router URLs for the viewsets
    path('issues/<int:pk>/assign/', IssueViewSet.as_view({'patch': 'assign'}), name='issue-assign'),  # Custom action to assign an issue
    path('issues/<int:pk>/resolve/', IssueViewSet.as_view({'patch': 'resolve'}), name='issue-resolve'),  # Custom action to resolve an issue
    path('register/', StudentRegistrationView.as_view(), name='student-registration'),  # Endpoint for student registration
]
