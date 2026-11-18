
import useRenderTracker from "../hooks/useRenderTracker";
import { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext";
import "./TaskPage.css";

const API_URL = `${import.meta.env.VITE_API_URL}/tasks`;
const LIMIT = 5;

function TaskPage({ onOpenNotes, onOpenProfile }) {
  useRenderTracker("TaskPage", { onOpenNotes, onOpenProfile });

  const { handleLogout, userName } = useAuth();

  const [title, setTitle] = useState("");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("title");
  const [selectedIds, setSelectedIds] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);

  // FETCH TASKS
  useEffect(() => {
    async function fetchTasks() {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        const response = await fetch(
          `${API_URL}?page=${currentPage}&limit=${LIMIT}&status=${statusFilter}&sortBy=${sortBy}`,          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

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

        setPagination(data.pagination);
        setSelectedIds([]);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchTasks();
}, [currentPage, statusFilter, sortBy, refreshKey]);

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

      setTitle("");
      setCurrentPage(1);
      setRefreshKey((previous) => previous + 1);
    } catch (error) {
      setError(error.message);
    }
  }

  // UPDATE TASK STATUS
  async function updateTaskStatus(id, newStatus) {
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
          status: newStatus,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update task");
      }

      // Refresh because the task may no longer match the selected filter
      setRefreshKey((previous) => previous + 1);
    } catch (error) {
      setError(error.message);
    }
  }

  // SELECT / UNSELECT ONE TASK
  function toggleTaskSelection(id) {
    setSelectedIds((previous) =>
      previous.includes(id)
        ? previous.filter((selectedId) => selectedId !== id)
        : [...previous, id]
    );
  }

  // SELECT / UNSELECT ALL TASKS ON CURRENT PAGE
  function toggleSelectAll() {
    const allSelected = tasks.every((task) =>
      selectedIds.includes(task._id)
    );

    if (allSelected) {
      setSelectedIds((previous) =>
        previous.filter(
          (id) => !tasks.some((task) => task._id === id)
        )
      );
    } else {
      setSelectedIds((previous) => [
        ...new Set([
          ...previous,
          ...tasks.map((task) => task._id),
        ]),
      ]);
    }
  }

  // BULK DELETE SELECTED TASKS
  async function deleteSelectedTasks() {
    if (selectedIds.length === 0) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete ${selectedIds.length} selected task(s)?`
    );

    if (!confirmed) return;

    try {
      setError("");
      setIsDeleting(true);

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/bulk/soft-delete`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ids: selectedIds,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete selected tasks");
      }

      // Calculate the new page after deletion
      const newTotalTasks = Math.max(
        0,
        (pagination?.totalTasks || 0) - data.deletedCount
      );

      const newTotalPages = Math.ceil(newTotalTasks / LIMIT);

      setSelectedIds([]);

      setCurrentPage((previousPage) =>
        Math.min(previousPage, Math.max(1, newTotalPages))
      );

      setRefreshKey((previous) => previous + 1);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsDeleting(false);
    }
  }

  const allTasksSelected =
    tasks.length > 0 &&
    tasks.every((task) => selectedIds.includes(task._id));

  return (
    <main className="task-page">
      {/* HEADER */}
      <header className="task-header">
        <div>
          <h1>TaskFlow</h1>
          <p>Organize your work, one task at a time.</p>
          <p>Welcome, {userName || "Guest"}!</p>
        </div>

        <div className="header-buttons">
          <button
            className="logout-button"
            type="button"
            onClick={handleLogout}
          >
            Logout
          </button>

          <button
            className="profile-button"
            type="button"
            onClick={onOpenProfile}
          >
            Profile
          </button>
        </div>
      </header>

      {/* NOTES BUTTON */}
      <button
        className="Notes-button"
        type="button"
        onClick={onOpenNotes}
      >
        Notes
      </button>

      {/* ADD TASK FORM */}
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

      {/* TASK TABLE SECTION */}
      <section className="task-table-section">
        <div className="table-controls">
          <div>
            <label htmlFor="status-filter">Filter by status: </label>

            <select
              id="status-filter"
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(event.target.value);
                setCurrentPage(1);
                setSelectedIds([]);
              }}
            >
              <option value="all">All</option>
              <option value="todo">To Do</option>
              <option value="done">Done</option>
            </select>
          </div>

          <div>
            <label htmlFor="sort-filter">Sort by: </label>

            <select
              id="sort-filter"
              value={sortBy}
              onChange={(event) => {
                setSortBy(event.target.value);
                setCurrentPage(1);
                setSelectedIds([]);
              }}
            >
              <option value="title">Title (A–Z)</option>
              <option value ="title-desc">Title descending</option>
              <option value="createdAt">
                Created date (Earliest to newest)
              </option>
              <option value="createdAt(latest first)">
                Created date (Latest to earliest)
              </option>
            </select>
          </div>
          <button
            type="button"
            className="delete-selected-button"
            onClick={deleteSelectedTasks}
            disabled={selectedIds.length === 0 || isDeleting}
          >
            {isDeleting
              ? "Deleting..."
              : `Delete Selected (${selectedIds.length})`}
          </button>
        </div>

        {loading ? (
          <p>Loading tasks...</p>
        ) : (
          <>
            <div className="table-wrapper">
              <table className="task-table">
                <thead>
                  <tr>
                    <th>
                      <input
                        type="checkbox"
                        checked={allTasksSelected}
                        onChange={toggleSelectAll}
                        aria-label="Select all tasks on this page"
                      />
                    </th>

                    <th>TITLE</th>
                    <th>CREATEDAT</th>
                    <th>STATUS</th>
                  </tr>
                </thead>

                <tbody>
                  {tasks.map((task) => (
                    <tr key={task._id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(task._id)}
                          onChange={() =>
                            toggleTaskSelection(task._id)
                          }
                          aria-label={`Select ${task.title}`}
                        />
                      </td>

                      <td>{task.title}</td>

                      <td>
                        {task.createdAt
                          ? new Date(task.createdAt).toLocaleString()
                          : "N/A"}
                      </td>

                      <td>
                        {task.status === "done" ? (
                          <span className="status-complete">Complete</span>
                        ) : (
                          <select
                            className="task-status-select"
                            value={task.status}
                            onChange={(event) =>
                              updateTaskStatus(task._id, event.target.value)
                            }
                            aria-label={`Change status for ${task.title}`}
                          >
                            <option value="todo">To Do</option>
                            <option value="done">Done</option>
                          </select>
                        )}
                      </td>
                    </tr>
                  ))}

                  {tasks.length === 0 && (
                    <tr>
                      <td colSpan="4" className="empty-table">
                        No tasks found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}
            {pagination && pagination.totalTasks > 0 && (
              <div className="pagination">
                <button
                  type="button"
                  disabled={!pagination.hasPreviousPage}
                  onClick={() => {
                    setCurrentPage((page) => page - 1);
                    setSelectedIds([]);
                  }}
                >
                  Previous
                </button>

                <span>
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>

                <button
                  type="button"
                  disabled={!pagination.hasNextPage}
                  onClick={() => {
                    setCurrentPage((page) => page + 1);
                    setSelectedIds([]);
                  }}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}

export default TaskPage;
