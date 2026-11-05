
import useRenderTracker from "../hooks/useRenderTracker";
import { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext";
import "./TaskPage.css";

const API_URL = "http://localhost:5000/api/tasks";

function TaskPage({ onOpenNotes }) {
  useRenderTracker("TaskPage", { onOpenNotes });

  const { handleLogout, userName } = useAuth();

  const [title, setTitle] = useState("");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // FETCH TASKS
  useEffect(() => {
    async function fetchTasks() {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(API_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch tasks");
        }

        setTasks(
          data.tasks.map((task) => ({
            ...task,
            status: task.status || "todo",
          }))
        );
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchTasks();
  }, []);

  // ADD TASK
  async function addTask(event) {
    event.preventDefault();

    if (!title.trim()) return;

    try {
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          description: "",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create task");
      }

      setTasks((previousTasks) => [
        ...previousTasks,
        data.task,
      ]);

      setTitle("");
    } catch (error) {
      setError(error.message);
    }
  }

  // MARK TASK AS DONE
  async function markAsDone(id) {
    try {
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: "done",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update task");
      }

      setTasks((previousTasks) =>
        previousTasks.map((task) =>
          task._id === id ? data.task : task
        )
      );
    } catch (error) {
      setError(error.message);
    }
  }

  // DELETE TASK

async function deleteTask(id) {
  try {
    setError("");

    const token = localStorage.getItem("token");

    const response = await fetch(
      `${API_URL}/${id}/soft-delete`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to delete task");
    }

    setTasks((previousTasks) =>
      previousTasks.filter((task) => task._id !== id)
    );
  } catch (error) {
    setError(error.message);
  }
}


  const todoTasks = tasks.filter(
    (task) => task.status === "todo"
  );

  const doneTasks = tasks.filter(
    (task) => task.status === "done"
  );

  return (
    <main className="task-page">
      <header className="task-header">
        <div>
          <h1>TaskFlow</h1>
          <p>Organize your work, one task at a time.</p>
          <p>Welcome, {userName || "Guest"}!</p>
        </div>

        <button
          className="logout-button"
          type="button"
          onClick={handleLogout}
        >
          Logout
        </button>
      </header>

      <button
        className="Notes-button"
        type="button"
        onClick={onOpenNotes}
      >
        Notes
      </button>

      <form className="task-form" onSubmit={addTask}>
        <input
          type="text"
          placeholder="What needs to be done?"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
        />

        <button type="submit" className="submit-button">
          Add Task
        </button>
      </form>

      {error && <p className="error-message">{error}</p>}

      <section className="board">
        <div className="task-column">
          <h2>To Do ({todoTasks.length})</h2>

          {loading ? (
            <p>Loading tasks...</p>
          ) : (
            <>
              {todoTasks.map((task) => (
                <div className="task-card" key={task._id}>
                  <span>{task.title}</span>
                  <div className="task-buttons">
                  <button
                    type="button"
                    onClick={() => markAsDone(task._id)}
                  >
                    Done
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteTask(task._id)}
                  >
                    Delete
                  </button>
                  </div>
                </div>
              ))}

              {todoTasks.length === 0 && (
                <p>No pending tasks.</p>
              )}
            </>
          )}
        </div>

        <div className="task-column">
          <h2>Done ({doneTasks.length})</h2>

          {doneTasks.map((task) => (
            <div className="task-card" key={task._id}>
              <span>{task.title}</span>

              <span className="completed-label">
                Completed ✓
              </span>

              <button
                type="button"
                onClick={() => deleteTask(task._id)}
              >
                Delete
              </button>
            </div>
          ))}

          {doneTasks.length === 0 && (
            <p>No completed tasks yet.</p>
          )}
        </div>
      </section>
    </main>
  );
}

export default TaskPage;
