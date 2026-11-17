import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  useSensor,
  useSensors,
  PointerSensor,
} from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { useApp } from '../../context/AppContext';
import type { Task, TaskStatus } from '../../types';
import { TASK_STATUSES } from '../../utils/constants';
import KanbanColumn from './KanbanColumn';
import KanbanCard from './KanbanCard';
import styles from './KanbanBoard.module.css';

interface KanbanBoardProps {
  onEditTask: (task: Task) => void;
}

export default function KanbanBoard({ onEditTask }: KanbanBoardProps) {
  const { projectTasks, moveTask } = useApp();
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  const getTasksByStatus = (status: TaskStatus) =>
    projectTasks
      .filter((t) => t.status === status)
      .sort((a, b) => a.order - b.order);

  const findColumnOfTask = (taskId: string): TaskStatus | null => {
    const task = projectTasks.find((t) => t.id === taskId);
    return task ? task.status : null;
  };

  const handleDragStart = (event: DragStartEvent) => {
    const task = projectTasks.find((t) => t.id === event.active.id);
    setActiveTask(task || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Determine target status and order
    let targetStatus: TaskStatus;
    let targetOrder: number;

    if (TASK_STATUSES.includes(overId as TaskStatus)) {
      // Dropped on a column directly
      targetStatus = overId as TaskStatus;
      targetOrder = getTasksByStatus(targetStatus).length;
    } else {
      // Dropped on another task
      const overTask = projectTasks.find((t) => t.id === overId);
      if (!overTask) return;
      targetStatus = overTask.status;
      const columnTasks = getTasksByStatus(targetStatus);
      const overIndex = columnTasks.findIndex((t) => t.id === overId);
      targetOrder = overIndex >= 0 ? overIndex : columnTasks.length;
    }

    if (activeId !== overId) {
      moveTask(activeId, targetStatus, targetOrder);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className={styles.board}>
        {TASK_STATUSES.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            tasks={getTasksByStatus(status)}
            onEditTask={onEditTask}
          />
        ))}
      </div>
      <DragOverlay>
        {activeTask ? (
          <KanbanCard task={activeTask} onEdit={() => {}} isDragOverlay />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
