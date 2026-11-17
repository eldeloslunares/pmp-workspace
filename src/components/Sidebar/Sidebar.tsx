import { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import styles from './Sidebar.module.css';

export default function Sidebar() {
  const { state, createProject, deleteProject, renameProject, setActiveProject } = useApp();
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const editRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isCreating && inputRef.current) inputRef.current.focus();
  }, [isCreating]);

  useEffect(() => {
    if (editingId && editRef.current) editRef.current.focus();
  }, [editingId]);

  const handleCreate = () => {
    const trimmed = newName.trim();
    if (trimmed) {
      createProject(trimmed);
    }
    setNewName('');
    setIsCreating(false);
  };

  const handleRename = (id: string) => {
    const trimmed = editName.trim();
    if (trimmed) {
      renameProject(id, trimmed);
    }
    setEditingId(null);
    setEditName('');
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <h1 className={styles.title}>📋 PMP Manager</h1>
      </div>

      <button
        className={styles.newButton}
        onClick={() => setIsCreating(true)}
      >
        + Nuevo Proyecto
      </button>

      {isCreating && (
        <div className={styles.inputWrapper}>
          <input
            ref={inputRef}
            className={styles.input}
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleCreate();
              if (e.key === 'Escape') { setIsCreating(false); setNewName(''); }
            }}
            onBlur={handleCreate}
            placeholder="Nombre del proyecto..."
          />
        </div>
      )}

      <nav className={styles.projectList}>
        {state.projects.map((project) => (
          <div
            key={project.id}
            className={`${styles.projectItem} ${
              state.activeProjectId === project.id ? styles.active : ''
            }`}
            onClick={() => setActiveProject(project.id)}
          >
            {editingId === project.id ? (
              <input
                ref={editRef}
                className={styles.editInput}
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleRename(project.id);
                  if (e.key === 'Escape') { setEditingId(null); setEditName(''); }
                }}
                onBlur={() => handleRename(project.id)}
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <span
                className={styles.projectName}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  setEditingId(project.id);
                  setEditName(project.name);
                }}
              >
                {project.name}
              </span>
            )}
            <button
              className={styles.deleteButton}
              onClick={(e) => {
                e.stopPropagation();
                deleteProject(project.id);
              }}
              title="Eliminar proyecto"
            >
              ×
            </button>
          </div>
        ))}
      </nav>
    </aside>
  );
}
