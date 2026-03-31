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
        <label className="block text-sm font-medium text-gray-700">Subtasks</label>
        {subtasks.length > 0 && (
          <span className="text-xs text-gray-400">
            {completedCount}/{subtasks.length} done
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-2 mb-2">
          {[1, 2].map((n) => (
            <div key={n} className="h-7 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-1.5 mb-2 max-h-36 overflow-y-auto">
          {subtasks.map((s) => (
            <div key={s.id} className="flex items-center gap-2 group">
              <input
                type="checkbox"
                checked={s.completed}
                onChange={(e) => onToggle(s.id, e.target.checked)}
                className="w-4 h-4 rounded accent-primary cursor-pointer shrink-0"
              />
              <span
                className={`flex-1 text-sm ${
                  s.completed ? 'line-through text-gray-400' : 'text-gray-700'
                }`}
              >
                {s.title}
              </span>
              <button
                type="button"
                onClick={() => onRemove(s.id)}
                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-danger transition text-xs shrink-0"
                aria-label="Remove subtask"
              >
                ✕
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
          className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          type="submit"
          className="bg-primary text-white text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-blue-700 transition"
        >
          Add
        </button>
      </form>
    </div>
  );
}
