import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { fetchTasks, createTask, updateTask, deleteTask } from '../services/api';
import Navbar from '../components/Navbar';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import TaskFilterBar from '../components/TaskFilterBar';
import EmptyState from '../components/EmptyState';

export default function DashboardView() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    setIsLoading(true);
    try {
      const res = await fetchTasks();
      setTasks(res.data);
    } catch {
      toast.error('Failed to load tasks.');
    } finally {
      setIsLoading(false);
    }
  }

  function openCreateModal() {
    setEditingTask(null);
    setIsModalOpen(true);
  }

  function openEditModal(task) {
    setEditingTask(task);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditingTask(null);
  }

  async function handleSave(data) {
    try {
      if (editingTask) {
        const res = await updateTask(editingTask.id, data);
        setTasks((prev) =>
          prev.map((t) => (t.id === editingTask.id ? res.data : t))
        );
        toast.success('Task updated!');
      } else {
        const res = await createTask(data);
        setTasks((prev) => [res.data, ...prev]);
        toast.success('Task created!');
      }
      closeModal();
    } catch {
      toast.error('Failed to save task. Please try again.');
    }
  }

  async function handleDelete(id) {
    const toastId = toast(
      <div>
        <p className="text-sm font-medium text-gray-800 mb-2">Delete this task?</p>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              toast.dismiss(toastId);
              try {
                await deleteTask(id);
                setTasks((prev) => prev.filter((t) => t.id !== id));
                toast.success('Task deleted.');
              } catch {
                toast.error('Failed to delete task.');
              }
            }}
            className="bg-danger text-white text-xs font-medium px-3 py-1 rounded"
          >
            Delete
          </button>
          <button
            onClick={() => toast.dismiss(toastId)}
            className="bg-gray-200 text-gray-700 text-xs font-medium px-3 py-1 rounded"
          >
            Cancel
          </button>
        </div>
      </div>,
      { autoClose: false, closeButton: false }
    );
  }

  const filteredTasks =
    filter === 'all' ? tasks : tasks.filter((t) => t.status === filter);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">My Tasks</h1>
          <button
            onClick={openCreateModal}
            className="bg-primary text-white text-sm font-medium px-5 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            + New Task
          </button>
        </div>

        <div className="mb-6">
          <TaskFilterBar activeFilter={filter} onFilterChange={setFilter} />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse"
              >
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
                <div className="h-3 bg-gray-100 rounded w-full mb-2" />
                <div className="h-3 bg-gray-100 rounded w-5/6" />
              </div>
            ))}
          </div>
        ) : filteredTasks.length === 0 ? (
          <EmptyState onCreateTask={openCreateModal} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={openEditModal}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>

      <TaskModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSave}
        task={editingTask}
      />
    </div>
  );
}
