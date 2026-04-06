export default function CalendarDayCell({ day, dateStr, tasks, onEditTask }) {
  const today = new Date().toISOString().split('T')[0];
  const isToday = dateStr === today;

  return (
    <div className={`bg-surface-container-lowest min-h-[88px] p-2.5 flex flex-col gap-1 ${isToday ? 'ring-2 ring-inset ring-primary' : ''}`}>
      <span className={`text-xs font-black self-start w-6 h-6 flex items-center justify-center rounded-full ${isToday ? 'bg-primary text-on-primary' : 'text-on-surface-variant'}`}>
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
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{ backgroundColor: task.phase?.color || '#515f74' }}
            />
            <span className="text-[11px] font-medium text-on-surface-variant truncate group-hover:text-primary transition-colors">
              {task.title}
            </span>
          </button>
        ))}
        {tasks.length > 3 && (
          <span className="text-[10px] font-bold text-on-surface-variant/40">+{tasks.length - 3} more</span>
        )}
      </div>
    </div>
  );
}
