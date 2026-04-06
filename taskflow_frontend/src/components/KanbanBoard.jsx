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

export default function KanbanBoard({ tasks, phases, onEdit, onDelete, onMove }) {
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

    let targetPhaseId;
    if (typeof over.id === 'string' && over.id.startsWith('phase-')) {
      targetPhaseId = parseInt(over.id.replace('phase-', ''), 10);
    } else {
      const overTask = tasks.find((t) => t.id === over.id);
      targetPhaseId = overTask?.phase?.id;
    }

    if (targetPhaseId && targetPhaseId !== task.phase?.id) {
      onMove(task.id, targetPhaseId);
    }
  }

  const columns = phases.map((phase) => ({
    phase,
    tasks: tasks.filter((t) => t.phase?.id === phase.id),
  }));

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-8 items-start overflow-x-auto pb-6">
        {columns.map(({ phase, tasks: colTasks }) => (
          <KanbanColumn
            key={phase.id}
            phase={phase}
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
