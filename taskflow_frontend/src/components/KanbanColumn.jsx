import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import TaskCard from './TaskCard';

const COLUMN_STYLES = {
  pending:     { header: 'bg-rose-50 border-rose-200 text-rose-700',     dot: 'bg-rose-400',     label: 'Pending' },
  in_progress: { header: 'bg-amber-50 border-amber-200 text-amber-700',  dot: 'bg-amber-400',    label: 'In Progress' },
  completed:   { header: 'bg-emerald-50 border-emerald-200 text-emerald-700', dot: 'bg-emerald-400', label: 'Completed' },
};

export default function KanbanColumn({ status, tasks, onEdit, onDelete }) {
  const { setNodeRef, isOver } = useDroppable({ id: status });
  const style = COLUMN_STYLES[status];

  return (
    <div className="flex flex-col min-w-0">
      {/* Column header */}
      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border mb-3 ${style.header}`}>
        <span className={`w-2 h-2 rounded-full ${style.dot}`} />
        <span className="text-sm font-semibold">{style.label}</span>
        <span className="ml-auto text-xs font-medium opacity-70">{tasks.length}</span>
      </div>

      {/* Drop zone */}
      <div
        ref={setNodeRef}
        className={`flex-1 flex flex-col gap-3 min-h-[120px] rounded-xl p-2 transition-colors duration-150 ${
          isOver ? 'bg-blue-50 ring-2 ring-primary ring-dashed' : 'bg-gray-100/50'
        }`}
      >
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} draggable />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <div className="flex items-center justify-center h-20 text-xs text-gray-400">
            Drop tasks here
          </div>
        )}
      </div>
    </div>
  );
}
