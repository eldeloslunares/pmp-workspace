import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Task } from '../../types';
import { PRIORITY_COLORS } from '../../utils/constants';
import { formatDate, isOverdue } from '../../utils/helpers';
import Badge from '../common/Badge';
import styles from './KanbanBoard.module.css';

interface KanbanCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  isDragOverlay?: boolean;
}

export default function KanbanCard({ task, onEdit, isDragOverlay = false }: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const overdue = isOverdue(task.dueDate) && task.status !== 'Completado';

  return (
    <div
      ref={!isDragOverlay ? setNodeRef : undefined}
      style={!isDragOverlay ? style : undefined}
      className={`${styles.card} ${isDragOverlay ? styles.cardOverlay : ''}`}
      onClick={() => onEdit(task)}
      {...(!isDragOverlay ? { ...attributes, ...listeners } : {})}
    >
      <div className={styles.cardHeader}>
        <span className={styles.cardTitle}>{task.title}</span>
        <Badge
          label={task.priority}
          color={PRIORITY_COLORS[task.priority]}
          variant="filled"
        />
      </div>
      {task.description && (
        <p className={styles.cardDesc}>{task.description}</p>
      )}
      <div className={styles.cardFooter}>
        <span className={styles.cardAssignee}>
          {task.assignee ? (
            <>
              <span className={styles.avatar}>
                {task.assignee.charAt(0).toUpperCase()}
              </span>
              {task.assignee}
            </>
          ) : (
            <span className={styles.cardMuted}>Sin asignar</span>
          )}
        </span>
        {task.dueDate && (
          <span className={`${styles.cardDate} ${overdue ? styles.cardOverdue : ''}`}>
            📅 {formatDate(task.dueDate)}
          </span>
        )}
      </div>
    </div>
  );
}
