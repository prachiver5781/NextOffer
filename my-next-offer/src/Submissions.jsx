// Submissions Log Component
// Displays student's saved code submissions and allows viewing the submitted code

import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";

export default function Submissions({ currentUser }) {
  // Topic filter
  const [filter, setFilter] = useState("All");
  // Selected submission to inspect in modal dialog
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  const submissions = currentUser?.submissions || [];

  // Filter submissions by topic
  const filtered = useMemo(() => {
    if (filter === "All") return submissions;
    return submissions.filter((s) => s.topicTitle?.toLowerCase().includes(filter.toLowerCase()));
  }, [submissions, filter]);

  return (
    <section>
      <div style={{ marginBottom: "24px" }}>
        <div className="badge-tag-purple">📝 SUBMITTED SOLUTIONS</div>
        <h1 style={{ fontSize: "28px", fontWeight: 800, color: "var(--text-main)", marginBottom: "6px" }}>
          Code Submissions & Solutions
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
          Review your recorded algorithms, timestamps, and accepted solutions.
        </p>
      </div>

      {/* Topic filter pills */}
      <div className="topic-filters-bar">
        {["All", "Arrays", "Strings", "JavaScript", "React"].map((cat) => (
          <button
            key={cat}
            className={`topic-category-pill ${filter === cat ? "active" : ""}`}
            onClick={() => setFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Submissions table */}
      <div className="submissions-table-card">
        {filtered.length === 0 ? (
          <div style={{ padding: "48px 24px", textAlign: "center", color: "var(--text-muted)" }}>
            <h3>No submissions found</h3>
            <p style={{ marginTop: "8px", fontSize: "13.5px" }}>
              Solve problems in the Practice Library to log your code solutions here.
            </p>
            <Link to="/topics" className="btn-primary-gradient" style={{ marginTop: "16px", display: "inline-flex" }}>
              Browse Practice Library →
            </Link>
          </div>
        ) : (
          <table className="submissions-table">
            <thead>
              <tr>
                <th>Problem</th>
                <th>Topic</th>
                <th>Language</th>
                <th>Submitted At</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.slice().reverse().map((sub) => (
                <tr key={sub.id}>
                  <td>
                    <strong>{sub.questionTitle}</strong>
                  </td>
                  <td>
                    <span className="tag-pill">{sub.topicTitle || "DSA"}</span>
                  </td>
                  <td>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "12.5px", color: "var(--cyan)" }}>
                      {sub.language || "javascript"}
                    </span>
                  </td>
                  <td style={{ color: "var(--text-muted)", fontSize: "13px" }}>
                    {sub.submittedAt}
                  </td>
                  <td>
                    <span className="status-badge-accepted">✓ {sub.status}</span>
                  </td>
                  <td>
                    <button
                      className="view-code-btn"
                      onClick={() => setSelectedSubmission(sub)}
                    >
                      View Code
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* View Code Modal Dialog */}
      {selectedSubmission && (
        <div className="modal-backdrop">
          <div className="modal-dialog-card wide">
            <div className="modal-header-row">
              <div>
                <span className="badge-tag-purple">{selectedSubmission.topicTitle}</span>
                <h3 style={{ marginTop: "4px" }}>{selectedSubmission.questionTitle}</h3>
              </div>
              <button
                className="close-modal-btn"
                onClick={() => setSelectedSubmission(null)}
              >
                ✕
              </button>
            </div>

            <div style={{ marginBottom: "16px", fontSize: "13px", color: "var(--text-muted)" }}>
              Submitted on <strong>{selectedSubmission.submittedAt}</strong> • Language: <strong>{selectedSubmission.language || "JavaScript"}</strong>
            </div>

            <div style={{ background: "#0a0e1a", padding: "16px", borderRadius: "10px", border: "1px solid var(--border-main)", overflowX: "auto" }}>
              <pre style={{ fontFamily: "var(--font-mono)", fontSize: "13px", color: "#c7d2fe", lineHeight: "1.6" }}>
                {selectedSubmission.code || "// No code captured"}
              </pre>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }}>
              <button
                className="btn-primary-gradient"
                onClick={() => setSelectedSubmission(null)}
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
