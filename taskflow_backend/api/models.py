"""Models for the TaskFlow API."""

from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver


DEFAULT_PHASES = [
    {'name': 'Pending',     'color': '#ba1a1a', 'order': 0, 'is_terminal': False},
    {'name': 'In Progress', 'color': '#515f74', 'order': 1, 'is_terminal': False},
    {'name': 'Completed',   'color': '#005237', 'order': 2, 'is_terminal': True},
]


class Phase(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='phases')
    name = models.CharField(max_length=100)
    color = models.CharField(max_length=7, default='#6750a4')
    order = models.PositiveIntegerField(default=0)
    is_terminal = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', 'created_at']

    def __str__(self):
        return self.name


class Task(models.Model):
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    ]

    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tasks')
    phase = models.ForeignKey(Phase, on_delete=models.SET_NULL, null=True, blank=True, related_name='tasks')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    due_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class Subtask(models.Model):
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='subtasks')
    title = models.CharField(max_length=255)
    completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return self.title


@receiver(post_save, sender=User)
def create_default_phases(sender, instance, created, **kwargs):
    if created:
        for p in DEFAULT_PHASES:
            Phase.objects.create(owner=instance, **p)
