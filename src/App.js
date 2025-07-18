import React, { useEffect, useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState('');
  const listRef = useRef();

  // Carica da localStorage
  useEffect(() => {
    const saved = localStorage.getItem('tasks');
    if (saved) setTasks(JSON.parse(saved));
  }, []);

  // Salva su localStorage
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

  const condividiLista = async () => {
    if (!listRef.current) return;

    const canvas = await html2canvas(listRef.current);
    canvas.toBlob(async (blob) => {
      const file = new File([blob], 'lista-todo.png', { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: 'La mia To-Do List',
            text: 'Guarda cosa devo fare!'
          });
        } catch (err) {
          alert('Condivisione annullata o non riuscita.');
        }
      } else {
        alert('La condivisione diretta non è supportata su questo dispositivo. Puoi scaricare l\'immagine.');
        const link = document.createElement('a');
        link.download = 'lista-todo.png';
        link.href = URL.createObjectURL(file);
        link.click();
      }
    });
  };

  return (
    <div className="div">
      <div className="content">
        <h2>To-Do List</h2>
        <div ref={listRef} style={{
          padding: 16,
          background: '#fff9e6',
          borderRadius: 8,
          maxWidth: 400,
          marginBottom: 16
        }}>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {tasks.map(task => (
              <li key={task.id} style={{
                wordBreak: 'break-word',
                marginBottom: 6,
                background: '#f3f3f3',
                padding: '8px 12px',
                borderRadius: 4,
                display: 'flex',
                justifyContent: 'space-between'
              }}>
                <span>{task.text}</span>
                <button onClick={() => deleteTask(task.id)}>X</button>
              </li>
            ))}
          </ul>
        </div>
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addTask()}
          placeholder="Nuovo task"
          style={{ marginRight: 8 }}
        />
        <button onClick={addTask}>Aggiungi</button>
        <br /><br />
        <button onClick={condividiLista}>Condividi come immagine</button>
      </div>
    </div>
  );
}

export default App;