import { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/Sidebar/Sidebar';
import ViewSwitcher from './components/ViewSwitcher/ViewSwitcher';
import TableView from './components/TableView/TableView';
import KanbanBoard from './components/KanbanBoard/KanbanBoard';
import TaskModal from './components/TaskModal/TaskModal';
import EmptyState from './components/common/EmptyState';
import type { Task } from './types';
import styles from './App.module.css';

function AppContent() {
  const { activeProject, state } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleNewTask = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  return (
    <div className={styles.layout}>
      <Sidebar />
      <main className={styles.main}>
        {activeProject ? (
          <>
            <ViewSwitcher onNewTask={handleNewTask} />
            <div className={styles.content}>
              {state.activeView === 'table' ? (
                <TableView onEditTask={handleEditTask} />
              ) : (
                <KanbanBoard onEditTask={handleEditTask} />
              )}
            </div>
          </>
        ) : (
          <div className={styles.emptyWrapper}>
            <EmptyState
              icon="📋"
              title="Selecciona o crea un proyecto"
              subtitle="Usa el panel lateral para comenzar"
            />
          </div>
        )}
      </main>
      <TaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        task={editingTask}
      />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
