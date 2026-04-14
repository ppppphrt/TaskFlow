import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { fetchTasks, createTask, updateTask, deleteTask } from '../services/api';
import { PRIORITY_RANK } from '../utils/taskUtils';
import { showConfirmToast } from '../utils/confirmToast';

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

  async function moveTask(id, phaseId) {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        return { ...t, phase: t.phase ? { ...t.phase, id: phaseId } : { id: phaseId } };
      })
    );
    try {
      const res = await updateTask(id, { phase_id: phaseId });
      setTasks((prev) => prev.map((t) => (t.id === id ? res.data : t)));
    } catch {
      toast.error('Failed to update task phase.');
      loadTasks();
    }
  }

  async function _doDelete(id) {
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      toast.success('Task deleted.');
    } catch {
      toast.error('Failed to delete task.');
    }
  }

  function removeTask(id) {
    showConfirmToast({
      message: 'Delete this task?',
      onConfirm: () => _doDelete(id),
    });
  }

  const filtered = filter === 'all' ? tasks : tasks.filter((t) => t.phase?.id === filter);

  const filteredTasks = [...filtered].sort((a, b) => {
    let valA, valB;

    if (sortBy === 'priority') {
      valA = PRIORITY_RANK[a.priority] ?? 2;
      valB = PRIORITY_RANK[b.priority] ?? 2;
    } else if (sortBy === 'due_date') {
      if (!a.due_date && !b.due_date) return 0;
      if (!a.due_date) return 1;
      if (!b.due_date) return -1;
      valA = new Date(a.due_date).getTime();
      valB = new Date(b.due_date).getTime();
    } else {
      valA = new Date(a.created_at).getTime();
      valB = new Date(b.created_at).getTime();
    }

    return sortOrder === 'asc' ? valA - valB : valB - valA;
  });

  const taskCounts = tasks.reduce((acc, t) => {
    if (t.phase?.id) {
      acc[t.phase.id] = (acc[t.phase.id] || 0) + 1;
    }
    return acc;
  }, {});

  const today = new Date().toISOString().split('T')[0];
  const stats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.phase?.is_terminal).length,
    overdue: tasks.filter((t) => t.due_date && t.due_date < today && !t.phase?.is_terminal).length,
  };

  return {
    tasks, filteredTasks, taskCounts, stats,
    filter, setFilter,
    sortBy, setSortBy,
    sortOrder, setSortOrder,
    isLoading, saveTask, removeTask, moveTask,
  };
}
