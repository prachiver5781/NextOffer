// Mock Technical Interview Simulator
// Interactive quiz testing students on JS, React, and DSA conceptual interview questions

import React, { useState } from "react";
import { mockQuestions, resumeTips } from "./data";
import {
  InterviewTimer,
  QuestionCard,
  AnswerReveal,
  ScoreCard,
  InterviewTips
} from "./InterviewComponents";

export default function MockInterview({ currentUser }) {
  // Started state to show welcome screen or quiz questions
  const [started, setStarted] = useState(false);
  // Current question index
  const [current, setCurrent] = useState(0);
  // Sample answer visibility toggle
  const [showAnswer, setShowAnswer] = useState(false);
  // Score counter
  const [score, setScore] = useState(0);
  // Finished boolean to show final score card
  const [finished, setFinished] = useState(false);

  const questions = mockQuestions || [];
  const question = questions[current];

  // Start the interview quiz
  const handleStart = () => {
    setStarted(true);
    setCurrent(0);
    setScore(0);
    setShowAnswer(false);
    setFinished(false);
  };

  // Next question handler
  const handleNext = () => {
    // If student didn't need to look at the answer, give a point
    if (!showAnswer) {
      setScore((prev) => prev + 1);
    }

    // Check if reached last question
    if (current === questions.length - 1) {
      setFinished(true);
      return;
    }

    setShowAnswer(false);
    setCurrent((prev) => prev + 1);
  };

  // Reset and try again
  const handleRestart = () => {
    setStarted(false);
    setCurrent(0);
    setScore(0);
    setShowAnswer(false);
    setFinished(false);
  };

  // If not started yet, render the landing card
  if (!started) {
    return (
      <section style={{ maxWidth: "800px", margin: "0 auto" }}>
        <div style={{ marginBottom: "24px" }}>
          <div className="badge-tag-purple">🎤 MOCK INTERVIEW SIMULATOR</div>
          <h1 style={{ fontSize: "28px", fontWeight: 800, color: "var(--text-main)", marginBottom: "6px" }}>
            Technical Interview Preparation
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
            Simulate real placement technical interviews. Test your conceptual clarity on JavaScript, React, and Algorithms.
          </p>
        </div>

        <div className="dashboard-panel-card" style={{ padding: "32px", textAlign: "center" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>⚡</div>
          <h2 style={{ fontSize: "22px", fontWeight: 800, marginBottom: "8px", color: "var(--text-main)" }}>
            Ready to test your knowledge?
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "14px", maxWidth: "500px", margin: "0 auto 24px" }}>
            You will be presented with {questions.length} hand-picked technical interview questions covering JavaScript, React, CSS, and DSA.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "16px",
              maxWidth: "500px",
              margin: "0 auto 32px"
            }}
          >
            <div style={{ padding: "16px", background: "var(--bg-surface-elevated)", borderRadius: "10px", border: "1px solid var(--border-main)" }}>
              <strong style={{ fontSize: "20px", color: "var(--cyan)", display: "block" }}>{questions.length}</strong>
              <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Questions</span>
            </div>
            <div style={{ padding: "16px", background: "var(--bg-surface-elevated)", borderRadius: "10px", border: "1px solid var(--border-main)" }}>
              <strong style={{ fontSize: "20px", color: "#818cf8", display: "block" }}>4</strong>
              <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Topics</span>
            </div>
            <div style={{ padding: "16px", background: "var(--bg-surface-elevated)", borderRadius: "10px", border: "1px solid var(--border-main)" }}>
              <strong style={{ fontSize: "20px", color: "#34d399", display: "block" }}>Self</strong>
              <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Paced</span>
            </div>
          </div>

          <button className="btn-primary-gradient" style={{ padding: "12px 28px", fontSize: "15px" }} onClick={handleStart}>
            Start Mock Interview →
          </button>
        </div>

        <InterviewTips tips={resumeTips} />
      </section>
    );
  }

  // If finished all questions, render score summary
  if (finished) {
    return <ScoreCard score={score} total={questions.length} onRestart={handleRestart} />;
  }

  const progressPercent = Math.round(((current + 1) / questions.length) * 100);

  return (
    <section style={{ maxWidth: "800px", margin: "0 auto" }}>
      {/* Top status bar with timer */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <div>
          <span className="badge-tag-purple">QUESTION {current + 1} OF {questions.length}</span>
        </div>
        <InterviewTimer />
      </div>

      {/* Progress track */}
      <div style={{ width: "100%", height: "6px", background: "var(--bg-surface-elevated)", borderRadius: "3px", overflow: "hidden", marginBottom: "24px" }}>
        <div
          style={{
            width: `${progressPercent}%`,
            height: "100%",
            background: "linear-gradient(90deg, #6366f1, #06b6d4)",
            transition: "width 0.3s ease"
          }}
        />
      </div>

      {/* Main question box */}
      <div className="dashboard-panel-card" style={{ padding: "28px" }}>
        <QuestionCard
          question={question}
          current={current}
          total={questions.length}
          score={score}
        />

        <AnswerReveal
          answer={question.answer}
          isVisible={showAnswer}
          onToggle={() => setShowAnswer(!showAnswer)}
        />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "28px", paddingTop: "20px", borderTop: "1px solid var(--border-main)" }}>
          <span style={{ fontSize: "12.5px", color: "var(--text-muted)" }}>
            {!showAnswer ? "💡 Answering without looking gives +1 point!" : "Sample answer revealed"}
          </span>

          <button className="btn-primary-gradient" onClick={handleNext}>
            {current === questions.length - 1 ? "Finish Interview 🏁" : "Next Question →"}
          </button>
        </div>
      </div>
    </section>
  );
}
