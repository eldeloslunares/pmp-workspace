import { useApp } from '../../context/AppContext';
import Button from '../common/Button';
import styles from './ViewSwitcher.module.css';

interface ViewSwitcherProps {
  onNewTask: () => void;
}

export default function ViewSwitcher({ onNewTask }: ViewSwitcherProps) {
  const { activeProject, state, setActiveView } = useApp();

  if (!activeProject) return null;

  return (
    <div className={styles.container}>
      <h2 className={styles.projectName}>{activeProject.name}</h2>

      <div className={styles.controls}>
        <div className={styles.segmented}>
          <button
            className={`${styles.segmentBtn} ${state.activeView === 'table' ? styles.activeSegment : ''}`}
            onClick={() => setActiveView('table')}
          >
            📊 Tabla PMP
          </button>
          <button
            className={`${styles.segmentBtn} ${state.activeView === 'kanban' ? styles.activeSegment : ''}`}
            onClick={() => setActiveView('kanban')}
          >
            📋 Kanban
          </button>
        </div>

        <Button variant="primary" onClick={onNewTask}>
          + Nueva Tarea
        </Button>
      </div>
    </div>
  );
}
