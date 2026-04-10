"""Service layer for the TaskFlow API.

Business logic that does not belong in models or serializers lives here.
Views call these functions directly; serializers remain request-agnostic.
"""

from .models import Phase

DEFAULT_PHASES = [
    {'name': 'Pending',     'color': '#ba1a1a', 'order': 0, 'is_terminal': False},
    {'name': 'In Progress', 'color': '#515f74', 'order': 1, 'is_terminal': False},
    {'name': 'Completed',   'color': '#005237', 'order': 2, 'is_terminal': True},
]


def create_default_phases_for_user(user):
    """Create the standard starter phases for a newly registered user."""
    for phase_data in DEFAULT_PHASES:
        Phase.objects.create(owner=user, **phase_data)


def get_next_phase_order(user):
    """Return the next available order index for a new phase owned by *user*."""
    return Phase.objects.filter(owner=user).count()


def check_user_password(user, raw_password):
    """Return True if *raw_password* matches the user's stored password."""
    return user.check_password(raw_password)


def change_user_password(user, new_password):
    """Set *new_password* as the user's active password."""
    user.set_password(new_password)
    user.save()
