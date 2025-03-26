from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CustomUserViewSet, IssueViewSet, CommentViewSet, NotificationViewSet, AuditLogViewSet
from .views import IssueAttachmentViewSet, StudentRegistrationView, StudentProfileView # Corrected import
from rest_framework_simplejwt.views import TokenObtainPairView

# Initialize the router
router = DefaultRouter()
router.register(r'users', CustomUserViewSet)
router.register(r'issues', IssueViewSet, basename='issue')
router.register(r'comments', CommentViewSet)
router.register(r'notifications', NotificationViewSet)
router.register(r'audit-logs', AuditLogViewSet)
router.register(r'attachments', IssueAttachmentViewSet)

urlpatterns = [
    path('', include(router.urls)),  # Include the router URLs for the viewsets
    path('register/', StudentRegistrationView.as_view(), name='student-registration'),  # Endpoint for student registration
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'), #add login url
    path('student-profile/', StudentProfileView.as_view(), name='student-profile'),
]