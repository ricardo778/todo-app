import React from 'react';
import { useParams } from 'react-router-dom';

function EditTodo() {
  const { id } = useParams();

  return (
    <div>
      <h2>Editar Todo (ID: {id})</h2>
      <p>Funcionalidad de edición en desarrollo...</p>
    </div>
  );
}

export default EditTodo;
