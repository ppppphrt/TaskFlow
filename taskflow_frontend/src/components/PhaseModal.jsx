import { useState, useEffect } from 'react';

const PRESET_COLORS = [
  '#ba1a1a', '#e67e22', '#f1c40f', '#2ecc71', '#005237',
  '#3498db', '#00478d', '#9b59b6', '#515f74', '#6750a4',
  '#e91e63', '#00bcd4',
];

function PhaseForm({ phase, onSave, onCancel }) {
  const [name, setName] = useState(phase?.name || '');
  const [color, setColor] = useState(phase?.color || '#6750a4');
  const [isTerminal, setIsTerminal] = useState(phase?.is_terminal || false);
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) { setError('Name is required.'); return; }
    onSave({ name: name.trim(), color, is_terminal: isTerminal });
  }

  const fieldClass = 'w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 transition';

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-1.5">
          Phase Name <span className="text-error">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. In Review"
          className={fieldClass}
          autoFocus
        />
        {error && <p className="text-error text-xs mt-1">{error}</p>}
      </div>

      <div>
        <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-2">
          Color
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {PRESET_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className={`w-7 h-7 rounded-full transition-transform ${color === c ? 'scale-125 ring-2 ring-offset-1 ring-on-surface/30' : 'hover:scale-110'}`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-8 h-8 rounded cursor-pointer border border-outline-variant/40"
          />
          <span className="text-xs text-on-surface-variant font-mono">{color}</span>
        </div>
      </div>

      <label className="flex items-center gap-3 cursor-pointer">
        <div
          onClick={() => setIsTerminal((v) => !v)}
          className={`w-10 h-6 rounded-full transition-colors flex items-center px-1 ${isTerminal ? 'bg-primary' : 'bg-outline-variant/40'}`}
        >
          <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${isTerminal ? 'translate-x-4' : ''}`} />
        </div>
        <span className="text-sm text-on-surface-variant">
          Mark as terminal phase <span className="text-[10px] opacity-60">(tasks here count as done)</span>
        </span>
      </label>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 border border-outline-variant text-on-surface-variant text-sm font-semibold py-2 rounded-xl hover:bg-surface-container-low transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 bg-gradient-to-r from-primary to-primary-container text-on-primary text-sm font-bold py-2 rounded-xl active:scale-95 transition-transform"
        >
          {phase ? 'Save Changes' : 'Create Phase'}
        </button>
      </div>
    </form>
  );
}

export default function PhaseModal({ isOpen, onClose, phases, onSave, onDelete }) {
  const [editingPhase, setEditingPhase] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!isOpen) { setEditingPhase(null); setShowForm(false); }
  }, [isOpen]);

  if (!isOpen) return null;

  function handleSave(data) {
    onSave(data, editingPhase);
    setEditingPhase(null);
    setShowForm(false);
  }

  function startEdit(phase) {
    setEditingPhase(phase);
    setShowForm(true);
  }

  function startCreate() {
    setEditingPhase(null);
    setShowForm(true);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/40">
      <div className="bg-surface rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 max-h-[90vh] overflow-y-auto border border-outline-variant/10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black tracking-tight text-on-surface">
            {showForm ? (editingPhase ? 'Edit Phase' : 'New Phase') : 'Manage Phases'}
          </h2>
          <button onClick={onClose} className="material-symbols-outlined text-on-surface-variant hover:text-on-surface transition-colors">
            close
          </button>
        </div>

        {showForm ? (
          <PhaseForm
            phase={editingPhase}
            onSave={handleSave}
            onCancel={() => { setShowForm(false); setEditingPhase(null); }}
          />
        ) : (
          <div className="flex flex-col gap-3">
            {phases.map((phase) => (
              <div
                key={phase.id}
                className="flex items-center justify-between bg-surface-container-low rounded-xl px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: phase.color }} />
                  <div>
                    <span className="text-sm font-semibold text-on-surface">{phase.name}</span>
                    {phase.is_terminal && (
                      <span className="ml-2 text-[9px] font-black uppercase tracking-widest text-tertiary bg-tertiary/10 px-1.5 py-0.5 rounded">
                        Terminal
                      </span>
                    )}
                    <span className="ml-2 text-xs text-on-surface-variant/50">{phase.task_count} tasks</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => startEdit(phase)}
                    className="p-1.5 hover:bg-surface-container rounded-lg text-on-surface-variant transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">edit</span>
                  </button>
                  <button
                    onClick={() => onDelete(phase.id)}
                    className="p-1.5 hover:bg-error-container hover:text-on-error-container rounded-lg text-on-surface-variant transition-colors"
                    title={phase.task_count > 0 ? 'Move tasks out before deleting' : 'Delete phase'}
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>
              </div>
            ))}

            <button
              onClick={startCreate}
              className="flex items-center justify-center gap-2 border-2 border-dashed border-outline-variant/30 rounded-xl py-3 text-sm font-semibold text-on-surface-variant hover:border-primary/40 hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              Add Phase
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
