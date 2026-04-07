"""URL patterns for the TaskFlow API."""

from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    RegisterView,
    LogoutView,
    CustomTokenObtainPairView,
    AdminUserListView,
    AdminUserDestroyView,
    AdminTaskListView,
    AdminTaskDestroyView,
    UserProfileView,
    ChangePasswordView,
    PhaseListCreateView,
    PhaseRetrieveUpdateDestroyView,
    TaskListCreateView,
    TaskRetrieveUpdateDestroyView,
    SubtaskListCreateView,
    SubtaskRetrieveUpdateDestroyView,
)

urlpatterns = [
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/profile/', UserProfileView.as_view(), name='user-profile'),
    path('auth/change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('phases/', PhaseListCreateView.as_view(), name='phase-list-create'),
    path('phases/<int:pk>/', PhaseRetrieveUpdateDestroyView.as_view(), name='phase-detail'),
    path('tasks/', TaskListCreateView.as_view(), name='task-list-create'),
    path('tasks/<int:pk>/', TaskRetrieveUpdateDestroyView.as_view(), name='task-detail'),
    path('tasks/<int:task_pk>/subtasks/', SubtaskListCreateView.as_view(), name='subtask-list-create'),
    path('subtasks/<int:pk>/', SubtaskRetrieveUpdateDestroyView.as_view(), name='subtask-detail'),
    path('admin/users/', AdminUserListView.as_view(), name='admin-user-list'),
    path('admin/users/<int:pk>/', AdminUserDestroyView.as_view(), name='admin-user-destroy'),
    path('admin/tasks/', AdminTaskListView.as_view(), name='admin-task-list'),
    path('admin/tasks/<int:pk>/', AdminTaskDestroyView.as_view(), name='admin-task-destroy'),
]
