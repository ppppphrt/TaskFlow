const SORT_OPTIONS = [
  { value: 'created_at', label: 'Created Date' },
  { value: 'due_date',   label: 'Due Date' },
  { value: 'priority',   label: 'Priority' },
];

export default function TaskSortBar({ sortBy, onSortByChange, sortOrder, onSortOrderChange }) {
  return (
    <div className="flex items-center gap-6">
      <div className="flex items-center gap-2 text-on-surface-variant">
        <span className="material-symbols-outlined text-[18px]">sort</span>
        <span className="text-[10px] uppercase font-bold tracking-widest">Sort by</span>
        <select
          value={sortBy}
          onChange={(e) => onSortByChange(e.target.value)}
          className="bg-transparent border-none focus:ring-0 text-sm font-bold text-on-surface cursor-pointer outline-none"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
      <div className="h-4 w-px bg-outline-variant opacity-30" />
      <button
        onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
        title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
        className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors"
      >
        swap_vert
      </button>
    </div>
  );
}
