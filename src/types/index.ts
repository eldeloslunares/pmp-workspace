export type Priority = 'Alta' | 'Media' | 'Baja';

export type TaskStatus = 'Por hacer' | 'En progreso' | 'En revisión' | 'Completado';

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  assignee: string;
  priority: Priority;
  status: TaskStatus;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  order: number;
}

export interface Project {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppState {
  projects: Project[];
  tasks: Task[];
  activeProjectId: string | null;
  activeView: 'table' | 'kanban';
}
