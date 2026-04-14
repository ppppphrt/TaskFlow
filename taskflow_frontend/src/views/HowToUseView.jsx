import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

const SECTIONS = [
  {
    icon: 'person_add',
    title: 'Getting Started',
    steps: [
      {
        heading: 'Create an account',
        body: 'Click Register on the login page and fill in your username, email, and password. You will be logged in automatically.',
      },
      {
        heading: 'Log in',
        body: 'Visit the Login page and enter your credentials. TaskFlow uses secure JWT tokens so your session is refreshed automatically.',
      },
      {
        heading: 'Guest preview',
        body: 'Not ready to sign up? Click "Continue as Guest" on the login page to explore a read-only demo of the board.',
      },
    ],
  },
  {
    icon: 'view_kanban',
    title: 'Managing Tasks',
    steps: [
      {
        heading: 'Add a task',
        body: 'Click the "+ Add Task" button in the top navigation bar. Fill in the title, description, priority (Low / Medium / High), due date, and assign it to a phase.',
      },
      {
        heading: 'Edit or delete a task',
        body: 'Click any task card to open its detail panel. Use the edit icon to update details or the trash icon to delete it.',
      },
      {
        heading: 'Subtasks',
        body: 'Inside a task detail panel you can add subtasks and check them off individually. Progress is shown on the card as a fraction (e.g. 2/4).',
      },
      {
        heading: 'Priority',
        body: 'Each task has a priority badge — High (red), Medium (purple), or Low (grey). Use the filter bar to show only tasks of a specific priority.',
      },
    ],
  },
  {
    icon: 'dashboard_customize',
    title: 'Phases',
    steps: [
      {
        heading: 'What are phases?',
        body: 'Phases replace fixed statuses like "To Do / Done". You can create any phases that match your workflow, e.g. Backlog → In Progress → Review → Done.',
      },
      {
        heading: 'Create a phase',
        body: 'On the Dashboard, click "Manage Phases". Enter a name, pick a colour, and mark it as a terminal phase if it means the task is finished (e.g. "Done").',
      },
      {
        heading: 'Move tasks between phases',
        body: 'Drag a task card from one Kanban column to another, or open the task and change its phase in the edit form.',
      },
    ],
  },
  {
    icon: 'swap_horiz',
    title: 'Kanban & List Views',
    steps: [
      {
        heading: 'Kanban board',
        body: 'The default view. Each phase is a column. Tasks appear as cards you can drag and drop to change their phase.',
      },
      {
        heading: 'List view',
        body: 'Toggle to list view using the view switch buttons above the board. All tasks appear in a compact table sorted by due date.',
      },
      {
        heading: 'Filter & sort',
        body: 'Use the filter bar to narrow tasks by priority or phase. Use the sort bar to order by due date, priority, or creation date.',
      },
    ],
  },
  {
    icon: 'calendar_month',
    title: 'Calendar',
    steps: [
      {
        heading: 'Navigate to Calendar',
        body: 'Click "Calendar" in the navigation bar. Tasks with a due date appear on their respective day.',
      },
      {
        heading: 'Browse months',
        body: 'Use the left/right arrows to move between months. Click "Today" to jump back to the current month.',
      },
      {
        heading: 'View task details',
        body: 'Click a task chip on the calendar to open its detail panel, where you can edit or delete it.',
      },
    ],
  },
  {
    icon: 'manage_accounts',
    title: 'Profile & Settings',
    steps: [
      {
        heading: 'Edit your profile',
        body: 'Click your username in the top-right corner to go to your Profile page. You can update your username and email there.',
      },
      {
        heading: 'Change your password',
        body: 'On the Profile page, expand the "Change Password" section, enter your current password and a new one, then save.',
      },
    ],
  },
];

function Section({ icon, title, steps }) {
  return (
    <div className="mb-14">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <span className="material-symbols-outlined text-primary text-xl">{icon}</span>
        </div>
        <h2 className="text-2xl font-black tracking-tight text-on-surface">{title}</h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {steps.map((step, i) => (
          <div
            key={i}
            className="bg-surface-container-lowest border border-outline-variant/10 rounded-2xl p-6"
          >
            <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">
              Step {i + 1}
            </p>
            <h3 className="font-bold text-on-surface mb-2">{step.heading}</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">{step.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function HowToUseView() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-surface text-on-surface font-body flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-[1440px] mx-auto w-full px-8 pt-12 pb-24">
        <header className="mb-12">
          <h1 className="text-5xl font-black tracking-tighter text-on-surface mb-3">
            How to use TaskFlow
          </h1>
          <p className="text-on-surface-variant font-medium opacity-70 max-w-2xl">
            Everything you need to know to organise your work, track progress, and collaborate — all in one place.
          </p>
          {!user && (
            <div className="mt-6 flex items-center gap-4">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-primary-container text-on-primary px-6 py-2.5 rounded-xl font-bold text-sm active:scale-95 transition-transform"
              >
                <span className="material-symbols-outlined text-[18px]">person_add</span>
                Get Started Free
              </Link>
              <Link
                to="/login"
                className="text-sm font-medium text-on-surface/60 hover:text-primary transition-colors"
              >
                Already have an account? Log in →
              </Link>
            </div>
          )}
        </header>

        {SECTIONS.map((section) => (
          <Section key={section.title} {...section} />
        ))}

        <div className="mt-8 bg-surface-container-lowest rounded-2xl border border-outline-variant/10 p-10 text-center">
          <span className="material-symbols-outlined text-primary text-4xl mb-4 block">help_center</span>
          <h2 className="text-2xl font-black tracking-tight text-on-surface mb-2">Still have questions?</h2>
          <p className="text-on-surface-variant text-sm mb-6">
            Try the interactive demo to see TaskFlow in action before signing up.
          </p>
          <Link
            to="/guest"
            className="inline-flex items-center gap-2 border border-outline-variant/30 text-on-surface px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-surface-container-low transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">visibility</span>
            View Demo
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
