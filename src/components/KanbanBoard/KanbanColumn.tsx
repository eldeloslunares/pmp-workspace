import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { Task, TaskStatus } from '../../types';
import { STATUS_COLORS } from '../../utils/constants';
import KanbanCard from './KanbanCard';
import styles from './KanbanBoard.module.css';

interface KanbanColumnProps {
  status: TaskStatus;
  tasks: Task[];
  onEditTask: (task: Task) => void;
}

export default function KanbanColumn({ status, tasks, onEditTask }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div
      className={`${styles.column} ${isOver ? styles.columnOver : ''}`}
      ref={setNodeRef}
    >
      <div className={styles.columnHeader}>
        <span
          className={styles.columnDot}
          style={{ background: STATUS_COLORS[status] }}
        />
        <h3 className={styles.columnTitle}>{status}</h3>
        <span className={styles.columnCount}>{tasks.length}</span>
      </div>
      <SortableContext
        items={tasks.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className={styles.columnContent}>
          {tasks.map((task) => (
            <KanbanCard key={task.id} task={task} onEdit={onEditTask} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}
