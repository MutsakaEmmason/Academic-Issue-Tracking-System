from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, Issue, Comment, Notification, AuditLog
from import_export.admin import ExportMixin
from import_export import resources


# Define CustomUserResource first
class CustomUserResource(resources.ModelResource):
    class Meta:
        model = CustomUser


# CustomUser Admin
class CustomUserAdmin(ExportMixin, UserAdmin):  # Combined both classes here
    list_display = ('username', 'email', 'first_name', 'last_name', 'role', 'is_staff', 'studentRegNumber', 'fullName', 'college', 'department', 'yearOfStudy')
    list_filter = ('role', 'is_staff', 'is_superuser')
    fieldsets = (
        (None, {'fields': ('username', 'password')}), 
        ('Personal info', {'fields': ('first_name', 'last_name', 'email', 'role', 'studentRegNumber', 'fullName', 'college', 'department', 'yearOfStudy')}), 
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}), 
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password', 'role', 'is_staff', 'is_superuser', 'studentRegNumber', 'fullName', 'college', 'department', 'yearOfStudy'),
        }),
    )

    resource_class = CustomUserResource  # Ensure to keep this here


# Issue Admin
class IssueAdmin(admin.ModelAdmin):
    list_display = ('title', 'status', 'category', 'student', 'assigned_to', 'created_at', 'studentName','department','lecturer','courseCode','description','semester','academicYear')
    list_filter = ('status', 'category', 'created_at')
    search_fields = ('title', 'description', 'student__username', 'assigned_to__username')
    raw_id_fields = ('student', 'assigned_to')

# Comment Admin
class CommentAdmin(admin.ModelAdmin):
    list_display = ('issue', 'user', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('issue__title', 'user__username', 'text')
    raw_id_fields = ('issue', 'user')

# Notification Admin
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('user', 'message', 'is_read', 'created_at')  # Use 'is_read' instead of 'read'
    list_filter = ('is_read', 'created_at')  # Use 'is_read' instead of 'read'
    search_fields = ('user__username', 'message')
    raw_id_fields = ('user',)

# AuditLog Admin
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ('user', 'action', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('user__username', 'action')
    raw_id_fields = ('user',)

# Register models.
admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Issue, IssueAdmin)
admin.site.register(Comment, CommentAdmin)
admin.site.register(Notification, NotificationAdmin)
admin.site.register(AuditLog, AuditLogAdmin)
