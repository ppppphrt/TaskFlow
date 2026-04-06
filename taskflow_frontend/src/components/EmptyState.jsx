export default function EmptyState({ onCreateTask, isFiltered = false }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <span className="material-symbols-outlined text-6xl text-on-surface-variant/20 mb-4">
        {isFiltered ? 'search_off' : 'task_alt'}
      </span>
      <h3 className="text-lg font-black tracking-tight text-on-surface mb-2">
        {isFiltered ? 'No tasks match this filter' : 'No tasks yet'}
      </h3>
      <p className="text-sm text-on-surface-variant/60 mb-8 max-w-xs">
        {isFiltered
          ? 'Try selecting a different filter to see your tasks.'
          : 'Your task list is empty. Start your day by adding a goal!'}
      </p>
      {!isFiltered && (
        <button
          onClick={onCreateTask}
          className="bg-gradient-to-r from-primary to-primary-container text-on-primary text-sm font-bold px-6 py-2.5 rounded-xl active:scale-95 transition-transform flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Add Your First Task
        </button>
      )}
    </div>
  );
}
