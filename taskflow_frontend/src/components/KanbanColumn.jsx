import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import TaskCard from './TaskCard';

export default function KanbanColumn({ phase, tasks, onEdit, onDelete }) {
  const { setNodeRef, isOver } = useDroppable({ id: `phase-${phase.id}` });

  return (
    <div className="flex flex-col gap-6 min-w-[320px] max-w-[320px]">
      {/* Column header */}
      <div className="flex items-center justify-between px-2 py-1">
        <h3 className="flex items-center gap-2 font-black text-xs uppercase tracking-[0.15em] text-on-surface-variant">
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: phase.color }} />
          {phase.name}
        </h3>
        <span className="text-xs font-bold text-on-surface-variant opacity-40">
          {tasks.length} {tasks.length === 1 ? 'Task' : 'Tasks'}
        </span>
      </div>

      {/* Drop zone */}
      <div
        ref={setNodeRef}
        className={`flex flex-col gap-4 min-h-[120px] rounded-2xl p-3 transition-colors duration-150 ${
          isOver
            ? 'bg-primary/5 ring-2 ring-primary/30 ring-dashed'
            : 'bg-surface-container-low/50'
        }`}
      >
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} draggable />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <div className="flex items-center justify-center h-20 text-xs text-on-surface-variant/40 font-medium">
            Drop tasks here
          </div>
        )}
      </div>
    </div>
  );
}
