import CalendarDayCell from './CalendarDayCell';

const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CalendarGrid({ calendarDays, onEditTask }) {
  return (
    <div>
      <div className="grid grid-cols-7 mb-1">
        {WEEK_DAYS.map((d) => (
          <div key={d} className="text-center text-[10px] font-black uppercase tracking-widest text-on-surface-variant/50 py-2">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-px bg-outline-variant/20 rounded-xl overflow-hidden border border-outline-variant/20">
        {calendarDays.map((cell, idx) =>
          cell ? (
            <CalendarDayCell
              key={cell.dateStr}
              day={cell.day}
              dateStr={cell.dateStr}
              tasks={cell.tasks}
              onEditTask={onEditTask}
            />
          ) : (
            <div key={`empty-${idx}`} className="bg-surface-container-low/50 min-h-[88px]" />
          )
        )}
      </div>
    </div>
  );
}
