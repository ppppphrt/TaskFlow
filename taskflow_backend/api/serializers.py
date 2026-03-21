"""Serializers for the TaskFlow API."""

from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Task


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


class TaskSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')

    class Meta:
        model = Task
        fields = ['id', 'owner', 'title', 'description', 'status', 'priority', 'due_date', 'created_at', 'updated_at']
        read_only_fields = ['id', 'owner', 'created_at', 'updated_at']
