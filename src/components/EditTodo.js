import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function EditTodo() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:3001/todos/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.title) {
          setTitle(data.title);
        } else {
          alert('Tarea no encontrada');
          navigate('/todos');
        }
      })
      .catch(() => {
        alert('Error al cargar la tarea');
        navigate('/todos');
      });
  }, [id, navigate]);

  // Enviar cambios a la API
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert('Escribe un título');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`http://localhost:3001/todos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim() }),
      });

      if (response.ok) {
        navigate('/todos');
      } else {
        alert('Error al guardar cambios');
      }
    } catch (error) {
      alert('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Editar Todo</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Título:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={loading}
          />
        </div>
        <div>
          <button type="submit" disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/todos')}
            disabled={loading}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditTodo;
