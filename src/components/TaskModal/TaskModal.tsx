import { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import type { Task, TaskStatus, Priority } from '../../types';
import { TASK_STATUSES, PRIORITIES } from '../../utils/constants';
import Button from '../common/Button';
import styles from './TaskModal.module.css';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task | null;
}

export default function TaskModal({ isOpen, onClose, task }: TaskModalProps) {
  const { createTask, updateTask, deleteTask } = useApp();
  const modalRef = useRef<HTMLDivElement>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignee, setAssignee] = useState('');
  const [priority, setPriority] = useState<Priority>('Media');
  const [status, setStatus] = useState<TaskStatus>('Por hacer');
  const [dueDate, setDueDate] = useState('');

  const isEditing = !!task;

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setAssignee(task.assignee);
      setPriority(task.priority);
      setStatus(task.status);
      setDueDate(task.dueDate || '');
    } else {
      setTitle('');
      setDescription('');
      setAssignee('');
      setPriority('Media');
      setStatus('Por hacer');
      setDueDate('');
    }
  }, [task, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const data = {
      title: title.trim(),
      description: description.trim(),
      assignee: assignee.trim(),
      priority,
      status,
      dueDate: dueDate || null,
    };

    if (isEditing && task) {
      updateTask(task.id, data);
    } else {
      createTask(data);
    }
    onClose();
  };

  const handleDelete = () => {
    if (task) {
      deleteTask(task.id);
      onClose();
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal} ref={modalRef}>
        <div className={styles.header}>
          <h2 className={styles.headerTitle}>
            {isEditing ? 'Editar Tarea' : 'Nueva Tarea'}
          </h2>
          <button className={styles.closeBtn} onClick={onClose}>×</button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label}>Título *</label>
            <input
              className={styles.input}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nombre de la tarea..."
              required
              autoFocus
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Descripción</label>
            <textarea
              className={styles.textarea}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descripción corta..."
              rows={3}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Responsable</label>
            <input
              className={styles.input}
              type="text"
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              placeholder="Nombre del responsable..."
            />
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Prioridad</label>
              <select
                className={styles.select}
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Estado</label>
              <select
                className={styles.select}
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
              >
                {TASK_STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Fecha límite</label>
              <input
                className={styles.input}
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.actions}>
            {isEditing && (
              <Button variant="danger" onClick={handleDelete}>
                Eliminar
              </Button>
            )}
            <div className={styles.actionsRight}>
              <Button variant="ghost" onClick={onClose}>
                Cancelar
              </Button>
              <Button variant="primary" type="submit" disabled={!title.trim()}>
                {isEditing ? 'Guardar' : 'Crear Tarea'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
