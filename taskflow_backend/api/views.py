"""Views for the TaskFlow API.

Views are responsible for:
- HTTP request/response handling
- Permission enforcement
- Queryset construction (including annotations to avoid N+1 queries)
- Calling service functions for business logic
- Setting serializer context that requires request data
"""

from django.db.models import Count, Q
from django.shortcuts import get_object_or_404
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.views import TokenObtainPairView

from django.contrib.auth.models import User

from .models import Task, Subtask, Phase
from .serializers import (
    UserRegistrationSerializer,
    CustomTokenObtainPairSerializer,
    TaskSerializer,
    SubtaskSerializer,
    PhaseSerializer,
    UserProfileSerializer,
    ChangePasswordSerializer,
    AdminUserSerializer,
    AdminTaskSerializer,
)
from .permissions import IsOwner
from . import services


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class RegisterView(generics.CreateAPIView):
    """Register a new user and create their default phases."""
    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        user = serializer.save()
        services.create_default_phases_for_user(user)


class LogoutView(APIView):
    """Logout by blacklisting the refresh token."""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        refresh_token = request.data.get('refresh')
        if refresh_token:
            try:
                token = RefreshToken(refresh_token)
                token.blacklist()
            except TokenError:
                pass
        return Response({'detail': 'Successfully logged out.'}, status=200)


class UserProfileView(generics.RetrieveUpdateAPIView):
    """Retrieve or update the authenticated user's profile."""
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class ChangePasswordView(APIView):
    """Change the authenticated user's password.

    Old-password verification is performed here in the view via the service
    layer so the serializer stays request-agnostic.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        if not services.check_user_password(request.user, serializer.validated_data['old_password']):
            return Response(
                {'old_password': ['Current password is incorrect.']},
                status=400,
            )

        services.change_user_password(request.user, serializer.validated_data['new_password'])
        return Response({'detail': 'Password changed successfully.'}, status=200)


class _UserPhaseSerializerMixin:
    """Restrict the phase_id field to phases owned by the requesting user.

    Kept in the view layer so serializers remain request-agnostic.
    """
    def get_serializer(self, *args, **kwargs):
        serializer = super().get_serializer(*args, **kwargs)
        serializer.fields['phase_id'].queryset = Phase.objects.filter(
            owner=self.request.user
        )
        return serializer


class PhaseListCreateView(generics.ListCreateAPIView):
    """List all phases for the authenticated user or create a new phase."""
    serializer_class = PhaseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return (
            Phase.objects
            .filter(owner=self.request.user)
            .annotate(task_count=Count('tasks'))
        )

    def perform_create(self, serializer):
        order = services.get_next_phase_order(self.request.user)
        serializer.save(owner=self.request.user, order=order)


class PhaseRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, or delete a phase owned by the authenticated user."""
    serializer_class = PhaseSerializer
    permission_classes = [IsAuthenticated, IsOwner]

    def get_queryset(self):
        return (
            Phase.objects
            .filter(owner=self.request.user)
            .annotate(task_count=Count('tasks'))
        )


def _task_queryset_with_counts(user):
    """Return the base Task queryset for *user* with subtask counts annotated."""
    return (
        Task.objects
        .filter(owner=user)
        .annotate(
            subtask_count=Count('subtasks'),
            completed_subtask_count=Count(
                'subtasks', filter=Q(subtasks__completed=True)
            ),
        )
    )


class TaskListCreateView(_UserPhaseSerializerMixin, generics.ListCreateAPIView):
    """List all tasks for the authenticated user or create a new task."""
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return _task_queryset_with_counts(self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class TaskRetrieveUpdateDestroyView(_UserPhaseSerializerMixin, generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, or delete a task owned by the authenticated user."""
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated, IsOwner]

    def get_queryset(self):
        return _task_queryset_with_counts(self.request.user)


class SubtaskListCreateView(generics.ListCreateAPIView):
    """List subtasks for a task or create a new subtask."""
    serializer_class = SubtaskSerializer
    permission_classes = [IsAuthenticated]

    def _get_task(self):
        return get_object_or_404(Task, pk=self.kwargs['task_pk'], owner=self.request.user)

    def get_queryset(self):
        return self._get_task().subtasks.all()

    def perform_create(self, serializer):
        serializer.save(task=self._get_task())


class SubtaskRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, or delete a subtask belonging to the authenticated user's task."""
    serializer_class = SubtaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Subtask.objects.filter(task__owner=self.request.user)


class AdminUserListView(generics.ListAPIView):
    """Admin: list all registered users."""
    serializer_class = AdminUserSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get_queryset(self):
        return (
            User.objects
            .annotate(task_count=Count('tasks'))
            .order_by('date_joined')
        )


class AdminUserDestroyView(generics.DestroyAPIView):
    """Admin: delete a user account."""
    serializer_class = AdminUserSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]
    queryset = User.objects.all()


class AdminTaskListView(generics.ListAPIView):
    """Admin: list all tasks across all users."""
    serializer_class = AdminTaskSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]
    queryset = Task.objects.select_related('owner', 'phase').all()


class AdminTaskDestroyView(generics.DestroyAPIView):
    """Admin: delete any task."""
    serializer_class = AdminTaskSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]
    queryset = Task.objects.all()
