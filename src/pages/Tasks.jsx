import { useState, useEffect } from 'react';
import '../App.css';


function Tasks() {
    const [tasks, setTasks] = useState(() => {
  const savedTasks = localStorage.getItem('tasks');
  return savedTasks ? JSON.parse(savedTasks) : [];
});
    const [taskName, setTaskName] = useState('');
    
useEffect(() => {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}, [tasks]);


  function addTask(event) {
    event.preventDefault();

    if (taskName.trim() === '') {
      return;
    }

    const newTask = {
      id: Date.now(),
      name: taskName,
      completed: false,
    };

    setTasks([...tasks, newTask]);
    setTaskName('');
  }

  function toggleTask(id) {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  }

  function deleteTask(id) {
    setTasks(tasks.filter((task) => task.id !== id));
  }
    return (
    <main className="app">
      <h1>My Tasks Tracker</h1>
      <form onSubmit={addTask}>
        <input
          type="text"
          placeholder="Enter a task..."
          value={taskName}
          onChange={(event) => setTaskName(event.target.value)}
        />
        <button type="submit">Add Task</button>
      </form>

      <h2>My Tasks ({tasks.length})</h2>

      {tasks.length === 0 ? (
        <p>No tasks yet. Add your first task!</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>
              <label>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                />
                <span className={task.completed ? 'completed' : ''}>
                  {task.name}
                </span>
              </label>

              <button
                type="button"
                onClick={() => deleteTask(task.id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

export default Tasks;