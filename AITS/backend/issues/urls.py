from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CustomUserViewSet, IssueViewSet, CommentViewSet, NotificationViewSet, AuditLogViewSet

router = DefaultRouter()
router.register(r'users', CustomUserViewSet)
router.register(r'issues', IssueViewSet)
router.register(r'comment', CommentViewSet)
router.register(r'notifications', NotificationViewSet)
router.register(r'audit-logs', AuditLogViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
