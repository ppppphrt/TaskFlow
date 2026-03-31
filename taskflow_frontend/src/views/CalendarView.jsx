import { useCalendar } from '../hooks/useCalendar';
import { useTasks } from '../hooks/useTasks.jsx';
import { useTaskModal } from '../hooks/useTaskModal';
import Navbar from '../components/Navbar';
import CalendarGrid from '../components/CalendarGrid';
import TaskModal from '../components/TaskModal';

export default function CalendarView() {
  const { tasks, saveTask, isLoading } = useTasks();
  const { isModalOpen, editingTask, openCreateModal, openEditModal, closeModal } = useTaskModal();
  const { year, monthName, calendarDays, prevMonth, nextMonth } = useCalendar(tasks);

  async function handleSave(data) {
    const saved = await saveTask(data, editingTask);
    if (saved) closeModal();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onAddTask={openCreateModal} />

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Calendar</h1>
          <button
            onClick={openCreateModal}
            className="bg-primary text-white text-sm font-medium px-5 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            + New Task
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={prevMonth}
              className="p-2 rounded-lg hover:bg-gray-100 transition text-gray-600 text-xl font-light"
              aria-label="Previous month"
            >
              ‹
            </button>
            <h2 className="text-lg font-bold text-gray-800">
              {monthName} {year}
            </h2>
            <button
              onClick={nextMonth}
              className="p-2 rounded-lg hover:bg-gray-100 transition text-gray-600 text-xl font-light"
              aria-label="Next month"
            >
              ›
            </button>
          </div>

          {isLoading ? (
            <div className="h-64 animate-pulse bg-gray-100 rounded-xl" />
          ) : (
            <CalendarGrid calendarDays={calendarDays} onEditTask={openEditModal} />
          )}

          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
            <span className="text-xs text-gray-500 font-medium">Legend:</span>
            {[
              { color: 'bg-rose-400', label: 'Pending' },
              { color: 'bg-amber-400', label: 'In Progress' },
              { color: 'bg-emerald-400', label: 'Completed' },
            ].map(({ color, label }) => (
              <div key={label} className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${color}`} />
                <span className="text-xs text-gray-500">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      <TaskModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSave}
        task={editingTask}
      />
    </div>
  );
}
