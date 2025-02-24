from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, Issue, Comment, Notification, AuditLog

# CustomUser Admin
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'role', 'is_staff')
    list_filter = ('role', 'is_staff', 'is_superuser')
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'email', 'role')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2', 'role', 'is_staff', 'is_superuser'),
        }),
    )

# Issue Admin
#class IssueAdmin(admin.ModelAdmin):
    #list_display = ('title', 'status', 'category', 'student', 'assigned_to', 'created_at')
    #list_filter = ('status', 'category', 'created_at')
    #search_fields = ('title', 'description', 'student__username', 'assigned_to__username')
    #raw_id_fields = ('student', 'assigned_to')

# Comment Admin
#class CommentAdmin(admin.ModelAdmin):
    #list_display = ('issue', 'user', 'created_at')
    #list_filter = ('created_at',)
    #search_fields = ('issue__title', 'user__username', 'text')
    #raw_id_fields = ('issue', 'user')

# Notification Admin
#class NotificationAdmin(admin.ModelAdmin):
    #list_display = ('user', 'message', 'read', 'created_at')
    #list_filter = ('read', 'created_at')
    #search_fields = ('user__username', 'message')
   # raw_id_fields = ('user',)

# AuditLog Admin
#class AuditLogAdmin(admin.ModelAdmin):
    #list_display = ('user', 'action', 'created_at')
    #list_filter = ('created_at',)
    #search_fields = ('user__username', 'action')
    #raw_id_fields = ('user',)

# Register models
admin.site.register(CustomUser, CustomUserAdmin)
#admin.site.register(Issue, IssueAdmin)
#admin.site.register(Comment, CommentAdmin)
#admin.site.register(Notification, NotificationAdmin)
#admin.site.register(AuditLog, AuditLogAdmin)