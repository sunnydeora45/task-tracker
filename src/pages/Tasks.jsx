import { useState, useEffect } from "react";
import "../App.css";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState("");
  const [error, setError] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const token = localStorage.getItem("token");
  useEffect(() => {
    fetch("http://localhost:5000/api/tasks", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch tasks");
        }
        return response.json();
      })
      .then((data) => {
        setTasks(data);
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
        setError("Could not load tasks. Please try again.");
      });
  }, []);

  async function addTask(event) {
    event.preventDefault();
    setError("");

    if (taskName.trim() === "") {
      return;
    }
    const newTask = {
      name: taskName.trim(),
      completed: false,
    };

    try {
      const response = await fetch("http://localhost:5000/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newTask),
      });

      if (!response.ok) {
        throw new Error("Failed to add task");
      }

      const savedTask = await response.json();

      setTasks([...tasks, savedTask]);
      setTaskName("");
    } catch (error) {
      console.error("Error adding task:", error);
      setError("Could not add task. Please try again.");
    }
  }

  async function updateTask(event) {
    event.preventDefault();

    if (taskName.trim() === "") {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/tasks/${editingTaskId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: taskName.trim(),
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update task name");
      }

      const updatedTask = await response.json();

      setTasks(
        tasks.map((task) => (task._id === editingTaskId ? updatedTask : task)),
      );

      setEditingTaskId(null);
      setTaskName("");
    } catch (error) {
      console.error("Error updating task:", error);
      setError("Could not update task. Please try again.");
    }
  }

  async function toggleTask(id) {
    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          completed: !tasks.find((task) => task._id === id).completed,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      setTasks(
        tasks.map((task) =>
          task._id === id ? { ...task, completed: !task.completed } : task,
        ),
      );
    } catch (error) {
      console.error("Error updating task:", error);
      setError("Could not update task status. Please try again.");
    }
  }

  async function deleteTask(id) {
    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      setTasks(tasks.filter((task) => task._id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
      setError("Could not delete task. Please try again.");
    }
  }
  function editTask(id) {
    const taskToEdit = tasks.find((task) => task._id === id);
    setTaskName(taskToEdit.name);
  }
  function cancelEdit() {
    setEditingTaskId(null);
    setTaskName("");
  }
  return (
    <main className="app">
      <h1>My Tasks Tracker</h1>
      <form onSubmit={editingTaskId !== null ? updateTask : addTask}>
        <input
          type="text"
          placeholder="Enter a task..."
          value={taskName}
          onChange={(event) => setTaskName(event.target.value)}
        />
        <button type="submit">
          {editingTaskId !== null ? "Save Changes" : "Add Task"}
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
            <li key={task._id}>
              <label>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task._id)}
                />
                <span className={task.completed ? "completed" : ""}>
                  {task.name}
                </span>
              </label>

              <button type="button" onClick={() => deleteTask(task._id)}>
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
