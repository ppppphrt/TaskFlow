import { useState } from 'react';
import { useTasks } from '../hooks/useTasks.jsx';
import { useTaskModal } from '../hooks/useTaskModal';
import Navbar from '../components/Navbar';
import TaskModal from '../components/TaskModal';
import TaskFilterBar from '../components/TaskFilterBar';
import TaskSortBar from '../components/TaskSortBar';
import KanbanBoard from '../components/KanbanBoard';
import ListView from '../components/ListView';

const VIEW_MODES = [
  { value: 'kanban', label: 'Kanban' },
  { value: 'list', label: 'List' },
];

export default function DashboardView() {
  const [viewMode, setViewMode] = useState('kanban');

  const {
    filteredTasks, taskCounts,
    filter, setFilter,
    sortBy, setSortBy,
    sortOrder, setSortOrder,
    isLoading, saveTask, removeTask, moveTask,
  } = useTasks();

  const { isModalOpen, editingTask, openCreateModal, openEditModal, closeModal } = useTaskModal();

  async function handleSave(data) {
    const saved = await saveTask(data, editingTask);
    if (saved) closeModal();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onAddTask={openCreateModal} />

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">My Tasks</h1>
          <button
            onClick={openCreateModal}
            className="bg-primary text-white text-sm font-medium px-5 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            + New Task
          </button>
        </div>

        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <TaskFilterBar
            activeFilter={filter}
            onFilterChange={setFilter}
            counts={taskCounts}
          />

          <div className="flex items-center gap-3">
            <div className="flex rounded-lg border border-gray-300 overflow-hidden">
              {VIEW_MODES.map((mode) => (
                <button
                  key={mode.value}
                  onClick={() => setViewMode(mode.value)}
                  className={`px-3 py-1.5 text-sm font-medium transition ${
                    viewMode === mode.value
                      ? 'bg-primary text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>
            <TaskSortBar
              sortBy={sortBy}
              onSortByChange={setSortBy}
              sortOrder={sortOrder}
              onSortOrderChange={setSortOrder}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse h-40">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
                <div className="h-3 bg-gray-100 rounded w-full mb-2" />
                <div className="h-3 bg-gray-100 rounded w-5/6" />
              </div>
            ))}
          </div>
        ) : viewMode === 'kanban' ? (
          <KanbanBoard
            tasks={filteredTasks}
            onEdit={openEditModal}
            onDelete={removeTask}
            onMove={moveTask}
          />
        ) : (
          <ListView
            tasks={filteredTasks}
            onEdit={openEditModal}
            onDelete={removeTask}
          />
        )}
      </main>

      {/* FAB for mobile */}
      <button
        onClick={openCreateModal}
        className="sm:hidden fixed bottom-6 right-6 z-40 bg-primary text-white w-14 h-14 rounded-full shadow-lg text-2xl flex items-center justify-center hover:bg-blue-700 transition"
        aria-label="Add Task"
      >
        +
      </button>

      <TaskModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSave}
        task={editingTask}
      />
    </div>
  );
}
