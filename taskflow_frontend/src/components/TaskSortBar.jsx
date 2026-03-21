import React from 'react';

const SORT_OPTIONS = [
  { value: 'created_at', label: 'Date Created' },
  { value: 'due_date', label: 'Due Date' },
  { value: 'priority', label: 'Priority' },
];

export default function TaskSortBar({ sortBy, onSortByChange, sortOrder, onSortOrderChange }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-secondary font-medium">Sort:</span>
      <select
        value={sortBy}
        onChange={(e) => onSortByChange(e.target.value)}
        className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-700"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <button
        onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
        title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
        className="border border-gray-300 rounded-lg px-2.5 py-1.5 text-gray-600 hover:border-primary hover:text-primary transition bg-white"
      >
        {sortOrder === 'asc' ? '↑' : '↓'}
      </button>
    </div>
  );
}
