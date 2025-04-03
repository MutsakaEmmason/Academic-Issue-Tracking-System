from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CustomUserViewSet, IssueViewSet, CommentViewSet, NotificationViewSet, AuditLogViewSet
from .views import IssueAttachmentViewSet, UserRegistrationView, UserProfileView, LecturerRegistrationView  # Import lecturer registration view
from rest_framework_simplejwt.views import TokenObtainPairView
from .views import CustomTokenObtainPairView  # Ensure you import your custom login view

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
    path('register/', UserRegistrationView.as_view(), name='student-registration'),  # Endpoint for user registration
    path('lecturer/register/', LecturerRegistrationView.as_view(), name='lecturer-registration'),  # Lecturer registration endpoint
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),  # Endpoint for generic login
    path('lecturer/login/', CustomTokenObtainPairView.as_view(), name='lecturer-login'),  # Custom login endpoint for lecturers
    path('student-profile/', UserProfileView.as_view(), name='student-profile'),  # Endpoint for profile view
]
