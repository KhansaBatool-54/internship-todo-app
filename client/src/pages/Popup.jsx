
import { useEffect, useRef } from "react";
import "./Popup.css";

function Popup({ onSave, onClose }) {
  const nameRef = useRef(null);

  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  function handleSubmit(event) {
    event.preventDefault();

    const name = nameRef.current?.value.trim() || "";

    if (!name) {
      nameRef.current?.focus();
      return;
    }

    onSave(name);
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <section
        className="username-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="username-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="username-modal-title">
          Welcome to TaskFlow!
        </h2>

        <p>What should we call you?</p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="modal-username">
            Your username
          </label>

          <input
            ref={nameRef}
            id="modal-username"
            type="text"
            placeholder="Enter your username"
            autoComplete="off"
            required
          />

          <div className="modal-actions">
            <button type="submit">Save</button>

            <button type="button" onClick={onClose}>
              Close
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default Popup;
