import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { adminFetchUsers, adminDeleteUser, adminFetchTasks, adminDeleteTask } from '../services/api';
import { showConfirmToast } from '../utils/confirmToast';

export function useAdmin() {
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { load(); }, []);

  async function load() {
    setIsLoading(true);
    try {
      const [usersRes, tasksRes] = await Promise.all([adminFetchUsers(), adminFetchTasks()]);
      setUsers(usersRes.data);
      setTasks(tasksRes.data);
    } catch {
      toast.error('Failed to load admin data.');
    } finally {
      setIsLoading(false);
    }
  }

  async function _doDeleteUser(id) {
    try {
      await adminDeleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      setTasks((prev) => prev.filter((t) => t.owner_id !== id));
      toast.success('User deleted.');
    } catch {
      toast.error('Failed to delete user.');
    }
  }

  function removeUser(id) {
    showConfirmToast({
      message: 'Delete this user and all their data?',
      onConfirm: () => _doDeleteUser(id),
    });
  }

  async function removeTask(id) {
    try {
      await adminDeleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      toast.success('Task deleted.');
    } catch {
      toast.error('Failed to delete task.');
    }
  }

  const q = search.toLowerCase();
  const filteredUsers = users.filter(
    (u) =>
      u.username.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q),
  );
  const filteredTasks = tasks.filter(
    (t) =>
      t.title.toLowerCase().includes(q) ||
      t.owner_username.toLowerCase().includes(q),
  );

  return { users, tasks, filteredUsers, filteredTasks, search, setSearch, isLoading, removeUser, removeTask };
}
