import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState('');

  // Carica i task da localStorage all'avvio
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // Salva i task su localStorage ogni volta che cambiano
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (text.trim() === '') return;
    const newTask = { id: Date.now(), text };
    setTasks(prev => [...prev, newTask]);
    setText('');
  };

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  return (
    <div className="div">
      <h2>To-Do List</h2>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Nuovo task"
        style={{ marginRight: 8 }}, className="content"
      />
      <button onClick={addTask}>Aggiungi</button>
      <ul style={{ marginTop: 20 }}>
        {tasks.map(task => (
          <li key={task.id} style={{ marginBottom: 6 }}>
            {task.text}{' '}
            <button onClick={() => deleteTask(task.id)}>X</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
