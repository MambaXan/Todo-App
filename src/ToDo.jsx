// TodoApp.jsx
import { useState, useEffect, useRef } from 'react';
import './ToDo.scss';

const ToDo = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [filter, setFilter] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const inputRef = useRef(null);

  // Загрузка задач из LocalStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // Сохранение задач в LocalStorage
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Добавление задачи
  const addTask = () => {
    if (!newTask.trim()) return;
    
    const newTaskObj = {
      id: Date.now(),
      text: newTask,
      completed: false,
      important: false,
      createdAt: new Date().toISOString()
    };
    
    setTasks([...tasks, newTaskObj]);
    setNewTask('');
    inputRef.current.focus();
  };

  // Удаление задачи
  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  // Переключение статуса выполнения
  const toggleComplete = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  // Переключение важности
  const toggleImportant = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, important: !task.important } : task
    ));
  };

  // Начало редактирования
  const startEditing = (id, text) => {
    setEditingId(id);
    setEditText(text);
  };

  // Сохранение редактирования
  const saveEdit = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, text: editText } : task
    ));
    setEditingId(null);
  };

  // Фильтрация задач
  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'active') return !task.completed;
    if (filter === 'important') return task.important;
    return true;
  });

  // Сортировка: важные сверху, затем новые
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (a.important !== b.important) return b.important - a.important;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <div className="todo-app">
      <div className="header">
        <h1>Productivity Pro</h1>
        <p>Your ultimate task management solution</p>
      </div>

      <div className="task-input-container">
        <input
          type="text"
          ref={inputRef}
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTask()}
          placeholder="What needs to be done?"
          className="task-input"
        />
        <button onClick={addTask} className="add-btn">
          <span className="plus-icon">+</span>
        </button>
      </div>

      <div className="controls">
        <div className="filter-dropdown">
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Tasks</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="important">Important</option>
          </select>
          <div className="dropdown-arrow">▼</div>
        </div>
        <div className="task-count">
          {tasks.filter(t => !t.completed).length} tasks left
        </div>
      </div>

      <div className="task-list">
        {sortedTasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <p>No tasks found</p>
            <small>Add a task to get started!</small>
          </div>
        ) : (
          sortedTasks.map(task => (
            <div 
              key={task.id} 
              className={`task-item ${task.completed ? 'completed' : ''} ${task.important ? 'important' : ''}`}
            >
              <div className="task-content">
                <button 
                  onClick={() => toggleComplete(task.id)} 
                  className={`complete-btn ${task.completed ? 'checked' : ''}`}
                >
                  {task.completed && '✓'}
                </button>

                {editingId === task.id ? (
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onBlur={() => saveEdit(task.id)}
                    onKeyDown={(e) => e.key === 'Enter' && saveEdit(task.id)}
                    autoFocus
                    className="edit-input"
                  />
                ) : (
                  <span 
                    className="task-text"
                    onDoubleClick={() => startEditing(task.id, task.text)}
                  >
                    {task.text}
                  </span>
                )}

                <button 
                  onClick={() => toggleImportant(task.id)} 
                  className={`important-btn ${task.important ? 'active' : ''}`}
                >
                  {task.important ? '★' : '☆'}
                </button>
              </div>

              <div className="task-actions">
                {editingId !== task.id && (
                  <button 
                    onClick={() => startEditing(task.id, task.text)}
                    className="edit-btn"
                  >
                    ✏️
                  </button>
                )}
                <button 
                  onClick={() => deleteTask(task.id)}
                  className="delete-btn"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="footer">
        <p>Double click to edit task</p>
        <div className="drag-hint">↑ Drag tasks to reorder (coming soon) ↑</div>
      </div>
    </div>
  );
};

export default ToDo;