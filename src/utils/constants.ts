import { TaskStatus, Priority } from '../types';

export const TASK_STATUSES: TaskStatus[] = [
  'Por hacer', 'En progreso', 'En revisión', 'Completado'
];

export const PRIORITIES: Priority[] = ['Alta', 'Media', 'Baja'];

export const STATUS_COLORS: Record<TaskStatus, string> = {
  'Por hacer': 'var(--color-status-por-hacer)',
  'En progreso': 'var(--color-status-en-progreso)',
  'En revisión': 'var(--color-status-en-revision)',
  'Completado': 'var(--color-status-completado)',
};

export const PRIORITY_COLORS: Record<Priority, string> = {
  'Alta': 'var(--color-priority-alta)',
  'Media': 'var(--color-priority-media)',
  'Baja': 'var(--color-priority-baja)',
};

export const STORAGE_KEY = 'pmp-app-state';
