import { useState } from "react";
import { Link } from "react-router-dom";
import { mockQuestions } from "../data";

export default function MockInterview() {
  const [current, setCurrent] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [started, setStarted] = useState(false);

  const question = mockQuestions[current];

  const handleStartInterview = () => {
    setStarted(true);
    setCurrent(0);
    setScore(0);
    setShowAnswer(false);
    setFinished(false);
  };

  const handleNextQuestion = () => {
    if (!showAnswer) {
      setScore((old) => old + 1);
    }

    if (current === mockQuestions.length - 1) {
      setFinished(true);
      return;
    }

    setShowAnswer(false);
    setCurrent((old) => old + 1);
  };

  const handleRestart = () => {
    setCurrent(0);
    setScore(0);
    setShowAnswer(false);
    setFinished(false);
  };

  if (!started) {
    return (
      <section className="page narrow">
        <div className="interview-start">
          <span className="big-emoji">🎤</span>
          <p className="eyebrow">MOCK INTERVIEW</p>
          <h2>Test your interview skills.</h2>
          <p>
            Answer questions without looking at the answer, then reveal the
            explanation and move to the next one.
          </p>

          <div className="interview-info">
            <div>
              <strong>{mockQuestions.length}</strong>
              <span>Questions</span>
            </div>
            <div>
              <strong>3</strong>
              <span>Difficulty levels</span>
            </div>
            <div>
              <strong>⏱</strong>
              <span>Self paced</span>
            </div>
          </div>

          <button
            className="primary-button large"
            onClick={handleStartInterview}
          >
            Start interview →
          </button>
        </div>
      </section>
    );
  }

  if (finished) {
    const percentage = Math.round((score / mockQuestions.length) * 100);

    return (
      <section className="page narrow">
        <div className="result-card">
          <span className="result-icon">{percentage >= 70 ? "🎉" : "💪"}</span>
          <p className="eyebrow">INTERVIEW COMPLETE</p>
          <h2>{percentage >= 70 ? "Great job!" : "Keep practicing!"}</h2>

          <div className="score-circle">
            <strong>{percentage}%</strong>
            <span>Score</span>
          </div>

          <p>
            You scored <strong>{score}</strong> out of{" "}
            <strong>{mockQuestions.length}</strong>.
          </p>

          <div className="result-actions">
            <button className="primary-button" onClick={handleRestart}>
              Try again
            </button>
            <Link to="/dashboard" className="secondary-button">
              Back to dashboard
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="page narrow">
      <div className="interview-top">
        <div>
          <p className="eyebrow">MOCK INTERVIEW</p>
          <h2>
            Question {current + 1}
            <span> / {mockQuestions.length}</span>
          </h2>
        </div>

        <div className="score-display">
          Score: <strong>{score}</strong>
        </div>
      </div>

      <div className="interview-progress">
        <div
          style={{
            width: `${((current + 1) / mockQuestions.length) * 100}%`,
          }}
        />
      </div>

      <div className="interview-card">
        <div className="question-meta">
          <span className="topic-type">{question.topic}</span>
          <span className="level-badge">{question.difficulty}</span>
        </div>

        <h3>{question.question}</h3>

        {showAnswer && (
          <div className="answer">
            <strong>Sample answer</strong>
            <p>{question.answer}</p>
          </div>
        )}

        <div className="interview-actions">
          <button
            className="secondary-button"
            onClick={() => setShowAnswer(!showAnswer)}
          >
            {showAnswer ? "Hide answer" : "Show answer"}
          </button>

          <button className="primary-button" onClick={handleNextQuestion}>
            {current === mockQuestions.length - 1
              ? "Finish interview"
              : "Next question →"}
          </button>
        </div>

        <small className="interview-tip">
          💡 Try answering aloud before revealing the sample answer.
        </small>
      </div>
    </section>
  );
}
