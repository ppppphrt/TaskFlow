import React from 'react';

const STATS = [
  { key: 'total',       label: 'Total',       color: 'text-primary',   bg: 'bg-blue-50'   },
  { key: 'in_progress', label: 'In Progress', color: 'text-warning',   bg: 'bg-amber-50'  },
  { key: 'completed',   label: 'Completed',   color: 'text-success',   bg: 'bg-emerald-50'},
  { key: 'overdue',     label: 'Overdue',     color: 'text-danger',    bg: 'bg-rose-50'   },
];

export default function StatsBar({ stats }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
      {STATS.map(({ key, label, color, bg }) => (
        <div key={key} className={`${bg} rounded-xl px-4 py-3 flex flex-col gap-1`}>
          <span className={`text-2xl font-bold ${color}`}>{stats[key] ?? 0}</span>
          <span className="text-xs text-secondary font-medium">{label}</span>
        </div>
      ))}
    </div>
  );
}
