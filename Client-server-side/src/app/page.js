"use client"; 

import React, { useState, useEffect } from 'react';
import AddTask from "./components/AddTask";
import TodoList from "./components/TodoList";
import axios from 'axios';

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = () => {
    axios.get('http://127.0.0.1:8000/api/todos')
      .then(response => {
        setTasks(response.data);
      })
      .catch(error => {
        console.error('Failed to fetch tasks:', error);
      });
  };

  const handleTaskAdded = (newTask) => {
    if (editingTask) {
      setTasks(tasks.map(task => task.id === newTask.id ? newTask : task));
    } else {
      setTasks([...tasks, newTask]);
    }
    setEditingTask(null);
  };

  const handleTaskDeleted = (deletedTaskId) => {
    setTasks(tasks.filter(task => task.id !== deletedTaskId));
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
  };

  return (
    <>
      <section className="max-w-4xl mx-auto pt-4">
        <div className="text-center flex flex-col gap-4">
          <h1>To-Do Task</h1>
          <AddTask onTaskAdded={handleTaskAdded} editingTask={editingTask} setEditingTask={setEditingTask} />
        </div>
        <TodoList todos={tasks} onDelete={handleTaskDeleted} onEdit={handleEditTask} />
      </section>
    </>
  );
}
