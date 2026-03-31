import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

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
  if (!dateStr) return null;
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
}

function isOverdue(dateStr) {
  if (!dateStr) return false;
  return new Date(dateStr) < new Date(new Date().toDateString());
}

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

  const statusStyle = STATUS_STYLES[task.status] || STATUS_STYLES.pending;
  const priorityStyle = PRIORITY_STYLES[task.priority] || PRIORITY_STYLES.medium;
  const overdue = task.status !== 'completed' && isOverdue(task.due_date);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="relative bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col gap-3 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 animate-fade-in-up"
    >
      {draggable && (
        <div
          {...listeners}
          className="absolute top-3 right-3 cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500 transition"
          title="Drag to move"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="9" cy="5" r="1.5"/><circle cx="15" cy="5" r="1.5"/>
            <circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/>
            <circle cx="9" cy="19" r="1.5"/><circle cx="15" cy="19" r="1.5"/>
          </svg>
        </div>
      )}
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-base font-semibold text-gray-800 leading-tight">
          {task.title}
        </h3>
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${statusStyle.badge}`}>
          {statusStyle.label}
        </span>
      </div>

      {task.description && (
        <p className="text-sm text-gray-500 line-clamp-3">{task.description}</p>
      )}

      <div className="flex items-center gap-2 flex-wrap">
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${priorityStyle.badge}`}>
          {priorityStyle.label} priority
        </span>
        {task.due_date && (
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
            overdue ? 'bg-rose-100 text-rose-600' : 'bg-gray-100 text-gray-500'
          }`}>
            {overdue ? '⚠ ' : ''}Due {formatDate(task.due_date)}
          </span>
        )}
        {task.subtask_count > 0 && (
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">
            {task.completed_subtask_count}/{task.subtask_count} subtasks
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 mt-auto pt-2 border-t border-gray-100">
        <button
          onClick={() => onEdit(task)}
          className="flex-1 text-sm font-medium text-primary border border-primary rounded-md py-1.5 hover:bg-blue-50 transition"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="flex-1 text-sm font-medium text-danger border border-danger rounded-md py-1.5 hover:bg-red-50 transition"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
