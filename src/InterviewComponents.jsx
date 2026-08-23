// Technical Interview Subcomponents
// Timer, question card, sample answer reveal, score summary, and interview tips

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// 1. Interview Timer component to track seconds elapsed during mock interview
export function InterviewTimer({ active = true, onTick }) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!active) return;
    const timer = setInterval(() => {
      setSeconds((prev) => {
        const next = prev + 1;
        if (onTick) onTick(next);
        return next;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [active, onTick]);

  // Format seconds to mm:ss format
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${remainder.toString().padStart(2, "0")}`;
  };

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        background: "var(--bg-surface-elevated)",
        padding: "6px 12px",
        borderRadius: "20px",
        border: "1px solid var(--border-main)",
        fontSize: "13px",
        fontFamily: "var(--font-mono)",
        color: "var(--cyan)"
      }}
    >
      <span>⏱</span>
      <span>{formatTime(seconds)}</span>
    </div>
  );
}

// 2. Question Card displaying problem statement and difficulty
export function QuestionCard({ question, current, total, score }) {
  return (
    <div style={{ marginBottom: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span className="badge-tag-purple">{question.topic || "Technical"}</span>
          <span className="difficulty-badge-easy">{question.difficulty || "Medium"}</span>
        </div>
        <span style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: 600 }}>
          Score: <strong style={{ color: "var(--cyan)" }}>{score}</strong>
        </span>
      </div>

      <h2 style={{ fontSize: "20px", fontWeight: 700, color: "var(--text-main)", lineHeight: "1.4" }}>
        {question.question}
      </h2>
    </div>
  );
}

// 3. Answer Reveal component to check model solution
export function AnswerReveal({ answer, isVisible, onToggle }) {
  return (
    <div style={{ marginTop: "16px" }}>
      <button
        type="button"
        className="btn-secondary-dark"
        onClick={onToggle}
        style={{ marginBottom: isVisible ? "12px" : "0" }}
      >
        {isVisible ? "Hide Sample Answer ▲" : "Reveal Sample Answer ▼"}
      </button>

      {isVisible && (
        <div
          style={{
            background: "var(--bg-app)",
            border: "1px solid var(--border-main)",
            borderRadius: "10px",
            padding: "16px",
            animation: "fadeIn 0.2s ease-in-out"
          }}
        >
          <div style={{ fontSize: "12px", color: "var(--cyan)", fontWeight: 700, textTransform: "uppercase", marginBottom: "6px" }}>
            💡 Ideal Solution & Explanation:
          </div>
          <p style={{ color: "var(--text-main)", fontSize: "14px", lineHeight: "1.6" }}>
            {answer}
          </p>
        </div>
      )}
    </div>
  );
}

// 4. Score Summary Card shown when all interview questions are completed
export function ScoreCard({ score, total, onRestart }) {
  const percentage = Math.round((score / total) * 100);
  const isPassed = percentage >= 70;

  return (
    <div className="dashboard-panel-card" style={{ maxWidth: "600px", margin: "40px auto", textAlign: "center", padding: "40px 24px" }}>
      <div style={{ fontSize: "48px", marginBottom: "12px" }}>
        {isPassed ? "🎉" : "💪"}
      </div>
      <div className="badge-tag-purple" style={{ margin: "0 auto 12px" }}>
        INTERVIEW COMPLETE
      </div>
      <h2 style={{ fontSize: "24px", fontWeight: 800, color: "var(--text-main)", marginBottom: "8px" }}>
        {isPassed ? "Outstanding Performance!" : "Good Effort! Keep Practicing."}
      </h2>
      <p style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "24px" }}>
        You answered <strong>{score}</strong> correctly out of <strong>{total}</strong> questions.
      </p>

      {/* Score circle badge */}
      <div
        style={{
          width: "120px",
          height: "120px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(99, 102, 241, 0.02) 100%)",
          border: `3px solid ${isPassed ? "#34d399" : "#6366f1"}`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 28px"
        }}
      >
        <span style={{ fontSize: "28px", fontWeight: 800, color: isPassed ? "#34d399" : "#818cf8" }}>
          {percentage}%
        </span>
        <span style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase" }}>
          Accuracy
        </span>
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: "12px" }}>
        <button className="btn-primary-gradient" onClick={onRestart}>
          Try Again ↺
        </button>
        <Link to="/dashboard" className="btn-secondary-dark">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}

// 5. Technical Interview Tips list
export function InterviewTips({ tips = [] }) {
  if (!tips.length) return null;
  return (
    <div className="dashboard-panel-card" style={{ marginTop: "24px" }}>
      <h3 style={{ fontSize: "15px", fontWeight: 700, marginBottom: "12px", color: "var(--text-main)" }}>
        💡 Technical Interview Preparation Tips
      </h3>
      <ul style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "8px", color: "var(--text-muted)", fontSize: "13.5px" }}>
        {tips.map((tip, idx) => (
          <li key={idx}>{tip}</li>
        ))}
      </ul>
    </div>
  );
}
