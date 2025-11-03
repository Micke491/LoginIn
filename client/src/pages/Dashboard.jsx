import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async () => {
    if (!newTask) return;
    try {
      const res = await axios.post(
        "http://localhost:5000/api/tasks",
        { title: newTask },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks([...tasks, res.data]);
      setNewTask("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggle = async (id) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/tasks/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks(tasks.map((t) => (t._id === id ? res.data : t)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(tasks.filter((t) => t._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  return (
    <div className="dashboard-wrapper">
      <header className="dashboard-header">
        <h2>My To-Do List</h2>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </header>

      <div className="task-input">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task..."
        />
        <button onClick={handleAddTask}>Add</button>
      </div>

      <ul className="task-list">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <li
              key={task._id}
              style={{
                textDecoration: task.completed ? "line-through" : "none",
              }}
            >
              <div onClick={() => handleToggle(task._id)} className="task-title">
                {task.title}
              </div>
              <div className="task-meta">
                <span>{formatDate(task.createdAt)}</span>
                <button
                  onClick={() => handleDelete(task._id)}
                  className="delete-btn"
                >
                  ✕
                </button>
              </div>
            </li>
          ))
        ) : (
          <p className="empty-text">No tasks yet. Add your first one!</p>
        )}
      </ul>
    </div>
  );
}
