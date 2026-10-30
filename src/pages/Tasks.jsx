import { useState, useEffect } from 'react';
import '../App.css';


function Tasks() {
    const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
});
    const [taskName, setTaskName] = useState('');
    const [error, setError] = useState('');
    const [editingTaskId, setEditingTaskId] = useState(null);
    useEffect(() => {
    fetch('http://localhost:5000/api/tasks')
        .then((response) => response.json())
        .then((data) => {
            setTasks(data);
        });
    }, []);
    
    useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}, [tasks]);


  function addTask(event) {
    event.preventDefault();
    setError('');

    if (taskName.trim() === '') {
      return;
    }
    const newTask = {
      id: Date.now(),
      name: taskName.trim(),
      completed: false,
    };
    fetch('http://localhost:5000/api/tasks', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(newTask),
})
    .then((response) => response.json())
    .then((savedTask) => {
        setTasks([...tasks, savedTask]);
        setTaskName('');
    })
    .catch ((error) => {
        console.error('Error adding task:', error);
        setError('Could not add task. Please try again.');
    });
  }
    async function updateTask(event) {
    event.preventDefault();

    if (taskName.trim() === '') {
      return;
    }

    const response = await fetch(`http://localhost:5000/api/tasks/${editingTaskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: taskName.trim()
      })
    });

    if (!response.ok) {
      console.error('Failed to update task name');
      return;
    }

    const updatedTask = await response.json();

    setTasks(
      tasks.map((task) =>
        task._id === editingTaskId ? updatedTask : task
      )
    );

    setEditingTaskId(null);
    setTaskName('');
  }
  
  async function toggleTask(id) {
    const response = await fetch(`http://localhost:5000/api/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        completed: !tasks.find((task) => task._id === id).completed
      })
    });
    if (!response.ok) {
      console.error('Failed to update task');
      return;
    }
    setTasks(
      tasks.map((task) =>
        task._id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  }

  async function deleteTask(id) {
    const response = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: 'DELETE'
    });

    if (!response.ok) {
        console.error('Failed to delete task');
        return;
    }

    setTasks(tasks.filter((task) => task._id !== id));
}
  function editTask(id) {
  const taskToEdit = tasks.find((task) => task._id === id);
    setTaskName(taskToEdit.name);
  }
  function cancelEdit(){
    setEditingTaskId(null);
    setTaskName('');
  }
    return (
    <main className="app">
      <h1>My Tasks Tracker</h1>
      <form onSubmit={editingTaskId !== null ? updateTask : addTask}>
        <input type="text" placeholder="Enter a task..." value={taskName} onChange={(event) => setTaskName(event.target.value)} />
        <button type="submit">
          {editingTaskId !== null ? 'Save Changes' : 'Add Task'}
        </button>
        {editingTaskId !== null && (
        <button type="button" onClick={cancelEdit}>
          Cancel Edit
        </button>
)}
      </form>
      {error && <p className="error-message">{error}</p>}

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
                  onChange={() => toggleTask(task._id)}
                />
                <span className={task.completed ? 'completed' : ''}>
                  {task.name}
                </span>
              </label>

              <button
                type="button"
                onClick={() => deleteTask(task._id)}
              >
                Delete
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditingTaskId(task._id);
                  editTask(task._id);
                }}
              >
                Edit
              </button>
              
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

export default Tasks;