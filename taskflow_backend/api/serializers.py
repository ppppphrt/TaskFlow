"""Serializers for the TaskFlow API.

Serializers are responsible only for data shape and field-level format validation.
- No request-object access (request-aware logic lives in views).
- No cross-object DB queries (counts are pre-annotated by the view's queryset).
- No business-rule validation (password checks live in services).
"""

from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import Task, Subtask, Phase


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        token['is_staff'] = user.is_staff
        return token


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        user = User(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
        )
        user.set_password(validated_data['password'])
        user.save()
        return user


class PhaseSerializer(serializers.ModelSerializer):
    # Populated by Count('tasks') annotation applied in the view's queryset.
    task_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Phase
        fields = ['id', 'name', 'color', 'order', 'is_terminal', 'created_at', 'task_count']
        read_only_fields = ['id', 'created_at']


class SubtaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subtask
        fields = ['id', 'task', 'title', 'completed', 'created_at']
        read_only_fields = ['id', 'task', 'created_at']


class TaskSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')
    phase = PhaseSerializer(read_only=True)
    phase_id = serializers.PrimaryKeyRelatedField(
        queryset=Phase.objects.none(),
        source='phase',
        write_only=True,
        required=False,
        allow_null=True,
    )
    subtasks = SubtaskSerializer(many=True, read_only=True)
    # Populated by annotations applied in the view's queryset.
    subtask_count = serializers.IntegerField(read_only=True)
    completed_subtask_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Task
        fields = [
            'id', 'owner', 'title', 'description', 'phase', 'phase_id', 'priority',
            'due_date', 'created_at', 'updated_at',
            'subtasks', 'subtask_count', 'completed_subtask_count',
        ]
        read_only_fields = ['id', 'owner', 'created_at', 'updated_at']


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']
        read_only_fields = ['id']


class ChangePasswordSerializer(serializers.Serializer):
    """Validates only the shape/format of password change data.

    Business-rule validation (checking the old password) is performed in the view
    via the service layer, keeping the serializer request-agnostic.
    """
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, min_length=8)


class AdminUserSerializer(serializers.ModelSerializer):
    # Populated by Count('tasks') annotation applied in the view's queryset.
    task_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_staff', 'date_joined', 'task_count']
        read_only_fields = ['id', 'date_joined']


class AdminTaskSerializer(serializers.ModelSerializer):
    owner_username = serializers.ReadOnlyField(source='owner.username')
    phase = PhaseSerializer(read_only=True)

    class Meta:
        model = Task
        fields = ['id', 'owner_username', 'title', 'description', 'phase', 'priority', 'due_date', 'created_at']
        read_only_fields = ['id', 'created_at']
