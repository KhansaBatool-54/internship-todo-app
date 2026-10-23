import { useEffect, useState, useRef } from "react";
import { useAuth } from "../Context/AuthContext";
import "./NotesPage.css";

const API_URL = "https://jsonplaceholder.typicode.com/posts";

function NotesPage({ onBack }) {
  // Get userEmail dynamically from Auth Context
  const { userEmail } = useAuth();
  
  // Create a unique storage key for each user based on their email
  const STORAGE_KEY = `notesApiLabNotes_${userEmail || "guest"}`;

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [loaded, setLoaded] = useState(false);
  
  const renderCount = useRef(0);
  console.log(`Render #${++renderCount.current} triggered for user: ${userEmail}`);

  // Fetch initial notes specific to this user's email storage
  useEffect(() => {
    async function fetchNotes() {
      try {
        const savedNotes = localStorage.getItem(STORAGE_KEY);

        // If this specific user already has notes saved locally, load them
        if (savedNotes !== null) {
          setNotes(JSON.parse(savedNotes));
        } else {
          // Otherwise, fetch fresh dummy notes from API for a new user
          const response = await fetch(API_URL);
          if (!response.ok) {
            throw new Error("Could not fetch notes. Please try again.");
          }
          const data = await response.json();
          
          const initialNotes = data.slice(0, 9).map((note) => ({
            id: note.id,
            title: note.title,
            body: note.body,
          }));

          setNotes(initialNotes);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(initialNotes));
        }
      } catch (err) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
        setLoaded(true);
      }
    }
    fetchNotes();
  }, [STORAGE_KEY]);

  // Save notes to user-specific LocalStorage whenever notes change
  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    }
  }, [notes, loaded, STORAGE_KEY]);

  // Open form to add a new note
  function openAddForm() {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setOpenMenuId(null);
    setIsFormOpen(true);
  }

  // Open form to edit an existing note
  function openEditForm(note) {
    setEditingId(note.id);
    setTitle(note.title);
    setDescription(note.body);
    setOpenMenuId(null);
    setIsFormOpen(true);
  }

  // Handle saving (Create or Update note using PATCH)
  async function handleSave(event) {
    event.preventDefault();

    const cleanTitle = title.trim();
    const cleanDescription = description.trim();

    if (!cleanTitle || !cleanDescription) return;

    const isEditing = editingId !== null;

    const noteData = {
      title: cleanTitle,
      body: cleanDescription,
    };

    try {
      let savedNote;

      if (isEditing) {
        const existingNote = notes.find((note) => note.id === editingId);
        const isLocalNote = String(editingId).startsWith("local-");

        if (!isLocalNote) {
          try {
            // Using PATCH method to update only modified fields on server
            const response = await fetch(`${API_URL}/${editingId}`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(noteData),
            });

            if (!response.ok) {
              console.warn("API returned error on PATCH, continuing locally.");
            }
          } catch (apiErr) {
            console.warn("Network error during PATCH, updating locally.", apiErr);
          }
        }

        // Update local state for both server and local notes
        savedNote = { ...existingNote, ...noteData };

        setNotes((currentNotes) =>
          currentNotes.map((note) =>
            note.id === editingId ? savedNote : note
          )
        );
      } else {
        // Send POST request to create a new note on the server
        const response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(noteData),
        });

        if (!response.ok) {
          throw new Error("Failed to create note.");
        }

        const data = await response.json();

        savedNote = {
          id: `local-${Date.now()}`,
          title: data.title,
          body: data.body,
        };

        setNotes((currentNotes) => [savedNote, ...currentNotes]);
      }

      setError("");
      setIsFormOpen(false);
      setEditingId(null);
      setTitle("");
      setDescription("");
    } catch (err) {
      setError(err.message || "Something went wrong.");
    }
  }

  // Handle deleting a note
  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this note?"
    );

    if (!confirmed) return;

    try {
      const isLocalNote = String(id).startsWith("local-");

      // Send DELETE request to API only if it's a server-backed record
      if (!isLocalNote) {
        try {
          const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
          });

          if (!response.ok) {
            console.warn("API returned error on delete, removing locally.");
          }
        } catch (apiErr) {
          console.warn("Network error during DELETE, removing locally.", apiErr);
        }
      }

      // Remove note from local state
      setNotes((currentNotes) =>
        currentNotes.filter((note) => note.id !== id)
      );

      setOpenMenuId(null);
      setError("");
    } catch (err) {
      setError(err.message || "Could not delete note.");
    }
  }

  return (
    <main className="notes-page">
      <div className="notes-container">
        <header className="notes-header">
          <div>
            <h1>Notes API Lab</h1>
            <p>Logged in as: <strong>{userEmail || "Guest"}</strong></p>
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
                          className="notes-delete-option"
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