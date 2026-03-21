import { useState } from 'react';

export function useTaskModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

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

  return { isModalOpen, editingTask, openCreateModal, openEditModal, closeModal };
}
