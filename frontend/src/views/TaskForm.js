import React, { useState } from 'react';
import axios from 'axios';

function TaskForm({ token }) {
  const [title, setTitle] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://backendd-rouge.vercel.app/tasks', { title }, { headers: { Authorization: token } });
      console.log('Task created successfully');
    } catch (error) {
      console.error('Error creating task:', error.message);
    }
  };

  return (
    <div>
      <h2>Create Task</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>
        <br />
        <button type="submit">Create Task</button>
      </form>
    </div>
  );
}

export default TaskForm;