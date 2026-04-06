export default function TaskFilterBar({ phases = [], activeFilter, onFilterChange, counts = {} }) {
  const allCount = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0">
      {/* All Tasks pill */}
      <button
        onClick={() => onFilterChange('all')}
        className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
          activeFilter === 'all'
            ? 'bg-on-surface text-surface font-bold tracking-tight'
            : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
        }`}
      >
        All Tasks
        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
          activeFilter === 'all' ? 'bg-surface/20' : 'bg-surface-container text-on-surface-variant'
        }`}>
          {allCount}
        </span>
      </button>

      {/* Dynamic phase pills */}
      {phases.map((phase) => {
        const isActive = activeFilter === phase.id;
        const count = counts[phase.id] ?? 0;
        return (
          <button
            key={phase.id}
            onClick={() => onFilterChange(phase.id)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
              isActive
                ? 'bg-on-surface text-surface font-bold tracking-tight'
                : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: phase.color }}
            />
            {phase.name}
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
              isActive ? 'bg-surface/20' : 'bg-surface-container text-on-surface-variant'
            }`}>
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
