import { useCalendar } from '../hooks/useCalendar';
import { useTasks } from '../hooks/useTasks.jsx';
import { usePhases } from '../hooks/usePhases';
import { useTaskModal } from '../hooks/useTaskModal';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CalendarGrid from '../components/CalendarGrid';
import TaskModal from '../components/TaskModal';

export default function CalendarView() {
  const { tasks, saveTask, isLoading } = useTasks();
  const { phases } = usePhases();
  const { isModalOpen, editingTask, openCreateModal, openEditModal, closeModal } = useTaskModal();
  const { year, monthName, calendarDays, prevMonth, nextMonth } = useCalendar(tasks);

  async function handleSave(data) {
    const saved = await saveTask(data, editingTask);
    if (saved) closeModal();
  }

  return (
    <div className="min-h-screen bg-surface text-on-surface font-body flex flex-col">
      <Navbar onAddTask={openCreateModal} />

      <main className="flex-grow max-w-[1440px] mx-auto w-full px-8 pt-12 pb-24">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <h1 className="text-5xl font-black tracking-tighter text-on-surface mb-2">Calendar</h1>
            <p className="text-on-surface-variant font-medium opacity-70">
              Visualize your tasks by due date.
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="bg-gradient-to-r from-primary to-primary-container text-on-primary px-5 py-2.5 rounded-xl font-bold text-sm active:scale-95 transition-transform flex items-center gap-2 self-start md:self-auto"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            New Task
          </button>
        </header>

        <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/10 p-6">
          {/* Month navigation */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={prevMonth}
              className="p-2 rounded-xl hover:bg-surface-container-low transition text-on-surface-variant hover:text-on-surface"
              aria-label="Previous month"
            >
              ←
            </button>
            <h2 className="text-xl font-black tracking-tight text-on-surface">
              {monthName} {year}
            </h2>
            <button
              onClick={nextMonth}
              className="p-2 rounded-xl hover:bg-surface-container-low transition text-on-surface-variant hover:text-on-surface"
              aria-label="Next month"
            >
              →
            </button>
          </div>

          {isLoading ? (
            <div className="h-64 animate-pulse bg-surface-container-low rounded-xl" />
          ) : (
            <CalendarGrid calendarDays={calendarDays} onEditTask={openEditModal} />
          )}

          {/* Dynamic phase legend */}
          {phases.length > 0 && (
            <div className="flex items-center flex-wrap gap-4 mt-4 pt-4 border-t border-outline-variant/20">
              <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/50">Legend</span>
              {phases.map((phase) => (
                <div key={phase.id} className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: phase.color }} />
                  <span className="text-xs font-medium text-on-surface-variant">{phase.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />

      <TaskModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSave}
        task={editingTask}
        phases={phases}
      />
    </div>
  );
}
