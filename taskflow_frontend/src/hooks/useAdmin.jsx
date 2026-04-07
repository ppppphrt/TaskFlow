import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { adminFetchUsers, adminDeleteUser, adminFetchTasks, adminDeleteTask } from '../services/api';

export function useAdmin() {
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
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

  async function removeUser(id) {
    const toastId = toast(
      <div>
        <p className="text-sm font-medium text-gray-800 mb-2">Delete this user and all their data?</p>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              toast.dismiss(toastId);
              try {
                await adminDeleteUser(id);
                setUsers((prev) => prev.filter((u) => u.id !== id));
                setTasks((prev) => prev.filter((t) => t.owner_id !== id));
                toast.success('User deleted.');
              } catch {
                toast.error('Failed to delete user.');
              }
            }}
            className="bg-red-600 text-white text-xs font-medium px-3 py-1 rounded"
          >
            Delete
          </button>
          <button
            onClick={() => toast.dismiss(toastId)}
            className="bg-gray-200 text-gray-700 text-xs font-medium px-3 py-1 rounded"
          >
            Cancel
          </button>
        </div>
      </div>,
      { autoClose: false, closeButton: false }
    );
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

  return { users, tasks, isLoading, removeUser, removeTask };
}
