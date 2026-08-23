// Profile Page Component
// Displays student profile info, solved problems count, projects, skills, and modal to edit details

import React, { useState, useMemo } from "react";
import { isValidEmail, StrictEmailInput, StrictNumberInput } from "./ValidationInputs";

export default function Profile({ currentUser, updateUser }) {
  // Modal open / close state
  const [isEditOpen, setIsEditOpen] = useState(false);
  // Temporary toast popup message
  const [toastMessage, setToastMessage] = useState("");

  const profile = currentUser?.profile || {};

  // Form input states for editing profile
  const [editName, setEditName] = useState(profile.name || currentUser?.name || "");
  const [editEmail, setEditEmail] = useState(profile.email || currentUser?.email || "");
  const [editPhone, setEditPhone] = useState(profile.phone || "");
  const [editTitle, setEditTitle] = useState(profile.title || "Frontend & Full Stack Developer · Student Developer");
  const [editLocation, setEditLocation] = useState(profile.location || "India · Open to internships");
  const [editAbout, setEditAbout] = useState(profile.about || "");
  const [editSkills, setEditSkills] = useState((profile.skills || ["JavaScript", "React", "Python", "DSA", "HTML5", "CSS3"]).join(", "));
  const [formError, setFormError] = useState("");

  // Calculate initials for large avatar circle
  const userInitials = useMemo(() => {
    const name = profile.name || currentUser?.name || "SD";
    return name
      .split(" ")
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }, [profile.name, currentUser?.name]);

  // Copy profile link to clipboard
  const handleShareProfile = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setToastMessage("Profile URL copied to clipboard!");
      setTimeout(() => setToastMessage(""), 3000);
    }
  };

  // Save updated profile data to state and localStorage
  const handleSaveProfile = (e) => {
    e.preventDefault();
    setFormError("");

    if (!isValidEmail(editEmail)) {
      setFormError("Please enter a valid email address.");
      return;
    }

    if (editPhone && !/^\d+$/.test(editPhone)) {
      setFormError("Phone number must only contain digits (0-9).");
      return;
    }

    const updatedProfile = {
      ...profile,
      name: editName.trim(),
      email: editEmail.trim(),
      phone: editPhone.trim(),
      title: editTitle.trim(),
      location: editLocation.trim(),
      about: editAbout.trim(),
      skills: editSkills.split(",").map((s) => s.trim()).filter(Boolean)
    };

    updateUser({
      ...currentUser,
      name: editName.trim(),
      email: editEmail.trim(),
      profile: updatedProfile
    });

    setIsEditOpen(false);
    setToastMessage("Profile updated successfully!");
    setTimeout(() => setToastMessage(""), 3000);
  };

  return (
    <section>
      {/* Profile Hero Banner */}
      <div className="profile-hero-banner">
        <div className="profile-banner-top">
          <div className="profile-identity-group">
            <div className="profile-large-avatar">{userInitials}</div>
            <div className="profile-names-group">
              <h2>
                {profile.name || currentUser?.name || "Student Developer"}
                <span className="verified-badge" title="Verified Student">✓</span>
              </h2>
              <p className="role-title">{profile.title || "Student Developer"}</p>
              <p className="location-tag">📍 {profile.location || "India · Open to internships"}</p>
            </div>
          </div>

          <div className="profile-banner-actions">
            <button
              className="btn-secondary-dark"
              onClick={() => setIsEditOpen(true)}
            >
              Edit profile
            </button>
            <button
              className="btn-share-profile"
              onClick={handleShareProfile}
            >
              Share profile
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="profile-stats-row">
          <div className="profile-stat-item">
            <strong>{currentUser?.submissions?.length || profile.stats?.problems || 0}</strong>
            <span>Problems Solved</span>
          </div>
          <div className="profile-stat-item">
            <strong>{currentUser?.projects?.length || profile.stats?.projects || 0}</strong>
            <span>Projects</span>
          </div>
        </div>
      </div>

      {/* Details: About, Skills, Achievements */}
      <div className="profile-details-grid">
        <div className="dashboard-panel-card">
          <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "12px", color: "var(--text-main)" }}>
            About Me
          </h3>
          <p className="about-bio-text">
            {profile.about ||
              "Student developer interested in building web applications, practicing DSA problems, and preparing for placement drives."}
          </p>

          <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "12px", color: "var(--text-main)" }}>
            Technical Skills
          </h3>
          <div className="skills-pill-container">
            {(profile.skills || ["JavaScript", "React", "Python", "DSA", "HTML5", "CSS3"]).map((skill) => (
              <span className="skill-badge-pill" key={skill}>
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="dashboard-panel-card">
          <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "16px", color: "var(--text-main)" }}>
            Achievements
          </h3>
          <div
            style={{
              padding: "40px 20px",
              textAlign: "center",
              border: "1px dashed var(--border-main)",
              borderRadius: "var(--radius-md)",
              color: "var(--text-muted)"
            }}
          >
            <span style={{ fontSize: "24px", display: "block", marginBottom: "8px" }}>🏆</span>
            <p style={{ fontSize: "13px" }}>Complete daily challenges and practice questions to unlock badges.</p>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal Dialog */}
      {isEditOpen && (
        <div className="modal-backdrop">
          <div className="modal-dialog-card">
            <div className="modal-header-row">
              <h3>Edit Profile</h3>
              <button
                className="close-modal-btn"
                onClick={() => setIsEditOpen(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="custom-form">
              <div className="form-field-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  required
                  className="custom-input"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
              </div>

              <div className="form-field-group">
                <label>
                  <span>Email Address *</span>
                  <span className="field-constraint-tag">Valid email only</span>
                </label>
                <StrictEmailInput
                  required
                  value={editEmail}
                  onChange={setEditEmail}
                />
              </div>

              <div className="form-field-group">
                <label>
                  <span>Phone Number</span>
                  <span className="field-constraint-tag">Digits only</span>
                </label>
                <StrictNumberInput
                  value={editPhone}
                  onChange={setEditPhone}
                  placeholder="e.g. 9876543210"
                  maxLength={15}
                />
              </div>

              <div className="form-field-group">
                <label>Headline / Role</label>
                <input
                  type="text"
                  className="custom-input"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
              </div>

              <div className="form-field-group">
                <label>Location & Status</label>
                <input
                  type="text"
                  className="custom-input"
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                />
              </div>

              <div className="form-field-group">
                <label>About Me</label>
                <textarea
                  className="custom-textarea"
                  rows={3}
                  value={editAbout}
                  onChange={(e) => setEditAbout(e.target.value)}
                />
              </div>

              <div className="form-field-group">
                <label>Skills (comma separated)</label>
                <input
                  type="text"
                  className="custom-input"
                  value={editSkills}
                  onChange={(e) => setEditSkills(e.target.value)}
                />
              </div>

              {formError && (
                <div style={{ color: "#f87171", fontSize: "13px", fontWeight: 600 }}>
                  {formError}
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "12px" }}>
                <button
                  type="button"
                  className="btn-secondary-dark"
                  onClick={() => setIsEditOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary-gradient">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toastMessage && <div className="toast-popup">✓ {toastMessage}</div>}
    </section>
  );
}
