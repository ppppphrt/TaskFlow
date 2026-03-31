import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach Bearer token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const register = (data) => api.post('/api/auth/register/', data);
export const login = (data) => api.post('/api/auth/login/', data);
export const logout = () => {
  const refresh = localStorage.getItem('refresh_token');
  return api.post('/api/auth/logout/', { refresh });
};

// Profile
export const getProfile = () => api.get('/api/auth/profile/');
export const updateProfile = (data) => api.patch('/api/auth/profile/', data);
export const changePassword = (data) => api.post('/api/auth/change-password/', data);

// Tasks
export const fetchTasks = () => api.get('/api/tasks/');
export const createTask = (data) => api.post('/api/tasks/', data);
export const updateTask = (id, data) => api.patch(`/api/tasks/${id}/`, data);
export const deleteTask = (id) => api.delete(`/api/tasks/${id}/`);

// Subtasks
export const fetchSubtasks = (taskId) => api.get(`/api/tasks/${taskId}/subtasks/`);
export const createSubtask = (taskId, data) => api.post(`/api/tasks/${taskId}/subtasks/`, data);
export const updateSubtask = (subtaskId, data) => api.patch(`/api/subtasks/${subtaskId}/`, data);
export const deleteSubtask = (subtaskId) => api.delete(`/api/subtasks/${subtaskId}/`);

export default api;
