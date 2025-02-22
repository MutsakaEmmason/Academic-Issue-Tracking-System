from django.shortcuts import render
from rest_framework import generics
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Issue
from .serializers import IssueSerializer

class IssueViewSet(viewsets.ModelViewSet):
    queryset = Issue.objects.all()
    serializer_class = IssueSerializer
    permission_classes = [IsAuthenticated]  # Restrict access to authenticated users only

    def get_queryset(self):
        """Ensure students only see their issues and lecturers/admins see assigned ones"""
        user = self.request.user
        if user.is_superuser:  # Admin sees all
            return Issue.objects.all()
        elif user.groups.filter(name="lecturers").exists():
            return Issue.objects.filter(assigned_to=user)
        return Issue.objects.filter(student=user)
    
class IssueListCreateView(generics.ListCreateAPIView):
    queryset = Issue.objects.all()
    serializer_class = IssueSerializer

class IssueDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Issue.objects.all()
    serializer_class = IssueSerializer