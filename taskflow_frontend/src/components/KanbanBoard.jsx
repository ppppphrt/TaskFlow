import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core';
import KanbanColumn from './KanbanColumn';
import TaskCard from './TaskCard';

const STATUSES = ['pending', 'in_progress', 'completed'];

export default function KanbanBoard({ tasks, onEdit, onDelete, onMove }) {
  const [activeTask, setActiveTask] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  function handleDragStart({ active }) {
    const task = tasks.find((t) => t.id === active.id);
    setActiveTask(task || null);
  }

  function handleDragEnd({ active, over }) {
    setActiveTask(null);
    if (!over) return;

    const task = tasks.find((t) => t.id === active.id);
    if (!task) return;

    // over.id is either a column status or another task id
    let targetStatus = STATUSES.includes(over.id)
      ? over.id
      : tasks.find((t) => t.id === over.id)?.status;

    if (targetStatus && targetStatus !== task.status) {
      onMove(task.id, targetStatus);
    }
  }

  const columns = STATUSES.map((status) => ({
    status,
    tasks: tasks.filter((t) => t.status === status),
  }));

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {columns.map(({ status, tasks: colTasks }) => (
          <KanbanColumn
            key={status}
            status={status}
            tasks={colTasks}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>

      <DragOverlay>
        {activeTask && (
          <div className="rotate-2 opacity-90 shadow-2xl">
            <TaskCard task={activeTask} onEdit={() => {}} onDelete={() => {}} />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
