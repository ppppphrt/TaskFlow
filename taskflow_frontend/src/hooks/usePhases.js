import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { fetchPhases, createPhase, updatePhase, deletePhase } from '../services/api';

export function usePhases() {
  const [phases, setPhases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { load(); }, []);

  async function load() {
    setIsLoading(true);
    try {
      const res = await fetchPhases();
      setPhases(res.data);
    } catch {
      toast.error('Failed to load phases.');
    } finally {
      setIsLoading(false);
    }
  }

  async function savePhase(data, editingPhase) {
    try {
      if (editingPhase) {
        const res = await updatePhase(editingPhase.id, data);
        setPhases((prev) => prev.map((p) => (p.id === editingPhase.id ? res.data : p)));
        toast.success('Phase updated!');
      } else {
        const res = await createPhase(data);
        setPhases((prev) => [...prev, res.data]);
        toast.success('Phase created!');
      }
      return true;
    } catch {
      toast.error('Failed to save phase.');
      return false;
    }
  }

  async function removePhase(id) {
    try {
      await deletePhase(id);
      setPhases((prev) => prev.filter((p) => p.id !== id));
      toast.success('Phase deleted.');
    } catch {
      toast.error('Failed to delete phase. Make sure no tasks are using it.');
    }
  }

  return { phases, isLoading, savePhase, removePhase, reload: load };
}
