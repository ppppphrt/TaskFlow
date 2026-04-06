import { useState } from 'react';
import { useTasks } from '../hooks/useTasks.jsx';
import { usePhases } from '../hooks/usePhases';
import { useTaskModal } from '../hooks/useTaskModal';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import TaskModal from '../components/TaskModal';
import PhaseModal from '../components/PhaseModal';
import TaskFilterBar from '../components/TaskFilterBar';
import TaskSortBar from '../components/TaskSortBar';
import KanbanBoard from '../components/KanbanBoard';
import ListView from '../components/ListView';

const VIEW_MODES = [
  { value: 'kanban', label: 'Kanban', icon: 'grid_view' },
  { value: 'list',   label: 'List',   icon: 'list' },
];

export default function DashboardView() {
  const [viewMode, setViewMode] = useState('kanban');
  const [isPhaseModalOpen, setIsPhaseModalOpen] = useState(false);

  const {
    filteredTasks, taskCounts,
    filter, setFilter,
    sortBy, setSortBy,
    sortOrder, setSortOrder,
    isLoading, saveTask, removeTask, moveTask,
  } = useTasks();

  const { phases, isLoading: phasesLoading, savePhase, removePhase } = usePhases();
  const { isModalOpen, editingTask, openCreateModal, openEditModal, closeModal } = useTaskModal();

  async function handleSave(data) {
    const saved = await saveTask(data, editingTask);
    if (saved) closeModal();
  }

  return (
    <div className="min-h-screen bg-surface text-on-surface font-body flex flex-col">
      <Navbar onAddTask={openCreateModal} />

      <main className="flex-grow max-w-[1440px] mx-auto w-full px-8 pt-12 pb-24">
        {/* Editorial header */}
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-black tracking-tighter text-on-surface mb-2">Tasks</h1>
            <p className="text-on-surface-variant font-medium opacity-70">
              Focus on what matters most. Your sanctuary of productivity.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Manage Phases */}
            <button
              onClick={() => setIsPhaseModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-on-surface-variant bg-surface-container-low hover:bg-surface-container-high transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">tune</span>
              Phases
            </button>

            {/* View toggle */}
            <div className="flex items-center gap-2 bg-surface-container-low p-1.5 rounded-xl">
              {VIEW_MODES.map((mode) => (
                <button
                  key={mode.value}
                  onClick={() => setViewMode(mode.value)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    viewMode === mode.value
                      ? 'bg-surface-container-lowest shadow-sm text-primary font-bold'
                      : 'text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">{mode.icon}</span>
                  {mode.label}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* Filter & Sort */}
        <section className="mb-10 flex flex-wrap items-center justify-between gap-6">
          <TaskFilterBar
            phases={phases}
            activeFilter={filter}
            onFilterChange={setFilter}
            counts={taskCounts}
          />
          <TaskSortBar
            sortBy={sortBy}
            onSortByChange={setSortBy}
            sortOrder={sortOrder}
            onSortOrderChange={setSortOrder}
          />
        </section>

        {/* Board */}
        {isLoading || phasesLoading ? (
          <div className="flex gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="min-w-[320px] bg-surface-container-lowest rounded-xl border border-outline-variant/10 p-6 animate-pulse h-48">
                <div className="h-4 bg-surface-container rounded w-3/4 mb-3" />
                <div className="h-3 bg-surface-container-low rounded w-full mb-2" />
                <div className="h-3 bg-surface-container-low rounded w-5/6" />
              </div>
            ))}
          </div>
        ) : viewMode === 'kanban' ? (
          <KanbanBoard
            tasks={filteredTasks}
            phases={phases}
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
        className="sm:hidden fixed bottom-6 right-6 z-40 bg-primary text-on-primary w-14 h-14 rounded-full shadow-lg text-2xl flex items-center justify-center active:scale-95 transition-transform"
        aria-label="Add Task"
      >
        <span className="material-symbols-outlined">add</span>
      </button>

      <Footer />

      <TaskModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSave}
        task={editingTask}
        phases={phases}
      />

      <PhaseModal
        isOpen={isPhaseModalOpen}
        onClose={() => setIsPhaseModalOpen(false)}
        phases={phases}
        onSave={savePhase}
        onDelete={removePhase}
      />
    </div>
  );
}
