from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CustomUserViewSet, IssueViewSet, CommentViewSet, NotificationViewSet, AuditLogViewSet
from .views import IssueAttachmentViewSet, StudentRegistrationView, StudentProfileView, UserRegistrationView, \
    LecturerRegistrationView, CustomTokenObtainPairView, RegistrarSignupView, UserProfileView  # Correct imports

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

    path('register/', UserRegistrationView.as_view(), name='user-registration'),  # Endpoint for user registration
    path('lecturer/register/', LecturerRegistrationView.as_view(), name='lecturer-registration'),  # Lecturer registration endpoint
    path('lecturer/login/', CustomTokenObtainPairView.as_view(), name='lecturer-login'),  # Custom login endpoint for lecturers
    path('student-profile/', UserProfileView.as_view(), name='student-profile'),  # Endpoint for profile view

    path('registrar/signup/', RegistrarSignupView.as_view(), name='registrar-signup'),  # Registrar signup
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),  # Custom JWT login
]
