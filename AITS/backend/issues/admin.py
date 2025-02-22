from django.contrib import admin

from .models import CustomUser, Issue # Import your models

admin.site.register(CustomUser)  # Register the CustomUser model
admin.site.register(Issue)