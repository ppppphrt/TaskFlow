import React from 'react';

const FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];

const ACTIVE_STYLES = {
  all: 'bg-secondary text-white border-secondary',
  pending: 'bg-rose-500 text-white border-rose-500',
  in_progress: 'bg-warning text-white border-warning',
  completed: 'bg-success text-white border-success',
};

export default function TaskFilterBar({ activeFilter, onFilterChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {FILTERS.map((filter) => {
        const isActive = activeFilter === filter.value;
        return (
          <button
            key={filter.value}
            onClick={() => onFilterChange(filter.value)}
            className={`text-sm font-medium px-4 py-1.5 rounded-full border transition ${
              isActive
                ? ACTIVE_STYLES[filter.value]
                : 'bg-white text-gray-600 border-gray-300 hover:border-primary hover:text-primary'
            }`}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}
