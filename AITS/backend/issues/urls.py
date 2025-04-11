from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenVerifyView, TokenRefreshView
from .views import CustomUserViewSet, IssueViewSet, CommentViewSet, NotificationViewSet, AuditLogViewSet
from .views import IssueAttachmentViewSet, StudentRegistrationView, StudentProfileView, UserRegistrationView, \
    LecturerRegistrationView, CustomTokenObtainPairView, AssignIssueView, ResolveIssueView, RegistrarSignupView, UserProfileView, LecturerDetailsView,  RegistrarProfileView

# Initialize the router
router = DefaultRouter()
router.register(r'users', CustomUserViewSet)
router.register(r'issues', IssueViewSet, basename='issue')
router.register(r'comments', CommentViewSet)
router.register(r'notifications', NotificationViewSet)
router.register(r'audit-logs', AuditLogViewSet)
router.register(r'attachments', IssueAttachmentViewSet)

urlpatterns = [
    # Include the router URLs for the viewsets
    path('', include(router.urls)),

    # JWT Token paths
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),

    # Registration and Lecturer routes
    path('register/', UserRegistrationView.as_view(), name='user-registration'),
    path('lecturer/register/', LecturerRegistrationView.as_view(), name='lecturer-registration'),
    path('lecturer/login/', CustomTokenObtainPairView.as_view(), name='lecturer-login'),
    path('resolve-issue/<int:issue_id>/', ResolveIssueView.as_view(), name='resolve-issue'),
    path('issues/<int:issue_id>/assign/', AssignIssueView.as_view(), name='assign-issue'),




    # Profile and details
    path('student-profile/', UserProfileView.as_view(), name='student-profile'),
    path('lecturer/details/', LecturerDetailsView.as_view(), name='lecturer-details'),

    # Registrar signup route
    path('registrar/signup/', RegistrarSignupView.as_view(), name='registrar-signup'),
    path('registrar-profile/', RegistrarProfileView.as_view(), name='registrar-profile'),

]
