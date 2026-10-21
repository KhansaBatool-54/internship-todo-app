
import { useEffect, useState } from "react";
import "./NotesPage.css";

const API_URL = "https://jsonplaceholder.typicode.com/posts";
const STORAGE_KEY = "notesApiLabNotes";

function NotesPage({ onBack }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function fetchNotes() {
      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error("Could not fetch notes. Please try again.");
        }

        const data = await response.json();
        const savedNotes = localStorage.getItem(STORAGE_KEY);

        if (savedNotes !== null) {
          setNotes(JSON.parse(savedNotes));
        } else {
          setNotes(
            data.slice(0, 10).map((note) => ({
              id: `api-${note.id}`,
              title: note.title,
              body: note.body,
            }))
          );
        }
      } catch (err) {
        setError(err.message || "Something went wrong.");

        // Restore saved notes even if the API is unavailable.
        try {
          const savedNotes = localStorage.getItem(STORAGE_KEY);
          if (savedNotes !== null) {
            setNotes(JSON.parse(savedNotes));
            setError("");
          }
        } catch {
          setError("Could not load saved notes.");
        }
      } finally {
        setLoading(false);
        setLoaded(true);
      }
    }

    fetchNotes();
  }, []);

  // Save notes only after the initial load has finished.
  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    }
  }, [notes, loaded]);

  function openAddForm() {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setOpenMenuId(null);
    setIsFormOpen(true);
  }

  function openEditForm(note) {
    setEditingId(note.id);
    setTitle(note.title);
    setDescription(note.body);
    setOpenMenuId(null);
    setIsFormOpen(true);
  }

  function handleSave(event) {
    event.preventDefault();

    const cleanTitle = title.trim();
    const cleanDescription = description.trim();

    if (!cleanTitle || !cleanDescription) {
      return;
    }

    if (editingId !== null) {
      setNotes((currentNotes) =>
        currentNotes.map((note) =>
          note.id === editingId
            ? { ...note, title: cleanTitle, body: cleanDescription }
            : note
        )
      );
    } else {
      const newNote = {
        id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        title: cleanTitle,
        body: cleanDescription,
      };

      setNotes((currentNotes) => [newNote, ...currentNotes]);
    }

    setIsFormOpen(false);
    setEditingId(null);
    setTitle("");
    setDescription("");
  }

  function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this note?"
    );

    if (!confirmed) return;

    setNotes((currentNotes) =>
      currentNotes.filter((note) => note.id !== id)
    );

    setOpenMenuId(null);
  }

  return (
    <main className="notes-page">
      <div className="notes-container">
        <header className="notes-header">
          <div>
            <h1>Notes API Lab</h1>
            <p>Keep your thoughts organized in one place.</p>
          </div>

          <button
            className="notes-back-button"
            type="button"
            onClick={onBack}
          >
            Back to Tasks
          </button>
        </header>

        <div className="notes-toolbar">
          <div>
            <h2>My Notes</h2>
            <p>{notes.length} {notes.length === 1 ? "note" : "notes"}</p>
          </div>

          <button
            className="notes-add-button"
            type="button"
            onClick={openAddForm}
          >
            + Add Note
          </button>
        </div>

        {isFormOpen && (
          <section className="notes-form-card">
            <h2>{editingId !== null ? "Edit Note" : "Create a Note"}</h2>

            <form onSubmit={handleSave}>
              <label htmlFor="note-title">Title</label>
              <input
                id="note-title"
                type="text"
                placeholder="Enter note title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                maxLength={120}
                required
                autoFocus
              />

              <label htmlFor="note-description">Description</label>
              <textarea
                id="note-description"
                placeholder="Write your note here..."
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={4}
                maxLength={2000}
                required
              />

              <div className="notes-form-actions">
                <button className="notes-save-button" type="submit">
                  {editingId !== null ? "Save Changes" : "Save Note"}
                </button>

                <button
                  className="notes-cancel-button"
                  type="button"
                  onClick={() => {
                    setIsFormOpen(false);
                    setEditingId(null);
                    setTitle("");
                    setDescription("");
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>
        )}

        {loading && <p className="notes-message">Loading notes...</p>}

        {error && (
          <div className="notes-error">
            <p>{error}</p>
            <button type="button" onClick={() => window.location.reload()}>
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && notes.length === 0 && (
          <div className="notes-empty">
            <h3>No notes yet</h3>
            <p>Create your first note using the Add Note button.</p>
          </div>
        )}

        {!loading && !error && notes.length > 0 && (
          <section className="notes-list">
            {notes.map((note) => (
              <article className="note-card" key={note.id}>
                <div className="note-card-header">
                  <h3>{note.title}</h3>

                  <div className="note-menu-wrapper">
                    <button
                      className="note-menu-button"
                      type="button"
                      aria-label={`Options for ${note.title}`}
                      aria-expanded={openMenuId === note.id}
                      onClick={() =>
                        setOpenMenuId((current) =>
                          current === note.id ? null : note.id
                        )
                      }
                    >
                      ⋮
                    </button>

                    {openMenuId === note.id && (
                      <div className="note-menu">
                        <button
                          type="button"
                          onClick={() => openEditForm(note)}
                        >
                          Edit
                        </button>

                        <button
                          className="note-delete-option"
                          type="button"
                          onClick={() => handleDelete(note.id)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <p className="note-description">{note.body}</p>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}

export default NotesPage;
