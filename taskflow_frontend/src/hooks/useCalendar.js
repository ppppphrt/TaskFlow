import { useMemo, useState } from 'react';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export function useCalendar(tasks) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  function prevMonth() {
    setCurrentDate(new Date(year, month - 1, 1));
  }

  function nextMonth() {
    setCurrentDate(new Date(year, month + 1, 1));
  }

  const tasksByDate = useMemo(() => {
    const map = {};
    tasks.forEach((task) => {
      if (task.due_date) {
        if (!map[task.due_date]) map[task.due_date] = [];
        map[task.due_date].push(task);
      }
    });
    return map;
  }, [tasks]);

  const calendarDays = useMemo(() => {
    const firstDayOfWeek = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];

    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const mm = String(month + 1).padStart(2, '0');
      const dd = String(d).padStart(2, '0');
      const dateStr = `${year}-${mm}-${dd}`;
      days.push({ day: d, dateStr, tasks: tasksByDate[dateStr] || [] });
    }

    return days;
  }, [year, month, tasksByDate]);

  return {
    year,
    month,
    monthName: MONTH_NAMES[month],
    calendarDays,
    prevMonth,
    nextMonth,
  };
}
