import type { Task, TaskStatus } from '../../types';
import { TASK_STATUSES, STATUS_COLORS, PRIORITY_COLORS } from '../../utils/constants';
import { formatDate, isOverdue } from '../../utils/helpers';
import Badge from '../common/Badge';
import styles from './TableView.module.css';

interface TableRowProps {
  task: Task;
  onEdit: (task: Task) => void;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
}

export default function TableRow({ task, onEdit, onStatusChange }: TableRowProps) {
  return (
    <tr className={styles.row} onClick={() => onEdit(task)}>
      <td className={styles.td}>
        <span className={styles.taskTitle}>{task.title}</span>
        {task.description && (
          <span className={styles.taskDesc}>{task.description}</span>
        )}
      </td>
      <td className={styles.td}>
        <span className={styles.assignee}>
          {task.assignee || <span className={styles.muted}>Sin asignar</span>}
        </span>
      </td>
      <td className={styles.td}>
        <Badge label={task.priority} color={PRIORITY_COLORS[task.priority]} />
      </td>
      <td className={styles.td} onClick={(e) => e.stopPropagation()}>
        <select
          className={styles.statusSelect}
          value={task.status}
          onChange={(e) => onStatusChange(task.id, e.target.value as TaskStatus)}
          style={{ color: STATUS_COLORS[task.status] }}
        >
          {TASK_STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </td>
      <td className={`${styles.td} ${isOverdue(task.dueDate) && task.status !== 'Completado' ? styles.overdue : ''}`}>
        {formatDate(task.dueDate)}
      </td>
    </tr>
  );
}
