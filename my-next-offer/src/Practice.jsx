// Practice Page Component
// Lets students solve coding questions in a topic with code editor and submit solutions

import React, { useState } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import { topics } from "./data";
import { getTodayDateString } from "./hooks";

export default function Practice({ currentUser, updateUser }) {
  const { topicId } = useParams();
  
  // Find the selected topic from topics dataset
  const topic = topics.find((t) => t.id === topicId);

  // Track which question editor is currently expanded
  const [activeQId, setActiveQId] = useState(null);
  
  // Store code drafts typed by user in each question
  const [codeDrafts, setCodeDrafts] = useState({});
  
  // Show temporary "Accepted" feedback on submit
  const [feedback, setFeedback] = useState({});

  if (!topic) return <Navigate to="/topics" replace />;

  const questions = topic.questions || [];

  // Function called when student clicks "Submit Solution"
  const handleRunCode = (q) => {
    const todayStr = getTodayDateString();
    
    // Add today to active practice dates to increase streak
    const activeDates = new Set(currentUser?.activeDates || []);
    activeDates.add(todayStr);

    // Mark topic as completed
    const completed = new Set(currentUser?.completed || []);
    completed.add(topic.id);

    // Create new submission record
    const newSub = {
      id: `sub_${Date.now()}`,
      topicId: topic.id,
      topicTitle: topic.title,
      questionId: q.id,
      questionTitle: q.title,
      code: codeDrafts[q.id] !== undefined ? codeDrafts[q.id] : q.starterCode,
      language: "javascript",
      status: "Accepted",
      submittedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    // Save updated user state
    updateUser({
      ...currentUser,
      completed: Array.from(completed),
      activeDates: Array.from(activeDates),
      submissions: [...(currentUser?.submissions || []), newSub]
    });

    // Show accepted badge for 4 seconds
    setFeedback((prev) => ({ ...prev, [q.id]: true }));
    setTimeout(() => setFeedback((prev) => ({ ...prev, [q.id]: false })), 4000);
  };

  return (
    <section style={{ maxWidth: "900px", margin: "0 auto" }}>
      {/* Back button */}
      <Link to="/topics" style={{ color: "#818cf8", fontSize: "13.5px", display: "inline-block", marginBottom: "16px" }}>
        ← Back to Practice Library
      </Link>

      {/* Topic Header Card */}
      <div className="dashboard-panel-card" style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
          <span className="badge-tag-purple">{topic.type}</span>
          <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>{topic.level}</span>
        </div>
        <h2 style={{ fontSize: "22px", fontWeight: 800, color: "var(--text-main)" }}>{topic.title}</h2>
        <p style={{ color: "var(--text-muted)", fontSize: "14px", marginTop: "4px" }}>{topic.description}</p>
      </div>

      {/* Questions list */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {questions.map((q, idx) => {
          const isOpen = activeQId === q.id;
          const codeVal = codeDrafts[q.id] !== undefined ? codeDrafts[q.id] : q.starterCode;

          return (
            <div className="dashboard-panel-card" key={q.id}>
              {/* Question header row */}
              <div
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}
                onClick={() => setActiveQId(isOpen ? null : q.id)}
              >
                <div>
                  <span style={{ color: "var(--cyan)", fontWeight: 800, marginRight: "8px" }}>#{idx + 1}</span>
                  <strong style={{ fontSize: "15px" }}>{q.title}</strong>
                </div>
                <button className="view-code-btn">
                  {isOpen ? "Hide Editor ▲" : "Solve Problem ▼"}
                </button>
              </div>

              {/* Collapsible code editor */}
              {isOpen && (
                <div style={{ marginTop: "16px" }}>
                  <p style={{ fontSize: "13.5px", color: "var(--text-muted)", marginBottom: "12px" }}>{q.prompt}</p>
                  {q.sampleTest && (
                    <div style={{ padding: "8px 12px", background: "var(--bg-app)", borderRadius: "6px", fontSize: "12.5px", marginBottom: "12px", border: "1px solid var(--border-main)" }}>
                      <strong>Sample Test:</strong> {q.sampleTest}
                    </div>
                  )}
                  <textarea
                    style={{
                      width: "100%",
                      fontFamily: "var(--font-mono)",
                      fontSize: "13px",
                      background: "#0a0e1a",
                      color: "#a5b4fc",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid var(--border-main)",
                      outline: "none",
                      lineHeight: "1.5"
                    }}
                    rows={8}
                    value={codeVal}
                    onChange={(e) => setCodeDrafts({ ...codeDrafts, [q.id]: e.target.value })}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px" }}>
                    {feedback[q.id] ? (
                      <span style={{ color: "#34d399", fontWeight: 700, fontSize: "13px" }}>
                        🎉 Accepted! Solution logged to Submissions.
                      </span>
                    ) : (
                      <span style={{ color: "var(--text-subtle)", fontSize: "12px" }}>
                        Clicking submit records your solution and updates streak.
                      </span>
                    )}
                    <button className="btn-primary-gradient" onClick={() => handleRunCode(q)}>
                      Submit Solution ✓
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
