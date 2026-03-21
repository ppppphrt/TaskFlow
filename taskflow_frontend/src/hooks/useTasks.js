import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { fetchTasks, createTask, updateTask, deleteTask } from '../services/api';

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    setIsLoading(true);
    try {
      const res = await fetchTasks();
      setTasks(res.data);
    } catch {
      toast.error('Failed to load tasks.');
    } finally {
      setIsLoading(false);
    }
  }

  async function saveTask(data, editingTask) {
    try {
      if (editingTask) {
        const res = await updateTask(editingTask.id, data);
        setTasks((prev) => prev.map((t) => (t.id === editingTask.id ? res.data : t)));
        toast.success('Task updated!');
      } else {
        const res = await createTask(data);
        setTasks((prev) => [res.data, ...prev]);
        toast.success('Task created!');
      }
      return true;
    } catch {
      toast.error('Failed to save task. Please try again.');
      return false;
    }
  }

  function removeTask(id) {
    const toastId = toast(
      <div>
        <p className="text-sm font-medium text-gray-800 mb-2">Delete this task?</p>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              toast.dismiss(toastId);
              try {
                await deleteTask(id);
                setTasks((prev) => prev.filter((t) => t.id !== id));
                toast.success('Task deleted.');
              } catch {
                toast.error('Failed to delete task.');
              }
            }}
            className="bg-danger text-white text-xs font-medium px-3 py-1 rounded"
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

  const filteredTasks = filter === 'all' ? tasks : tasks.filter((t) => t.status === filter);

  const taskCounts = tasks.reduce((acc, t) => {
    acc[t.status] = (acc[t.status] || 0) + 1;
    return acc;
  }, {});

  return { tasks, filteredTasks, taskCounts, filter, setFilter, isLoading, saveTask, removeTask };
}
