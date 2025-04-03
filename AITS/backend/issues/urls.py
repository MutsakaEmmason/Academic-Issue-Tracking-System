from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CustomUserViewSet, IssueViewSet, CommentViewSet, NotificationViewSet, 
    AuditLogViewSet, IssueAttachmentViewSet, StudentRegistrationView, 
    StudentProfileView, RegistrarSignupView, CustomTokenObtainPairView
)
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
    path('register/', StudentRegistrationView.as_view(), name='student-registration'),  # Student registration
    path('registrar/signup/', RegistrarSignupView.as_view(), name='registrar-signup'),  # Registrar signup
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),  # Custom login
    path('student-profile/', StudentProfileView.as_view(), name='student-profile'),  # Student profile
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),  # Custom JWT login
]
