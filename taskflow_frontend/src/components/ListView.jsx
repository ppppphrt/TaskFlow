const PRIORITY_STYLES = {
  low:    { badge: 'bg-surface-container-low text-on-surface-variant', label: 'Low' },
  medium: { badge: 'bg-secondary-fixed text-on-secondary-fixed-variant', label: 'Medium' },
  high:   { badge: 'bg-error-container text-on-error-container',        label: 'High' },
};

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const [, month, day] = dateStr.split('-');
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${months[parseInt(month,10)-1]} ${parseInt(day,10)}`;
}

function isOverdue(dateStr, isTerminal) {
  if (!dateStr || isTerminal) return false;
  return new Date(dateStr) < new Date(new Date().toDateString());
}

export default function ListView({ tasks, onEdit, onDelete }) {
  if (tasks.length === 0) {
    return (
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/10 p-12 text-center text-on-surface-variant/40 font-medium">
        No tasks found.
      </div>
    );
  }

  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/10 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-surface-container-low border-b border-outline-variant/20">
          <tr>
            {['Title', 'Phase', 'Priority', 'Due Date', ''].map((h) => (
              <th
                key={h}
                className={`px-5 py-3 text-[10px] font-black uppercase tracking-widest text-on-surface-variant ${h === '' ? 'text-right' : 'text-left'}`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-outline-variant/10">
          {tasks.map((task) => {
            const overdue = isOverdue(task.due_date, task.phase?.is_terminal);
            return (
              <tr key={task.id} className="hover:bg-surface-container-low/50 transition group">
                <td className="px-5 py-4">
                  <div className={`font-semibold text-on-surface ${task.phase?.is_terminal ? 'line-through opacity-50' : ''}`}>
                    {task.title}
                  </div>
                  {task.description && (
                    <div className="text-xs text-on-surface-variant/60 truncate max-w-xs mt-0.5">{task.description}</div>
                  )}
                  {task.subtask_count > 0 && (
                    <div className="flex items-center gap-1 text-xs text-on-surface-variant/50 mt-0.5">
                      <span className="material-symbols-outlined text-[14px]">account_tree</span>
                      {task.completed_subtask_count}/{task.subtask_count} subtasks
                    </div>
                  )}
                </td>
                <td className="px-5 py-4">
                  {task.phase ? (
                    <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: task.phase.color }} />
                      {task.phase.name}
                    </span>
                  ) : (
                    <span className="text-[10px] text-on-surface-variant/40">—</span>
                  )}
                </td>
                <td className="px-5 py-4">
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${PRIORITY_STYLES[task.priority]?.badge}`}>
                    {PRIORITY_STYLES[task.priority]?.label}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span className={`flex items-center gap-1 text-xs font-semibold ${overdue ? 'text-error' : 'text-on-surface-variant/60'}`}>
                    {overdue && <span className="material-symbols-outlined text-sm">warning</span>}
                    {formatDate(task.due_date)}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onEdit(task)}
                      className="p-1.5 hover:bg-surface-container rounded-lg text-on-surface-variant transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">edit</span>
                    </button>
                    <button
                      onClick={() => onDelete(task.id)}
                      className="p-1.5 hover:bg-error-container hover:text-on-error-container rounded-lg text-on-surface-variant transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
