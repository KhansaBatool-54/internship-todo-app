import { useEffect, useState } from "react";
import "./NotesPage.css";

function NotesPage({ onBack }) {
  const [count, setCount] = useState(0);

  console.count("NotesPage rendered");

  function handleIncrease() {
    setCount((previousCount) => previousCount + 1);
  }

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchNotes() {
      try {
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/posts"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch notes");
        }

        const data = await response.json();
        setNotes(data.slice(0, 10));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchNotes();
  }, []);

  return (
    <main className="notes-page">
      <div className="notes-container">
        <header className="notes-header">
          <div>
            <h1>Notes API Lab</h1>
            <p>Explore notes fetched from a public API.</p>
          </div>

          <button className="back-button" onClick={onBack} type="button">
            Back to Tasks
          </button>
        </header>

        <div style={{ marginBottom: "20px" }}>
          <button onClick={handleIncrease} className="back-button">
            Count: {count}
          </button>
        </div>

        {loading && <p className="notes-status">Loading notes...</p>}

        {error && <p className="notes-status notes-error">Error: {error}</p>}

        {!loading && !error && (
          <>
            <ul className="notes-list">
              {notes.map((note) => (
                <li className="note-card" key={note.id}>
                  <h3>{note.title}</h3>
                  <p>{note.body}</p>
                </li>
              ))}
            </ul>

            <p className="notes-footer">
              Showing {notes.length} notes from the API
            </p>
          </>
        )}
      </div>
    </main>
  );
}

export default NotesPage;