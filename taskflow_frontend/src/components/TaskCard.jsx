import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { PRIORITY_BADGE, PRIORITY_LABEL, formatDate, isOverdue } from '../utils/taskUtils';

export default function TaskCard({ task, onEdit, onDelete, draggable = false }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    disabled: !draggable,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const isCompleted = task.phase?.is_terminal === true;
  const overdue = isOverdue(task.due_date, isCompleted);

  if (isCompleted) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        className="bg-surface-container-lowest/60 p-6 rounded-xl border border-outline-variant/10 group relative opacity-80"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="h-6" />
          <span className="material-symbols-outlined text-tertiary text-lg">check_circle</span>
        </div>
        <h4 className="font-bold text-lg mb-4 leading-tight line-through opacity-40">
          {task.title}
        </h4>
        <div className="flex items-center justify-between pt-4 border-t border-surface-container-low">
          <span className="flex items-center gap-1 text-[11px] font-bold text-on-surface-variant opacity-40">
            <span className="material-symbols-outlined text-sm">done_all</span>
            Completed
          </span>
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 hover:bg-surface-container-low rounded-lg text-on-surface-variant transition-colors opacity-0 group-hover:opacity-100"
            title="Edit"
          >
            <span className="material-symbols-outlined text-sm">edit</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="bg-surface-container-lowest p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow group relative border border-outline-variant/10"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="h-6" />
        {draggable && (
          <span
            {...listeners}
            className="material-symbols-outlined text-outline-variant opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing transition-opacity select-none"
          >
            drag_indicator
          </span>
        )}
      </div>

      <div className="mb-2">
        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded inline-block ${PRIORITY_BADGE[task.priority] || PRIORITY_BADGE.medium}`}>
          {PRIORITY_LABEL[task.priority] || 'Medium Priority'}
        </span>
      </div>

      <h4 className="font-bold text-lg mb-2 leading-tight text-on-surface">{task.title}</h4>

      {task.description && (
        <p className="text-on-surface-variant text-sm mb-4 line-clamp-2">{task.description}</p>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-surface-container-low">
        <div className="flex items-center gap-3">
          {task.due_date && (
            <span className={`flex items-center gap-1 text-[11px] font-bold ${overdue ? 'text-error' : 'text-on-surface-variant opacity-60'}`}>
              <span className="material-symbols-outlined text-sm">
                {overdue ? 'warning' : 'calendar_today'}
              </span>
              {overdue ? 'Overdue' : formatDate(task.due_date)}
            </span>
          )}
          {task.subtask_count > 0 && (
            <span className="flex items-center gap-1 text-[11px] font-bold text-on-surface-variant">
              <span className="material-symbols-outlined text-sm">account_tree</span>
              {task.completed_subtask_count}/{task.subtask_count}
            </span>
          )}
        </div>

        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 hover:bg-surface-container-low rounded-lg text-on-surface-variant transition-colors"
            title="Edit"
          >
            <span className="material-symbols-outlined text-sm">edit</span>
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-1.5 hover:bg-error-container hover:text-on-error-container rounded-lg text-on-surface-variant transition-colors"
            title="Delete"
          >
            <span className="material-symbols-outlined text-sm">delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}
