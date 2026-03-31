import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { fetchSubtasks, createSubtask, updateSubtask, deleteSubtask } from '../services/api';

export function useSubtasks(taskId) {
  const [subtasks, setSubtasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!taskId) {
      setSubtasks([]);
      return;
    }
    load();
  }, [taskId]);

  async function load() {
    setIsLoading(true);
    try {
      const res = await fetchSubtasks(taskId);
      setSubtasks(res.data);
    } catch {
      toast.error('Failed to load subtasks.');
    } finally {
      setIsLoading(false);
    }
  }

  async function addSubtask(title) {
    try {
      const res = await createSubtask(taskId, { title });
      setSubtasks((prev) => [...prev, res.data]);
    } catch {
      toast.error('Failed to add subtask.');
    }
  }

  async function toggleSubtask(id, completed) {
    setSubtasks((prev) => prev.map((s) => (s.id === id ? { ...s, completed } : s)));
    try {
      await updateSubtask(id, { completed });
    } catch {
      toast.error('Failed to update subtask.');
      load();
    }
  }

  async function removeSubtask(id) {
    setSubtasks((prev) => prev.filter((s) => s.id !== id));
    try {
      await deleteSubtask(id);
    } catch {
      toast.error('Failed to delete subtask.');
      load();
    }
  }

  return { subtasks, isLoading, addSubtask, toggleSubtask, removeSubtask };
}
