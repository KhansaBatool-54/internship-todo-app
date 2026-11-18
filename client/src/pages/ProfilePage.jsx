
import { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext";
import "./ProfilePage.css";

const API_URL = `${import.meta.env.VITE_API_URL}/auth/profile`;

function ProfilePage({ onBack }) {
  const { userName, userEmail, setUserName } = useAuth();

  const [profile, setProfile] = useState({
    name: userName,
    email: userEmail,
  });

  const [editedName, setEditedName] = useState(userName);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // FETCH PROFILE
  useEffect(() => {
    async function fetchProfile() {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(API_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch profile");
        }

        setProfile(data.user);
        setEditedName(data.user.name);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  // UPDATE PROFILE
  async function handleSave(event) {
    event.preventDefault();

    if (!editedName.trim()) {
      setError("Name cannot be empty");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const token = localStorage.getItem("token");

      const response = await fetch(API_URL, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editedName.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      setProfile(data.user);
      setUserName(data.user.name);
      setEditedName(data.user.name);

      setIsEditing(false);
      setSuccess("Profile updated successfully!");
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="profile-page">
      <header className="profile-header">
        <button
          className="back-button"
          type="button" onClick={onBack}>
          Back to Tasks
        </button>

        <h1>My Profile</h1>
      </header>

      <section className="profile-card">
        <div className="profile-avatar">
          <span>
            {profile.name?.charAt(0)?.toUpperCase() || "U"}
          </span>
        </div>

        <h2>{profile.name || "User"}</h2>
        <p>{profile.email}</p>

        <div className="profile-details">
          <h3>Profile Information</h3>

          {loading ? (
            <p>Loading profile...</p>
          ) : (
            <>
              {isEditing ? (
                <form onSubmit={handleSave}>
                  <div>
                    <strong>Name</strong>
                    <input
                      type="text"
                      value={editedName}
                      onChange={(event) =>
                        setEditedName(event.target.value)
                      }
                      required
                    />
                  </div>

                  <div>
                    <strong>Email</strong>
                    <p>{profile.email}</p>
                  </div>

                  <button type="submit" disabled={saving}>
                    {saving ? "Saving..." : "Save Changes"}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEditedName(profile.name);
                      setIsEditing(false);
                      setError("");
                    }}
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <>
                  <div>
                    <strong>Name</strong>
                    <p>{profile.name}</p>
                  </div>

                  <div>
                    <strong>Email</strong>
                    <p>{profile.email}</p>
                  </div>

                  <button
                    className="edit-profile-button"
                    type="button"
                    onClick={() => {
                      setEditedName(profile.name);
                      setIsEditing(true);
                      setError("");
                      setSuccess("");
                    }}
                  >
                    Edit Profile
                  </button>
                </>
              )}
            </>
          )}

          {error && <p className="error-message">{error}</p>}
          {success && <p>{success}</p>}
        </div>
      </section>
    </main>
  );
}

export default ProfilePage;
