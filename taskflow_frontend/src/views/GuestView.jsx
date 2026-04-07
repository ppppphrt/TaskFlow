import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

const DEMO_PHASES = [
  { id: 1, name: 'Pending',     color: '#ba1a1a', is_terminal: false },
  { id: 2, name: 'In Progress', color: '#515f74', is_terminal: false },
  { id: 3, name: 'Completed',   color: '#005237', is_terminal: true  },
  { id: 4, name: 'In Review',   color: '#6750a4', is_terminal: false },
];

const DEMO_TASKS = [
  {
    id: 1, title: 'Research project topic',
    description: 'Gather sources and outline the main research questions.',
    priority: 'high', due_date: '2026-04-10', phase: DEMO_PHASES[0],
    subtask_count: 3, completed_subtask_count: 1,
  },
  {
    id: 2, title: 'Write introduction chapter',
    description: 'Draft the introduction and background sections.',
    priority: 'high', due_date: '2026-04-15', phase: DEMO_PHASES[1],
    subtask_count: 2, completed_subtask_count: 2,
  },
  {
    id: 3, title: 'Design system architecture',
    description: 'Create diagrams for the layered architecture.',
    priority: 'medium', due_date: '2026-04-12', phase: DEMO_PHASES[3],
    subtask_count: 0, completed_subtask_count: 0,
  },
  {
    id: 4, title: 'Set up development environment',
    description: 'Install Django, React, and configure the project.',
    priority: 'low', due_date: null, phase: DEMO_PHASES[2],
    subtask_count: 4, completed_subtask_count: 4,
  },
  {
    id: 5, title: 'Implement user authentication',
    description: 'JWT login, logout, and token refresh.',
    priority: 'high', due_date: '2026-04-20', phase: DEMO_PHASES[1],
    subtask_count: 2, completed_subtask_count: 1,
  },
  {
    id: 6, title: 'Write unit tests',
    description: 'Cover all API endpoints and frontend components.',
    priority: 'medium', due_date: '2026-04-25', phase: DEMO_PHASES[0],
    subtask_count: 0, completed_subtask_count: 0,
  },
];

const PRIORITY_BADGE = {
  low:    'bg-surface-container-low text-on-surface-variant',
  medium: 'bg-secondary-fixed text-on-secondary-fixed-variant',
  high:   'bg-error-container text-on-error-container',
};

function formatDate(dateStr) {
  if (!dateStr) return null;
  const [, month, day] = dateStr.split('-');
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${months[parseInt(month,10)-1]} ${parseInt(day,10)}`;
}

function DemoCard({ task }) {
  const isCompleted = task.phase?.is_terminal;
  return (
    <div className={`bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/10 ${isCompleted ? 'opacity-70' : ''}`}>
      <div className="mb-2">
        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded inline-block ${PRIORITY_BADGE[task.priority]}`}>
          {task.priority} priority
        </span>
      </div>
      <h4 className={`font-bold text-lg mb-2 leading-tight text-on-surface ${isCompleted ? 'line-through opacity-50' : ''}`}>
        {task.title}
      </h4>
      {task.description && (
        <p className="text-on-surface-variant text-sm mb-4 line-clamp-2">{task.description}</p>
      )}
      <div className="flex items-center justify-between pt-4 border-t border-surface-container-low">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: task.phase.color }} />
            {task.phase.name}
          </span>
          {task.due_date && (
            <span className="flex items-center gap-1 text-[11px] font-bold text-on-surface-variant/60">
              <span className="material-symbols-outlined text-sm">calendar_today</span>
              {formatDate(task.due_date)}
            </span>
          )}
          {task.subtask_count > 0 && (
            <span className="flex items-center gap-1 text-[11px] font-bold text-on-surface-variant/60">
              <span className="material-symbols-outlined text-sm">account_tree</span>
              {task.completed_subtask_count}/{task.subtask_count}
            </span>
          )}
        </div>
        {isCompleted && <span className="material-symbols-outlined text-tertiary text-lg">check_circle</span>}
      </div>
    </div>
  );
}

export default function GuestView() {
  return (
    <div className="min-h-screen bg-surface text-on-surface font-body flex flex-col">
      {/* Guest Navbar */}
      <nav className="bg-surface/80 backdrop-blur-lg sticky top-0 z-50 shadow-xl shadow-on-surface/5">
        <div className="flex justify-between items-center w-full px-8 py-4 max-w-[1440px] mx-auto">
          <span className="text-2xl font-black text-on-surface tracking-tighter">TaskFlow</span>
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-sm font-medium text-on-surface/60 hover:text-primary transition-colors"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-gradient-to-r from-primary to-primary-container text-on-primary px-5 py-2.5 rounded-xl font-bold text-sm active:scale-95 transition-transform"
            >
              Register
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-grow max-w-[1440px] mx-auto w-full px-8 pt-12 pb-24">
        {/* Guest banner */}
        <div className="mb-8 flex items-center gap-3 bg-secondary-fixed/30 border border-outline-variant/20 rounded-2xl px-5 py-3">
          <span className="material-symbols-outlined text-primary text-[20px]">info</span>
          <p className="text-sm text-on-surface-variant">
            You are viewing a <strong className="text-on-surface">read-only demo</strong>. No changes can be saved.
            <Link to="/register" className="ml-2 text-primary font-bold hover:underline">Create a free account →</Link>
          </p>
        </div>

        <header className="mb-12">
          <h1 className="text-5xl font-black tracking-tighter text-on-surface mb-2">Demo Tasks</h1>
          <p className="text-on-surface-variant font-medium opacity-70">
            See how TaskFlow helps you organise and track your work.
          </p>
        </header>

        {/* Phase legend */}
        <div className="flex items-center flex-wrap gap-4 mb-8">
          <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/50">Phases</span>
          {DEMO_PHASES.map((p) => (
            <div key={p.id} className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
              <span className="text-xs font-semibold text-on-surface-variant">{p.name}</span>
            </div>
          ))}
        </div>

        {/* Kanban columns */}
        <div className="flex gap-8 items-start overflow-x-auto pb-6">
          {DEMO_PHASES.map((phase) => {
            const colTasks = DEMO_TASKS.filter((t) => t.phase.id === phase.id);
            return (
              <div key={phase.id} className="flex flex-col gap-6 min-w-[300px] max-w-[300px]">
                <div className="flex items-center justify-between px-2 py-1">
                  <h3 className="flex items-center gap-2 font-black text-xs uppercase tracking-[0.15em] text-on-surface-variant">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: phase.color }} />
                    {phase.name}
                  </h3>
                  <span className="text-xs font-bold text-on-surface-variant opacity-40">{colTasks.length}</span>
                </div>
                <div className="flex flex-col gap-4 min-h-[120px] rounded-2xl p-3 bg-surface-container-low/50">
                  {colTasks.map((task) => <DemoCard key={task.id} task={task} />)}
                  {colTasks.length === 0 && (
                    <div className="flex items-center justify-center h-20 text-xs text-on-surface-variant/40 font-medium">
                      No tasks
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center bg-surface-container-lowest rounded-2xl border border-outline-variant/10 p-12">
          <span className="material-symbols-outlined text-primary text-5xl mb-4 block">rocket_launch</span>
          <h2 className="text-3xl font-black tracking-tighter text-on-surface mb-3">Ready to get organised?</h2>
          <p className="text-on-surface-variant mb-6">Create your free account and start managing your tasks today.</p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-primary-container text-on-primary px-8 py-3 rounded-xl font-bold text-sm active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-[18px]">person_add</span>
            Get Started Free
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
