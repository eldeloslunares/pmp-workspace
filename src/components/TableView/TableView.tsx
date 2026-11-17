import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { Task } from '../../types';
import TableRow from './TableRow';
import EmptyState from '../common/EmptyState';
import styles from './TableView.module.css';

interface TableViewProps {
  onEditTask: (task: Task) => void;
}

type SortKey = 'title' | 'assignee' | 'priority' | 'status' | 'dueDate';

const PRIORITY_ORDER = { 'Alta': 0, 'Media': 1, 'Baja': 2 };
const STATUS_ORDER = { 'Por hacer': 0, 'En progreso': 1, 'En revisión': 2, 'Completado': 3 };

export default function TableView({ onEditTask }: TableViewProps) {
  const { projectTasks, updateTask } = useApp();
  const [sortKey, setSortKey] = useState<SortKey>('status');
  const [sortAsc, setSortAsc] = useState(true);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const sortedTasks = [...projectTasks].sort((a, b) => {
    let cmp = 0;
    switch (sortKey) {
      case 'title':
        cmp = a.title.localeCompare(b.title);
        break;
      case 'assignee':
        cmp = (a.assignee || '').localeCompare(b.assignee || '');
        break;
      case 'priority':
        cmp = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
        break;
      case 'status':
        cmp = STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
        break;
      case 'dueDate':
        cmp = (a.dueDate || '9999').localeCompare(b.dueDate || '9999');
        break;
    }
    return sortAsc ? cmp : -cmp;
  });

  const getSortIcon = (key: SortKey) => {
    if (sortKey !== key) return ' ↕';
    return sortAsc ? ' ↑' : ' ↓';
  };

  if (projectTasks.length === 0) {
    return (
      <EmptyState
        icon="📝"
        title="Sin tareas aún"
        subtitle="Crea tu primera tarea con el botón '+ Nueva Tarea'"
      />
    );
  }

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th} onClick={() => handleSort('title')}>
              Título{getSortIcon('title')}
            </th>
            <th className={styles.th} onClick={() => handleSort('assignee')}>
              Responsable{getSortIcon('assignee')}
            </th>
            <th className={styles.th} onClick={() => handleSort('priority')}>
              Prioridad{getSortIcon('priority')}
            </th>
            <th className={styles.th} onClick={() => handleSort('status')}>
              Estado{getSortIcon('status')}
            </th>
            <th className={styles.th} onClick={() => handleSort('dueDate')}>
              Fecha límite{getSortIcon('dueDate')}
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedTasks.map((task) => (
            <TableRow
              key={task.id}
              task={task}
              onEdit={onEditTask}
              onStatusChange={(taskId, status) => updateTask(taskId, { status })}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
