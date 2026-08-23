// Projects & Resume Builder Component
// Lets students add and showcase their coding projects and manage resume contact info

import React, { useState } from "react";
import { StrictEmailInput, StrictNumberInput } from "./ValidationInputs";

export default function Resume({ currentUser, updateUser }) {
  // Input fields for adding a new project
  const [projName, setProjName] = useState("");
  const [projDesc, setProjDesc] = useState("");
  const [projTech, setProjTech] = useState("");
  
  // Contact info fields
  const [contactPhone, setContactPhone] = useState(currentUser?.profile?.phone || "");
  const [contactEmail, setContactEmail] = useState(currentUser?.profile?.email || currentUser?.email || "");
  
  // Temporary save success feedback flag
  const [savedSuccess, setSavedSuccess] = useState(false);

  const projects = currentUser?.projects || [];

  // Function to save a new project to state & localStorage
  const handleAddProject = (e) => {
    e.preventDefault();
    if (!projName.trim() || !projDesc.trim()) return;

    const newProject = {
      id: Date.now(),
      name: projName.trim(),
      description: projDesc.trim(),
      technologies: projTech.trim()
    };

    updateUser({
      ...currentUser,
      projects: [...(currentUser?.projects || []), newProject]
    });

    // Reset inputs
    setProjName("");
    setProjDesc("");
    setProjTech("");
    
    // Show success message
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <section>
      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
        <div className="badge-tag-purple">📁 PORTFOLIO & RESUME</div>
        <h1 style={{ fontSize: "28px", fontWeight: 800, color: "var(--text-main)", marginBottom: "6px" }}>
          Shipped Projects & Resume
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
          Manage your built projects and configure contact details for placement applications.
        </p>
      </div>

      {/* 2-Column form section: Add Project & Contact Details */}
      <div className="dashboard-bottom-grid" style={{ marginBottom: "32px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        {/* Add Project Form */}
        <div className="dashboard-panel-card">
          <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "16px" }}>+ Add Shipped Project</h3>
          <form onSubmit={handleAddProject} className="custom-form">
            <div className="form-field-group">
              <label>Project Title *</label>
              <input
                required
                className="custom-input"
                value={projName}
                onChange={(e) => setProjName(e.target.value)}
                placeholder="e.g. NextOffer Placement Platform"
              />
            </div>
            <div className="form-field-group">
              <label>Impact & Description *</label>
              <textarea
                required
                className="custom-textarea"
                rows={3}
                value={projDesc}
                onChange={(e) => setProjDesc(e.target.value)}
                placeholder="Developed a placement prep portal with DSA practice and resume generator..."
              />
            </div>
            <div className="form-field-group">
              <label>Technologies Used</label>
              <input
                className="custom-input"
                value={projTech}
                onChange={(e) => setProjTech(e.target.value)}
                placeholder="e.g. React, JavaScript, CSS Grid, Vite"
              />
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <button type="submit" className="btn-primary-gradient">
                Save Project
              </button>
              {savedSuccess && (
                <span style={{ color: "#34d399", fontWeight: 700, fontSize: "13px", marginLeft: "12px" }}>
                  ✓ Project added to portfolio!
                </span>
              )}
            </div>
          </form>
        </div>

        {/* Contact Info Settings */}
        <div className="dashboard-panel-card">
          <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "16px" }}>Resume Contact Details</h3>
          <div className="custom-form">
            <div className="form-field-group">
              <label>
                <span>Contact Email</span>
                <span className="field-constraint-tag">Valid email only</span>
              </label>
              <StrictEmailInput
                value={contactEmail}
                onChange={setContactEmail}
              />
            </div>
            <div className="form-field-group">
              <label>
                <span>Contact Phone</span>
                <span className="field-constraint-tag">Numbers only</span>
              </label>
              <StrictNumberInput
                value={contactPhone}
                onChange={setContactPhone}
                maxLength={12}
              />
            </div>
            <div style={{ marginTop: "12px", fontSize: "12.5px", color: "var(--text-muted)" }}>
              Contact information is displayed on your candidate profile and exported resumes.
            </div>
          </div>
        </div>
      </div>

      {/* Shipped Projects List Grid */}
      <div className="dashboard-panel-card">
        <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "16px" }}>
          Shipped Projects ({projects.length})
        </h3>
        {projects.length === 0 ? (
          <div style={{ padding: "24px 0", color: "var(--text-muted)", fontSize: "13.5px" }}>
            No projects added yet. Use the form above to add your first project!
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
            {projects.map((p) => (
              <div key={p.id} style={{ background: "var(--bg-surface-elevated)", padding: "16px", borderRadius: "10px", border: "1px solid var(--border-main)" }}>
                <h4 style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-main)", marginBottom: "4px" }}>{p.name}</h4>
                <p style={{ fontSize: "12.5px", color: "var(--text-muted)", marginBottom: "10px" }}>{p.description}</p>
                <span className="tag-pill">{p.technologies}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
