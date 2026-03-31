import CalendarDayCell from './CalendarDayCell';

const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CalendarGrid({ calendarDays, onEditTask }) {
  return (
    <div>
      <div className="grid grid-cols-7 mb-1">
        {WEEK_DAYS.map((d) => (
          <div key={d} className="text-center text-xs font-semibold text-gray-400 py-2">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-xl overflow-hidden border border-gray-200">
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
            <div key={`empty-${idx}`} className="bg-gray-50 min-h-[80px]" />
          )
        )}
      </div>
    </div>
  );
}
