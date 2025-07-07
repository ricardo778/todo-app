import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('todos'); // 'todos' | 'completados' | 'pendientes'

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/todos');
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      alert('Error al cargar los todos');
    } finally {
      setLoading(false);
    }
  };

  const toggleComplete = async (id, completed) => {
    try {
      const response = await fetch(`http://localhost:3001/todos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !completed }),
      });

      if (response.ok) {
        setTodos(todos.map(todo =>
          todo.id === id ? { ...todo, completed: !completed } : todo
        ));
      }
    } catch (error) {
      alert('Error al actualizar');
    }
  };

  const deleteTodo = async (id) => {
    if (!window.confirm('¿Eliminar este todo?')) return;

    try {
      const response = await fetch(`http://localhost:3001/todos/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setTodos(todos.filter(todo => todo.id !== id));
      }
    } catch (error) {
      alert('Error al eliminar');
    }
  };

  // Filtrar los todos según el filtro activo
  const todosFiltrados = todos.filter(todo => {
    if (filtro === 'completados') return todo.completed;
    if (filtro === 'pendientes') return !todo.completed;
    return true; // todos
  });

  if (loading) return <div>Cargando...</div>;

  return (
    <div>
      <h2>Mis Todos</h2>

      <Link to="/add">+ Agregar Nuevo Todo</Link>

      <div style={{ marginTop: '15px', marginBottom: '10px' }}>
        <button onClick={() => setFiltro('todos')}>Todos</button>
        <button onClick={() => setFiltro('completados')}>Completados</button>
        <button onClick={() => setFiltro('pendientes')}>Pendientes</button>
      </div>

      {todosFiltrados.length === 0 ? (
        <p>No hay tareas. <Link to="/add">Crear una</Link></p>
      ) : (
        <ul>
          {todosFiltrados.map(todo => (
            <li key={todo.id}>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleComplete(todo.id, todo.completed)}
              />
              <span style={{
                flex: 1,
                textDecoration: todo.completed ? 'line-through' : 'none'
              }}>
                {todo.title}
              </span>
              <Link to={`/edit/${todo.id}`}>
                <button>Editar</button>
              </Link>
              <button onClick={() => deleteTodo(todo.id)}>Eliminar</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TodoList;
