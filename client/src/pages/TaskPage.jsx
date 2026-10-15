import { useState } from "react";
import "./TaskPage.css";

function TaskPage() {
  const [title, setTitle] = useState("");
  const [tasks, setTasks] = useState([]);

  function logout(event) {
    window.location.reload();
    return <App />;
  }
  
  function addTask(event) {
    event.preventDefault();

    if (!title.trim()) return;

    const newTask = {
      id: Date.now(),
      title: title.trim(),
      status: "todo",
    };

    setTasks([...tasks, newTask]);
    setTitle("");
  }

  function markAsDone(id) {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? { ...task, status: "done" }
          : task
      )
    );
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
        </div>

        <button className="logout-button" type="button" onClick={logout}>
          Logout
        </button>
      </header>

      <form className="task-form" onSubmit={addTask}>
        <input
          type="text"
          placeholder="What needs to be done?"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />

        <button type="submit" className="submit-button">
          Add Task
        </button>
      </form>

      <section className="board">
        <div className="task-column">
          <h2>To Do ({todoTasks.length})</h2>

          {todoTasks.map((task) => (
            <div className="task-card" key={task.id}>
              <span>{task.title}</span>

              <button
                type="button"
                onClick={() => markAsDone(task.id)}
              >
                Done
              </button>
            </div>
          ))}

          {todoTasks.length === 0 && (
            <p>No pending tasks.</p>
          )}
        </div>

        <div className="task-column">
          <h2>Done ({doneTasks.length})</h2>

          {doneTasks.map((task) => (
            <div className="task-card" key={task.id}>
              <span>{task.title}</span>
              <span className="completed-label">Completed ✓</span>
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