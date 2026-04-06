import React, { useState, useEffect } from 'react';
import { useSubtasks } from '../hooks/useSubtasks';
import SubtaskList from './SubtaskList';

const PRIORITY_OPTIONS = [
  { value: 'low',    label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high',   label: 'High' },
];

export default function TaskModal({ isOpen, onClose, onSave, task, phases = [] }) {
  const [title, setTitle]       = useState('');
  const [description, setDescription] = useState('');
  const [phaseId, setPhaseId]   = useState(null);
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate]   = useState('');
  const [error, setError]       = useState('');

  const { subtasks, isLoading: subtasksLoading, addSubtask, toggleSubtask, removeSubtask } =
    useSubtasks(task?.id ?? null);

  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setPhaseId(task.phase?.id ?? (phases[0]?.id ?? null));
      setPriority(task.priority || 'medium');
      setDueDate(task.due_date || '');
    } else {
      setTitle('');
      setDescription('');
      setPhaseId(phases[0]?.id ?? null);
      setPriority('medium');
      setDueDate('');
    }
    setError('');
  }, [task, isOpen, phases]);

  if (!isOpen) return null;

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) { setError('Title is required.'); return; }
    onSave({
      title: title.trim(),
      description: description.trim(),
      phase_id: phaseId,
      priority,
      due_date: dueDate || null,
    });
  }

  const fieldClass = 'w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 transition';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/40 animate-fade-in">
      <div className="bg-surface rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 animate-scale-in max-h-[90vh] overflow-y-auto border border-outline-variant/10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black tracking-tight text-on-surface">
            {task ? 'Edit Task' : 'New Task'}
          </h2>
          <button onClick={onClose} className="material-symbols-outlined text-on-surface-variant hover:text-on-surface transition-colors">
            close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1.5">
              Title <span className="text-error">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              className={fieldClass}
            />
            {error && <p className="text-error text-xs mt-1">{error}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1.5">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description"
              rows={3}
              className={`${fieldClass} resize-none`}
            />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1.5">Phase</label>
              <select
                value={phaseId ?? ''}
                onChange={(e) => setPhaseId(Number(e.target.value))}
                className={fieldClass}
              >
                {phases.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1.5">Priority</label>
              <select value={priority} onChange={(e) => setPriority(e.target.value)} className={fieldClass}>
                {PRIORITY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1.5">
              Due Date <span className="text-on-surface-variant/40 normal-case font-normal">(optional)</span>
            </label>
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className={fieldClass} />
          </div>

          {task ? (
            <div className="border-t border-outline-variant/20 pt-4">
              <SubtaskList
                subtasks={subtasks}
                isLoading={subtasksLoading}
                onAdd={addSubtask}
                onToggle={toggleSubtask}
                onRemove={removeSubtask}
              />
            </div>
          ) : (
            <p className="text-xs text-on-surface-variant/50 italic">Save the task first to add subtasks.</p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-outline-variant text-on-surface-variant text-sm font-semibold py-2.5 rounded-xl hover:bg-surface-container-low transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-primary to-primary-container text-on-primary text-sm font-bold py-2.5 rounded-xl active:scale-95 transition-transform"
            >
              {task ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
