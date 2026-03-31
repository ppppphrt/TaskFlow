const STATUS_STYLES = {
  pending: { badge: 'bg-rose-100 text-rose-700', label: 'Pending' },
  in_progress: { badge: 'bg-amber-100 text-amber-700', label: 'In Progress' },
  completed: { badge: 'bg-emerald-100 text-emerald-700', label: 'Completed' },
};

const PRIORITY_STYLES = {
  low: { badge: 'bg-gray-100 text-gray-500', label: 'Low' },
  medium: { badge: 'bg-amber-100 text-amber-600', label: 'Medium' },
  high: { badge: 'bg-rose-100 text-rose-600', label: 'High' },
};

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
}

function isOverdue(dateStr, status) {
  if (!dateStr || status === 'completed') return false;
  return new Date(dateStr) < new Date(new Date().toDateString());
}

export default function ListView({ tasks, onEdit, onDelete }) {
  if (tasks.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400">
        No tasks found.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Title
            </th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Status
            </th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Priority
            </th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Due Date
            </th>
            <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {tasks.map((task) => {
            const overdue = isOverdue(task.due_date, task.status);
            return (
              <tr key={task.id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-800">{task.title}</div>
                  {task.description && (
                    <div className="text-xs text-gray-400 truncate max-w-xs mt-0.5">
                      {task.description}
                    </div>
                  )}
                  {task.subtask_count > 0 && (
                    <div className="text-xs text-blue-500 mt-0.5">
                      {task.completed_subtask_count}/{task.subtask_count} subtasks
                    </div>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      STATUS_STYLES[task.status]?.badge
                    }`}
                  >
                    {STATUS_STYLES[task.status]?.label}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      PRIORITY_STYLES[task.priority]?.badge
                    }`}
                  >
                    {PRIORITY_STYLES[task.priority]?.label}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-medium ${overdue ? 'text-rose-600' : 'text-gray-500'}`}>
                    {overdue && '⚠ '}
                    {formatDate(task.due_date)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(task)}
                      className="text-xs font-medium text-primary border border-primary rounded-md px-3 py-1 hover:bg-blue-50 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(task.id)}
                      className="text-xs font-medium text-danger border border-danger rounded-md px-3 py-1 hover:bg-red-50 transition"
                    >
                      Delete
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
