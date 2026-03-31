const STATUS_DOT = {
  pending: 'bg-rose-400',
  in_progress: 'bg-amber-400',
  completed: 'bg-emerald-400',
};

export default function CalendarDayCell({ day, dateStr, tasks, onEditTask }) {
  const today = new Date().toISOString().split('T')[0];
  const isToday = dateStr === today;

  return (
    <div
      className={`bg-white min-h-[80px] p-2 flex flex-col gap-1 ${
        isToday ? 'ring-2 ring-inset ring-primary' : ''
      }`}
    >
      <span
        className={`text-xs font-semibold self-start w-6 h-6 flex items-center justify-center rounded-full ${
          isToday ? 'bg-primary text-white' : 'text-gray-600'
        }`}
      >
        {day}
      </span>

      <div className="flex flex-col gap-0.5 overflow-hidden">
        {tasks.slice(0, 3).map((task) => (
          <button
            key={task.id}
            onClick={() => onEditTask(task)}
            className="flex items-center gap-1 text-left w-full group"
            title={task.title}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full shrink-0 ${STATUS_DOT[task.status] || 'bg-gray-400'}`}
            />
            <span className="text-xs text-gray-700 truncate group-hover:text-primary transition">
              {task.title}
            </span>
          </button>
        ))}
        {tasks.length > 3 && (
          <span className="text-xs text-gray-400">+{tasks.length - 3} more</span>
        )}
      </div>
    </div>
  );
}
