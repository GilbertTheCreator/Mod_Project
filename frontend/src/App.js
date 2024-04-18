import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import Login from './views/Login';
import Register from './views/Register';
import Home from './views/Home';
import TaskList from './views/TaskList';
import TaskForm from './views/TaskForm';
import Logout from './views/Logout';
import './App.css';
function App() {
const [token, setToken] = useState('');

  return (
    <Router>
      <div>
        <nav><ul><li>
          <Link to="/">Home</Link>
        </li>
          {!token && (
            <>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
            </>
          )}
          {token && (
            <>
              <li><Link to="/tasks">Tasks</Link></li>
              <li><Link to="/create-task">Create Task</Link></li>
              <li><Link to="/logout">Logout</Link></li>
            </>
          )}</ul></nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setToken={setToken} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/tasks" element={<TaskList token={token} />} />
          <Route path="/create-task" element={<TaskForm token={token} />} />
          <Route path="/logout" element={<Logout setToken={setToken} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
