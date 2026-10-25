// Submissions Log Component
// Displays student's saved code submissions and allows viewing the submitted code

import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { getSubmissions, deleteSubmission, clearSubmissions } from "./submissionUtils";
import "./styles/Submissions.css";

export default function Submissions({ currentUser }) {
  // Topic filter
  const [filter, setFilter] = useState("All");
  // Selected submission to inspect in modal dialog
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [mockSubmissions, setMockSubmissions] = useState([]);
  const [selectedMock, setSelectedMock] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    setMockSubmissions(getSubmissions());
  }, []);

  const storedSubmissions = useMemo(() => {
    return mockSubmissions.filter((item) => item.source !== "Mock Interview" && !Array.isArray(item.questions));
  }, [mockSubmissions]);

  const allSubmissions = useMemo(() => {
    const fromUser = currentUser?.submissions || [];
    const ids = new Set(fromUser.map((s) => s.id));
    const merged = [...fromUser];
    for (const item of storedSubmissions) {
      if (item.id && !ids.has(item.id)) {
        merged.push(item);
        ids.add(item.id);
      }
    }
    return merged;
  }, [currentUser?.submissions, storedSubmissions]);

  const mockAttempts = mockSubmissions.filter((item) => item.source === "Mock Interview" && Array.isArray(item.questions));

  // Dynamic topics from actual submissions
  const topicCategories = useMemo(() => {
    const cats = new Set(["All", "Arrays", "Strings", "JavaScript", "React"]);
    for (const sub of allSubmissions) {
      if (sub.topicTitle) cats.add(sub.topicTitle);
    }
    return Array.from(cats);
  }, [allSubmissions]);

  // Filter submissions by topic
  const filtered = useMemo(() => {
    if (filter === "All") return allSubmissions;
    return allSubmissions.filter((s) => s.topicTitle?.toLowerCase().includes(filter.toLowerCase()));
  }, [allSubmissions, filter]);

  return (
    <section>
      <div style={{ marginBottom: "24px" }}>
        <div className="badge-tag-purple">≡ƒô¥ SUBMISSIONS & INTERVIEW HISTORY</div>
        <h1 style={{ fontSize: "28px", fontWeight: 800, color: "var(--text-main)", marginBottom: "6px" }}>
          Practice Library & Mock Interview Submissions
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
          Review your saved coding solutions and completed mock interview attempts in one place.
        </p>
      </div>

      {selectedMock && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Mock interview review">
          <div className="modal-dialog-card wide">
            <div className="modal-header-row"><div><span className="badge-tag-purple">{selectedMock.category || "Mock Interview"}</span><h3>Interview answer review</h3></div><button className="close-modal-btn" onClick={() => setSelectedMock(null)} aria-label="Close">Γ£ò</button></div>
            <p style={{ color: "var(--text-muted)", marginBottom: 16 }}>Completed: {selectedMock.date || selectedMock.completedAt || "ΓÇö"} ┬╖ Time: {(typeof selectedMock.durationSeconds === "number" ? `${Math.floor(selectedMock.durationSeconds / 60)}m ${selectedMock.durationSeconds % 60}s` : selectedMock.duration || selectedMock.timeTaken || "ΓÇö")}</p>
            {(selectedMock.questions || []).map((q, index) => (
              <div className="mock-answer-review" key={q.id || q.questionId || index}>
                <h4>{index + 1}. {q.question || q.questionTitle || "Interview question"}</h4>
                <p><strong>Your answer:</strong> {q.userAnswer || "Not answered"}</p>
                <p><strong>Suggested answer:</strong> {q.suggestedAnswer || q.answer || "No suggested answer saved."}</p>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}><button className="btn-primary-gradient" onClick={() => setSelectedMock(null)}>Close review</button></div>
          </div>
        </div>
      )}
      {showClearConfirm && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Clear interview history">
          <div className="modal-dialog-card"><h3>Clear mock interview history?</h3><p>This removes saved mock interview attempts from this browser.</p><div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 18 }}><button className="view-code-btn" onClick={() => setShowClearConfirm(false)}>Cancel</button><button className="submission-clear-button" onClick={() => { clearSubmissions(); setMockSubmissions([]); setShowClearConfirm(false); }}>Clear history</button></div></div>
        </div>
      )}

      {/* Topic filter pills */}
      <div className="topic-filters-bar">
        {topicCategories.map((cat) => (
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
              Browse Practice Library ΓåÆ
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
                    {sub.submittedAt && !Number.isNaN(Date.parse(sub.submittedAt))
                      ? new Date(sub.submittedAt).toLocaleString([], { dateStyle: "short", timeStyle: "short" })
                      : (sub.submittedAt || "ΓÇö")}
                  </td>
                  <td>
                    <span className={sub.status === "Executed successfully" ? "status-badge-accepted" : "tag-pill"} title={sub.executionMode || "Saved submission record"}>
                      {sub.status || "Recorded"}
                    </span>
                    {sub.score && (
                      <span className="tag-pill" style={{ marginLeft: 6, color: "var(--cyan)", borderColor: "rgba(6, 182, 212, 0.3)" }}>
                        {sub.score}
                      </span>
                    )}
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

      {/* Mock Interview attempts (localStorage) */}
      <div className="mock-submissions-section" style={{ marginBottom: "28px" }}>
        <div className="submissions-section-heading">
          <div>
            <h2>Mock Interview Attempts</h2>
            <p>Review each completed interview and the answers you submitted.</p>
          </div>
          {mockAttempts.length > 0 && <button type="button" className="submission-clear-button" onClick={() => setShowClearConfirm(true)}>Clear interview history</button>}
        </div>
        {mockAttempts.length === 0 ? (
          <div className="mock-submission-empty">No mock interview attempts yet. Complete a mock interview to see it here.</div>
        ) : (
          <div className="mock-attempt-grid">
            {mockAttempts.map((attempt) => (
              <article className="mock-attempt-card" key={attempt.id}>
                <div className="mock-attempt-card-top"><span className="mock-attempt-tag">Mock Interview</span><span>{attempt.date || attempt.completedAt || "Completed"}</span></div>
                <h3>{attempt.category || "Mixed Interview"}</h3>
                <div className="mock-attempt-stats"><span>{Array.isArray(attempt.questions) ? attempt.questions.length : 0} questions</span><span>{attempt.answeredCount ?? attempt.questions.filter((q) => q.userAnswer?.trim()).length} answered</span><span>{(typeof attempt.durationSeconds === "number" ? `${Math.floor(attempt.durationSeconds / 60)}m ${attempt.durationSeconds % 60}s` : attempt.duration || attempt.timeTaken || "ΓÇö")}</span></div>
                <button type="button" className="view-code-btn" onClick={() => setSelectedMock(attempt)}>Review answers</button>
                <button type="button" className="mock-attempt-delete" onClick={() => { const updated = deleteSubmission(attempt.id); setMockSubmissions(updated); if (selectedMock?.id === attempt.id) setSelectedMock(null); }}>Delete</button>
              </article>
            ))}
          </div>
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
                Γ£ò
              </button>
            </div>

            <div style={{ marginBottom: "16px", fontSize: "13px", color: "var(--text-muted)" }}>
              Submitted on <strong>{selectedSubmission.submittedAt && !Number.isNaN(Date.parse(selectedSubmission.submittedAt)) ? new Date(selectedSubmission.submittedAt).toLocaleString() : (selectedSubmission.submittedAt || "ΓÇö")}</strong> ΓÇó Language: <strong>{selectedSubmission.language || "JavaScript"}</strong>
              {selectedSubmission.problemUrl && (
                <span style={{ marginLeft: 12 }}>
                  ΓÇó <a href={selectedSubmission.problemUrl} target="_blank" rel="noreferrer" style={{ color: "var(--cyan)", textDecoration: "underline" }}>View Original Problem Γåù</a>
                </span>
              )}
            </div>
            {selectedSubmission.sampleTest && <div style={{ padding: "12px", marginBottom: "12px", borderRadius: "8px", border: "1px solid var(--border-main)", fontSize: "13px" }}><strong>Sample test case</strong><p style={{ marginTop: "6px", color: "var(--text-muted)" }}>{selectedSubmission.sampleTest}</p></div>}
            {selectedSubmission.userSampleInput && <div style={{ padding: "12px", marginBottom: "12px", borderRadius: "8px", border: "1px solid var(--border-main)", fontSize: "13px" }}><strong>Program input</strong><pre style={{ whiteSpace: "pre-wrap", marginTop: "6px", color: "var(--text-muted)" }}>{selectedSubmission.userSampleInput}</pre></div>}
            {selectedSubmission.output !== undefined && <div style={{ padding: "12px", marginBottom: "12px", borderRadius: "8px", border: "1px solid var(--border-main)", fontSize: "13px" }}><strong>Execution output</strong><pre style={{ whiteSpace: "pre-wrap", overflowX: "auto", marginTop: "6px", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{selectedSubmission.output || "No output captured."}</pre>{selectedSubmission.exitCode !== undefined && <small style={{ color: "var(--text-muted)" }}>Exit code: {selectedSubmission.exitCode}</small>}</div>}
            <div style={{ padding: "10px 12px", marginBottom: "14px", borderRadius: "8px", background: "var(--bg-app)", color: "var(--text-muted)", fontSize: "12px" }}>{selectedSubmission.executionMode || "Execution details unavailable for this older submission."}</div>

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
