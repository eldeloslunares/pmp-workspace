import { useMemo, useCallback } from 'react';
import type { AppState, Project, Task, TaskStatus, Priority } from '../types';
import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEY } from '../utils/constants';
import { generateId, getInitialState } from '../utils/helpers';

export function useAppState() {
  const [state, setState] = useLocalStorage<AppState>(STORAGE_KEY, getInitialState());

  const createProject = useCallback((name: string): Project => {
    const now = new Date().toISOString();
    const project: Project = {
      id: generateId(),
      name,
      createdAt: now,
      updatedAt: now,
    };
    setState((prev) => ({
      ...prev,
      projects: [...prev.projects, project],
      activeProjectId: project.id,
    }));
    return project;
  }, [setState]);

  const deleteProject = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id),
      tasks: prev.tasks.filter((t) => t.projectId !== id),
      activeProjectId: prev.activeProjectId === id ? null : prev.activeProjectId,
    }));
  }, [setState]);

  const renameProject = useCallback((id: string, name: string) => {
    setState((prev) => ({
      ...prev,
      projects: prev.projects.map((p) =>
        p.id === id ? { ...p, name, updatedAt: new Date().toISOString() } : p
      ),
    }));
  }, [setState]);

  const setActiveProject = useCallback((id: string) => {
    setState((prev) => ({ ...prev, activeProjectId: id }));
  }, [setState]);

  const setActiveView = useCallback((view: 'table' | 'kanban') => {
    setState((prev) => ({ ...prev, activeView: view }));
  }, [setState]);

  const createTask = useCallback((taskData: {
    title: string;
    description: string;
    assignee: string;
    priority: Priority;
    status: TaskStatus;
    dueDate: string | null;
  }): Task | null => {
    if (!state.activeProjectId) return null;
    const now = new Date().toISOString();
    const projectTasks = state.tasks.filter(
      (t) => t.projectId === state.activeProjectId && t.status === taskData.status
    );
    const task: Task = {
      id: generateId(),
      projectId: state.activeProjectId,
      ...taskData,
      createdAt: now,
      updatedAt: now,
      order: projectTasks.length,
    };
    setState((prev) => ({
      ...prev,
      tasks: [...prev.tasks, task],
    }));
    return task;
  }, [state.activeProjectId, state.tasks, setState]);

  const updateTask = useCallback((id: string, updates: Partial<Omit<Task, 'id' | 'projectId' | 'createdAt'>>) => {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) =>
        t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
      ),
    }));
  }, [setState]);

  const deleteTask = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((t) => t.id !== id),
    }));
  }, [setState]);

  const moveTask = useCallback((id: string, newStatus: TaskStatus, newOrder: number) => {
    setState((prev) => {
      const task = prev.tasks.find((t) => t.id === id);
      if (!task) return prev;

      const otherTasks = prev.tasks.filter((t) => t.id !== id);
      const columnTasks = otherTasks
        .filter((t) => t.projectId === task.projectId && t.status === newStatus)
        .sort((a, b) => a.order - b.order);

      columnTasks.splice(newOrder, 0, { ...task, status: newStatus, updatedAt: new Date().toISOString() });
      const reordered = columnTasks.map((t, i) => ({ ...t, order: i }));

      const finalTasks = otherTasks
        .filter((t) => !(t.projectId === task.projectId && t.status === newStatus))
        .concat(reordered);

      return { ...prev, tasks: finalTasks };
    });
  }, [setState]);

  const activeProject = useMemo(
    () => state.projects.find((p) => p.id === state.activeProjectId) ?? null,
    [state.projects, state.activeProjectId]
  );

  const projectTasks = useMemo(
    () => state.tasks
      .filter((t) => t.projectId === state.activeProjectId)
      .sort((a, b) => a.order - b.order),
    [state.tasks, state.activeProjectId]
  );

  return {
    state,
    activeProject,
    projectTasks,
    createProject,
    deleteProject,
    renameProject,
    setActiveProject,
    setActiveView,
    createTask,
    updateTask,
    deleteTask,
    moveTask,
  };
}
