import { useState } from 'react';
import { useAdmin } from '../hooks/useAdmin.jsx';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { PRIORITY_BADGE, formatDate } from '../utils/taskUtils';

export default function AdminView() {
  const [tab, setTab] = useState('users');
  const { users, tasks, filteredUsers, filteredTasks, search, setSearch, isLoading, removeUser, removeTask } = useAdmin();

  return (
    <div className="min-h-screen bg-surface text-on-surface font-body flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-[1440px] mx-auto w-full px-8 pt-12 pb-24">
        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <span className="material-symbols-outlined text-primary text-3xl">admin_panel_settings</span>
            <h1 className="text-5xl font-black tracking-tighter text-on-surface">Admin</h1>
          </div>
          <p className="text-on-surface-variant font-medium opacity-70">
            Manage all users and tasks across the system.
          </p>
        </header>

        {/* Stats strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Total Users',    value: users.length,                        icon: 'group' },
            { label: 'Total Tasks',    value: tasks.length,                        icon: 'task_alt' },
            { label: 'Active Tasks',   value: tasks.filter(t => !t.phase?.is_terminal).length, icon: 'pending_actions' },
            { label: 'Completed',      value: tasks.filter(t => t.phase?.is_terminal).length,  icon: 'check_circle' },
          ].map((s) => (
            <div key={s.label} className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 p-5 flex items-center gap-4">
              <span className="material-symbols-outlined text-primary text-2xl">{s.icon}</span>
              <div>
                <p className="text-2xl font-black text-on-surface">{s.value}</p>
                <p className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant opacity-60">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tab + Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 bg-surface-container-low p-1.5 rounded-xl">
            {[
              { value: 'users', label: 'Users',      icon: 'group' },
              { value: 'tasks', label: 'All Tasks',  icon: 'task_alt' },
            ].map((t) => (
              <button
                key={t.value}
                onClick={() => { setTab(t.value); setSearch(''); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  tab === t.value
                    ? 'bg-surface-container-lowest shadow-sm text-primary font-bold'
                    : 'text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>

          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50 text-[18px]">search</span>
            <input
              type="text"
              placeholder={tab === 'users' ? 'Search users…' : 'Search tasks or owner…'}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-surface-container-low border border-outline-variant/40 rounded-xl pl-9 pr-4 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 w-64"
            />
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/10 p-12 animate-pulse" />
        ) : tab === 'users' ? (
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/10 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-surface-container-low border-b border-outline-variant/20">
                <tr>
                  {['Username', 'Email', 'Role', 'Joined', 'Tasks', ''].map((h) => (
                    <th key={h} className={`px-5 py-3 text-[10px] font-black uppercase tracking-widest text-on-surface-variant ${h === '' ? 'text-right' : 'text-left'}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-surface-container-low/50 transition group">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-on-surface/40 text-[18px]">account_circle</span>
                        <span className="font-semibold text-on-surface">{u.username}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-on-surface-variant/70">{u.email || '—'}</td>
                    <td className="px-5 py-4">
                      <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${
                        u.is_staff
                          ? 'bg-primary/10 text-primary'
                          : 'bg-surface-container text-on-surface-variant'
                      }`}>
                        {u.is_staff ? 'Admin' : 'User'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-on-surface-variant/70 text-xs">{new Date(u.date_joined).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                    <td className="px-5 py-4 text-on-surface-variant/70">{u.task_count}</td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                        {!u.is_staff && (
                          <button
                            onClick={() => removeUser(u.id)}
                            className="p-1.5 hover:bg-error-container hover:text-on-error-container rounded-lg text-on-surface-variant transition-colors"
                            title="Delete user"
                          >
                            <span className="material-symbols-outlined text-sm">delete</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredUsers.length === 0 && (
              <p className="text-center py-12 text-on-surface-variant/40 font-medium">No users found.</p>
            )}
          </div>
        ) : (
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/10 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-surface-container-low border-b border-outline-variant/20">
                <tr>
                  {['Title', 'Owner', 'Phase', 'Priority', 'Due Date', ''].map((h) => (
                    <th key={h} className={`px-5 py-3 text-[10px] font-black uppercase tracking-widest text-on-surface-variant ${h === '' ? 'text-right' : 'text-left'}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {filteredTasks.map((t) => (
                  <tr key={t.id} className="hover:bg-surface-container-low/50 transition group">
                    <td className="px-5 py-4 font-semibold text-on-surface max-w-xs truncate">{t.title}</td>
                    <td className="px-5 py-4">
                      <span className="flex items-center gap-1.5 text-xs text-on-surface-variant">
                        <span className="material-symbols-outlined text-[14px]">account_circle</span>
                        {t.owner_username}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {t.phase ? (
                        <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: t.phase.color }} />
                          {t.phase.name}
                        </span>
                      ) : <span className="text-on-surface-variant/40">—</span>}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${PRIORITY_BADGE[t.priority]}`}>
                        {t.priority}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-on-surface-variant/70">{formatDate(t.due_date) ?? '—'}</td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => removeTask(t.id)}
                          className="p-1.5 hover:bg-error-container hover:text-on-error-container rounded-lg text-on-surface-variant transition-colors"
                        >
                          <span className="material-symbols-outlined text-sm">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredTasks.length === 0 && (
              <p className="text-center py-12 text-on-surface-variant/40 font-medium">No tasks found.</p>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
