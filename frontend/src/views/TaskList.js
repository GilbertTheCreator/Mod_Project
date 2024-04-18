import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TaskList = ({ token }) => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('http://localhost:3001/tasks', {
          headers: {
            Authorization: token,
          },
        });
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks:');
      }
    };

    fetchTasks();
  }, [token]);

  const handleDeleteAll = async () => {
    try {
      await axios.delete('http://localhost:3001/tasks', {
        headers: {
          Authorization: token,
        },
      });

      setTasks([]);
    } catch (error) {
      console.error('Error deleting tasks');
    }
  };

  return (
    <div>
      <h2>Task List</h2>
      <button onClick={handleDeleteAll}>Delete All Tasks</button>

      <div>
        {tasks.length > 0 && (
          <>
            <p>Total tasks: {tasks.length}</p>
            <ul>
              {tasks.map((task) => (
                <li key={task._id}>
                  {task.title}
                </li>
              ))}
            </ul>
          </>
        )}

        {tasks.length === 0 && <p>No tasks available.</p>}
      </div>
    </div>
  );
};

export default TaskList;
