import { useState } from 'react';

export default function SubtaskList({ subtasks, isLoading, onAdd, onToggle, onRemove }) {
  const [newTitle, setNewTitle] = useState('');

  function handleAdd(e) {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAdd(newTitle.trim());
    setNewTitle('');
  }

  const completedCount = subtasks.filter((s) => s.completed).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Subtasks</label>
        {subtasks.length > 0 && (
          <span className="text-xs font-bold text-on-surface-variant/50">
            {completedCount}/{subtasks.length} done
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-2 mb-2">
          {[1, 2].map((n) => <div key={n} className="h-7 bg-surface-container rounded-lg animate-pulse" />)}
        </div>
      ) : (
        <div className="space-y-1.5 mb-3 max-h-36 overflow-y-auto">
          {subtasks.map((s) => (
            <div key={s.id} className="flex items-center gap-2 group px-2 py-1 rounded-lg hover:bg-surface-container-low transition-colors">
              <input
                type="checkbox"
                checked={s.completed}
                onChange={(e) => onToggle(s.id, e.target.checked)}
                className="w-4 h-4 rounded accent-primary cursor-pointer shrink-0"
              />
              <span className={`flex-1 text-sm ${s.completed ? 'line-through text-on-surface-variant/40' : 'text-on-surface'}`}>
                {s.title}
              </span>
              <button
                type="button"
                onClick={() => onRemove(s.id)}
                className="opacity-0 group-hover:opacity-100 material-symbols-outlined text-[16px] text-on-surface-variant/50 hover:text-error transition shrink-0"
              >
                close
              </button>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Add a subtask..."
          className="flex-1 bg-surface-container-low border border-outline-variant/40 rounded-xl px-3 py-1.5 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
        <button
          type="submit"
          className="bg-primary text-on-primary text-xs font-bold px-3 py-1.5 rounded-xl hover:bg-primary/90 transition"
        >
          Add
        </button>
      </form>
    </div>
  );
}
