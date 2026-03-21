import React from 'react';

export default function EmptyState({ onCreateTask }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="text-5xl mb-4">📋</div>
      <h3 className="text-lg font-semibold text-gray-700 mb-2">No tasks yet</h3>
      <p className="text-sm text-secondary mb-6 max-w-xs">
        Your task list is empty. Start your day by adding a goal!
      </p>
      <button
        onClick={onCreateTask}
        className="bg-primary text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-blue-700 transition"
      >
        + Add Your First Task
      </button>
    </div>
  );
}
