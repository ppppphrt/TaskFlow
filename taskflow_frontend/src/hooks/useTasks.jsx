import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { fetchTasks, createTask, updateTask, deleteTask } from '../services/api';

const PRIORITY_RANK = { high: 3, medium: 2, low: 1 };

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
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

  const filtered = filter === 'all' ? tasks : tasks.filter((t) => t.status === filter);

  const filteredTasks = [...filtered].sort((a, b) => {
    let valA, valB;

    if (sortBy === 'priority') {
      valA = PRIORITY_RANK[a.priority] ?? 2;
      valB = PRIORITY_RANK[b.priority] ?? 2;
    } else if (sortBy === 'due_date') {
      // nulls always last regardless of direction
      if (!a.due_date && !b.due_date) return 0;
      if (!a.due_date) return 1;
      if (!b.due_date) return -1;
      valA = new Date(a.due_date).getTime();
      valB = new Date(b.due_date).getTime();
    } else {
      // created_at
      valA = new Date(a.created_at).getTime();
      valB = new Date(b.created_at).getTime();
    }

    return sortOrder === 'asc' ? valA - valB : valB - valA;
  });

  const taskCounts = tasks.reduce((acc, t) => {
    acc[t.status] = (acc[t.status] || 0) + 1;
    return acc;
  }, {});

  const today = new Date().toISOString().split('T')[0];
  const stats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.status === 'completed').length,
    in_progress: tasks.filter((t) => t.status === 'in_progress').length,
    overdue: tasks.filter((t) => t.due_date && t.due_date < today && t.status !== 'completed').length,
  };

  return {
    tasks, filteredTasks, taskCounts, stats,
    filter, setFilter,
    sortBy, setSortBy,
    sortOrder, setSortOrder,
    isLoading, saveTask, removeTask,
  };
}
