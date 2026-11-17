import type { AppState } from '../types';

export function generateId(): string {
  return crypto.randomUUID();
}

export function formatDate(isoString: string | null): string {
  if (!isoString) return '—';
  const date = new Date(isoString + 'T00:00:00');
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function isOverdue(dueDate: string | null): boolean {
  if (!dueDate) return false;
  return new Date(dueDate) < new Date(new Date().toDateString());
}

export function getInitialState(): AppState {
  return {
    projects: [],
    tasks: [],
    activeProjectId: null,
    activeView: 'table',
  };
}
