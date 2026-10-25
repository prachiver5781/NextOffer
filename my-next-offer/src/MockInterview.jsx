
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./styles/MockInterview.css";
import { saveSubmission } from "./submissionUtils";
import mockInterviewDB from "../mockInterviewDB.json";

const QUESTIONS_PER_PAGE = 8;

export default function MockInterview() {
  const [questions, setQuestions] = useState([]);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [showAnswers, setShowAnswers] = useState({});
  const [learned, setLearned] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mode, setMode] = useState("library");
  const [interviewCategory, setInterviewCategory] = useState("Mixed");
  const [bookmarked, setBookmarked] = useState([]);
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false);
  const [performance, setPerformance] = useState(null);
  const submissionSaved = useRef(false);

  const [interviewQuestions, setInterviewQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [userAnswers, setUserAnswers] = useState({});
  const [secondsLeft, setSecondsLeft] = useState(600);
  const [finished, setFinished] = useState(false);
  
  // Submission confirmation modal and loading state
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch questions from the API
  useEffect(() => {
    // Load the interview questions from the local data folder.
    // This avoids requiring a separate JSON Server process to run the app.
    try {
      const data = Array.isArray(mockInterviewDB)
        ? mockInterviewDB
        : mockInterviewDB.questions || [];
      setQuestions(data);
      if (data.length === 0) setError("No interview questions were found in the local question bank.");
    } catch (loadError) {
      setError("Unable to load the local interview question bank.");
    } finally {
      setLoading(false);
    }

    try {
      const saved = JSON.parse(
        localStorage.getItem("nextoffer-learned") || "[]"
      );
      setLearned(saved);
    } catch {
      setLearned([]);
    }
    try {
      setBookmarked(JSON.parse(localStorage.getItem("nextoffer-bookmarked") || "[]"));
    } catch {
      setBookmarked([]);
    }
  }, []);

  // Interview timer
  useEffect(() => {
    if (mode !== "interview" || finished) {
      return;
    }

    if (secondsLeft <= 0) {
      executeSubmitInterview();
      return;
    }

    const timerId = setTimeout(() => {
      setSecondsLeft(secondsLeft - 1);
    }, 1000);

    return () => clearTimeout(timerId);
  }, [mode, finished, secondsLeft]);

  function toggleLearned(id) {
    let updated;

    if (learned.includes(id)) {
      updated = learned.filter((item) => item !== id);
    } else {
      updated = [...learned, id];
    }

    setLearned(updated);
    localStorage.setItem(
      "nextoffer-learned",
      JSON.stringify(updated)
    );
  }

  function toggleBookmark(id) {
    const updated = bookmarked.includes(id)
      ? bookmarked.filter((item) => item !== id)
      : [...bookmarked, id];
    setBookmarked(updated);
    localStorage.setItem("nextoffer-bookmarked", JSON.stringify(updated));
  }

  function startInterview() {
    const pool = interviewCategory === "Mixed"
      ? questions
      : questions.filter((item) => item.category === interviewCategory);
    if (pool.length === 0) {
      setError("No questions are available for this category.");
      return;
    }
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    setInterviewQuestions(shuffled.slice(0, Math.min(5, shuffled.length)));
    setCurrentIndex(0);
    setAnswer("");
    setUserAnswers({});
    setSecondsLeft(600);
    setFinished(false);
    setPerformance(null);
    setShowConfirmModal(false);
    setIsSubmitting(false);
    submissionSaved.current = false;
    setMode("interview");
  }

  // Navigate directly to any question via navigator pill
  function goToQuestion(targetIndex) {
    const currentQ = interviewQuestions[currentIndex];
    const updated = {
      ...userAnswers,
      ...(currentQ ? { [currentQ.id]: answer } : {})
    };
    setUserAnswers(updated);
    setCurrentIndex(targetIndex);
    const targetQ = interviewQuestions[targetIndex];
    setAnswer(targetQ ? updated[targetQ.id] || "" : "");
  }

  // Move to next question or prompt modal on last question
  function nextQuestion() {
    const currentQ = interviewQuestions[currentIndex];
    if (!currentQ) return;

    const updated = {
      ...userAnswers,
      [currentQ.id]: answer
    };
    setUserAnswers(updated);

    if (currentIndex < interviewQuestions.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setAnswer(updated[interviewQuestions[nextIdx].id] || "");
    } else {
      promptSubmitInterview(updated);
    }
  }

  // Move to previous question
  function prevQuestion() {
    if (currentIndex <= 0) return;
    const currentQ = interviewQuestions[currentIndex];
    const updated = {
      ...userAnswers,
      ...(currentQ ? { [currentQ.id]: answer } : {})
    };
    setUserAnswers(updated);
    const prevIdx = currentIndex - 1;
    setCurrentIndex(prevIdx);
    setAnswer(updated[interviewQuestions[prevIdx].id] || "");
  }

  // Open confirmation modal with updated answers
  function promptSubmitInterview(overrideAnswers = null) {
    const currentQ = interviewQuestions[currentIndex];
    const finalState = overrideAnswers || {
      ...userAnswers,
      ...(currentQ ? { [currentQ.id]: answer } : {})
    };
    setUserAnswers(finalState);
    setShowConfirmModal(true);
  }

  // Execute submission asynchronously with duplicate prevention
  function executeSubmitInterview() {
    if (submissionSaved.current || isSubmitting) return;
    setIsSubmitting(true);

    const currentQ = interviewQuestions[currentIndex];
    const finalAnswers = {
      ...userAnswers,
      ...(currentQ ? { [currentQ.id]: answer } : {})
    };
    setUserAnswers(finalAnswers);

    setTimeout(() => {
      submissionSaved.current = true;

      const results = interviewQuestions.map((item) => {
        const text = (finalAnswers[item.id] || "").trim();
        const wordCount = text ? text.split(/\s+/).length : 0;
        return {
          id: item.id,
          category: item.category,
          question: item.question,
          suggestedAnswer: item.answer,
          userAnswer: text,
          wordCount
        };
      });

      const answeredCount = results.filter((item) => item.userAnswer).length;
      const unansweredCount = results.length - answeredCount;
      const completionPercentage = results.length
        ? Math.round((answeredCount / results.length) * 100)
        : 0;

      // Calculate topic-wise breakdown accurately from actual interview questions
      const topicStats = {};
      results.forEach((item) => {
        const cat = item.category || "General";
        if (!topicStats[cat]) {
          topicStats[cat] = { total: 0, answered: 0 };
        }
        topicStats[cat].total += 1;
        if (item.userAnswer) {
          topicStats[cat].answered += 1;
        }
      });

      const durationSeconds = Math.max(0, 600 - secondsLeft);
      const totalWords = results.reduce((acc, r) => acc + r.wordCount, 0);

      // Save to global submission history
      saveSubmission({
        source: "Mock Interview",
        title: "Mock Interview Simulation",
        category: interviewCategory,
        questionCount: results.length,
        answeredCount,
        unansweredCount,
        completionPercentage,
        durationSeconds,
        questions: results,
      });

      setPerformance({
        answeredCount,
        unansweredCount,
        completionPercentage,
        topicStats,
        durationSeconds,
        totalWords
      });

      setInterviewQuestions(results.map((item) => ({ ...item, answer: item.suggestedAnswer })));
      setFinished(true);
      setShowConfirmModal(false);
      setIsSubmitting(false);
    }, 300);
  }

  const filteredQuestions = questions.filter((item) => {
    const matchesCategory =
      category === "All" || item.category === category;

    const searchText = search.toLowerCase();

    const matchesSearch =
      item.question.toLowerCase().includes(searchText) ||
      item.answer.toLowerCase().includes(searchText);

    const matchesBookmark = !showBookmarkedOnly || bookmarked.includes(item.id);
    return matchesCategory && matchesSearch && matchesBookmark;
  });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredQuestions.length / QUESTIONS_PER_PAGE)
  );

  const startIndex = (page - 1) * QUESTIONS_PER_PAGE;

  const pageQuestions = filteredQuestions.slice(
    startIndex,
    startIndex + QUESTIONS_PER_PAGE
  );

  const currentQuestion = interviewQuestions[currentIndex];
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  const progress = questions.length
    ? Math.round((learned.length / questions.length) * 100)
    : 0;

  function changeCategory(value) {
    setCategory(value);
    setPage(1);
  }

  function changeSearch(value) {
    setSearch(value);
    setPage(1);
  }

  if (loading) {
    return (
      <main className="mi-page">
        <p>Loading interview questions...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mi-page">
        <div className="mi-error-card">
          <h2>Questions could not be loaded</h2>
          <p>{error}</p>
          <p>Please check <code>src/data/mockInterviewDB.json</code> and try again.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="mi-page">
      {mode === "library" ? (
        <>
          <header className="mi-header">
            <p className="mi-eyebrow">NEXTOFFER / PRACTICE</p>
            <h1>Interview Preparation</h1>
            <p className="mi-subtitle">
              Build confidence, one question at a time.
            </p>
          </header>

          <section className="mi-hero">
            <div className="mi-hero-icon">Γ£ª</div>

            <div className="mi-hero-copy">
              <p className="mi-eyebrow">READY TO PRACTISE?</p>
              <h2>Prepare for your next interview</h2>
              <p>
                Answer five random questions in ten minutes.
                Review your answers when you finish.
              </p>
            </div>

            <div className="mi-interview-start-controls">
              <label>
                Interview category
                <select value={interviewCategory} onChange={(event) => setInterviewCategory(event.target.value)}>
                  {["Mixed", "HR", "Java", "React", "AI/ML", "OOP"].map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </label>
              <button className="mi-primary" onClick={startInterview}>Start Interview ΓåÆ</button>
            </div>
          </section>

          <section className="mi-stats">
            <div className="mi-stat-card">
              <strong>{questions.length}</strong>
              <span>Total questions</span>
            </div>

            <div className="mi-stat-card">
              <strong>{learned.length}</strong>
              <span>Questions learned</span>
            </div>

            <div className="mi-stat-card">
              <strong>{progress}%</strong>
              <span>Learning progress</span>
            </div>
          </section>

          <section className="mi-library-heading">
            <div>
              <h2>Explore Questions</h2>
              <p>Search by topic or choose a category.</p>
            </div>

            <span className="mi-count">
              {filteredQuestions.length} questions
            </span>
          </section>

          <div className="mi-search">
            <span>Γîò</span>
            <input
              value={search}
              onChange={(event) =>
                changeSearch(event.target.value)
              }
              placeholder="Search interview questions..."
            />
            {search && (
              <button onClick={() => changeSearch("")}>
                Clear
              </button>
            )}
          </div>

          <nav className="mi-category-tabs">
            {["All", "HR", "Java", "React", "AI/ML", "OOP"].map(
              (item) => (
                <button
                  key={item}
                  className={
                    category === item
                      ? "mi-tab mi-tab-active"
                      : "mi-tab"
                  }
                  onClick={() => changeCategory(item)}
                >
                  {item}
                </button>
              )
            )}
          </nav>

          <label className="mi-bookmark-filter">
            <input type="checkbox" checked={showBookmarkedOnly} onChange={(event) => { setShowBookmarkedOnly(event.target.checked); setPage(1); }} />
            Show bookmarked questions only ({bookmarked.length})
          </label>

          <section className="mi-question-list">
            {pageQuestions.map((item, index) => (
              <article className="mi-question-card" key={item.id}>
                <div className="mi-card-top">
                  <span className="mi-category">
                    {item.category}
                  </span>
                  <span className="mi-question-number">
                    Q{startIndex + index + 1}
                  </span>
                </div>

                <h3>{item.question}</h3>

                {showAnswers[item.id] && (
                  <div className="mi-answer-box">
                    <p className="mi-answer-label">
                      SUGGESTED ANSWER
                    </p>
                    <p className="mi-answer">{item.answer}</p>
                  </div>
                )}

                <div className="mi-card-actions">
                  <button
                    className="mi-secondary"
                    onClick={() =>
                      setShowAnswers({
                        ...showAnswers,
                        [item.id]: !showAnswers[item.id],
                      })
                    }
                  >
                    {showAnswers[item.id]
                      ? "Hide answer"
                      : "Show answer"}
                  </button>

                  <button
                    className="mi-text-button"
                    onClick={() => toggleLearned(item.id)}
                  >
                    {learned.includes(item.id)
                      ? "Γ£ô Learned"
                      : "+ Mark learned"}
                  </button>
                  <button className="mi-text-button" onClick={() => toggleBookmark(item.id)}>
                    {bookmarked.includes(item.id) ? "Γÿà Bookmarked" : "Γÿå Bookmark"}
                  </button>
                </div>
              </article>
            ))}
          </section>

          {filteredQuestions.length === 0 && (
            <p className="mi-empty">
              No questions found. Try another search.
            </p>
          )}

          {filteredQuestions.length > 0 && (
            <footer className="mi-pagination">
              <span>
                Showing {startIndex + 1}ΓÇô
                {Math.min(
                  startIndex + QUESTIONS_PER_PAGE,
                  filteredQuestions.length
                )}{" "}
                of {filteredQuestions.length}
              </span>

              <div>
                <button
                  className="mi-secondary"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  ΓåÉ Previous
                </button>

                <span className="mi-page-number">
                  Page {page} of {totalPages}
                </span>

                <button
                  className="mi-secondary"
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  Next ΓåÆ
                </button>
              </div>
            </footer>
          )}
        </>
      ) : (
        <section className="mi-interview-wrap">
          {finished ? (
            /* =========================================================
               POST-SUBMISSION POLISHED RESULTS EXPERIENCE
               ========================================================= */
            <>
              {/* Results Hero Header */}
              <div className="mi-results-hero">
                <div>
                  <p className="mi-eyebrow">INTERVIEW SIMULATION COMPLETE</p>
                  <h1 style={{ fontSize: 26, fontWeight: 800, margin: "6px 0 10px" }}>
                    Performance Analysis & Review
                  </h1>
                  <p style={{ color: "#c4b5fd", fontSize: 14, maxWidth: 580, lineHeight: 1.5 }}>
                    {performance?.completionPercentage === 100
                      ? "≡ƒÅå Outstanding Completion! You attempted all questions. Review your responses below to calibrate against standard interview answers."
                      : performance?.completionPercentage >= 60
                      ? "ΓÜí Solid Performance! You completed the majority of questions within the 10-minute limit. Review unattempted questions to strengthen your weak spots."
                      : "≡ƒÆí Needs Practice. Several questions were left unanswered. Review the suggested answers below and bookmark tricky concepts for revision."}
                  </p>
                </div>

                {/* Score Circle Gauge */}
                <div className="mi-score-circle">
                  <strong>{performance?.completionPercentage || 0}%</strong>
                  <span>COMPLETION</span>
                </div>
              </div>

              {/* 4-Card Performance Metric Strip */}
              {performance && (
                <section className="mi-performance-grid">
                  <div>
                    <strong>{performance.answeredCount} / {interviewQuestions.length}</strong>
                    <span>Questions Attempted</span>
                  </div>
                  <div>
                    <strong style={{ color: performance.unansweredCount > 0 ? "#fbbf24" : "#34d399" }}>
                      {performance.unansweredCount}
                    </strong>
                    <span>Unanswered</span>
                  </div>
                  <div>
                    <strong>
                      {Math.floor(performance.durationSeconds / 60)}m {performance.durationSeconds % 60}s
                    </strong>
                    <span>Time Taken (of 10m)</span>
                  </div>
                  <div>
                    <strong style={{ color: "#38bdf8" }}>
                      {performance.totalWords || 0}
                    </strong>
                    <span>Total Words Written</span>
                  </div>
                </section>
              )}

              {/* Topic-Wise Breakdown Section */}
              {performance?.topicStats && Object.keys(performance.topicStats).length > 0 && (
                <div style={{ margin: "24px 0" }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: "#f4f4fb" }}>
                    ≡ƒôè Topic-wise Performance Breakdown
                  </h3>
                  <div className="mi-topic-grid">
                    {Object.entries(performance.topicStats).map(([cat, stats]) => {
                      const pct = Math.round((stats.answered / stats.total) * 100);
                      return (
                        <div key={cat} className="mi-topic-card">
                          <div className="mi-topic-header">
                            <span>{cat}</span>
                            <span style={{ color: pct === 100 ? "#34d399" : pct > 0 ? "#fbbf24" : "#94a3b8" }}>
                              {stats.answered}/{stats.total} ({pct}%)
                            </span>
                          </div>
                          <div className="mi-topic-bar-bg">
                            <div className="mi-topic-bar-fill" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Action Toolbar */}
              <div className="mi-results-actions" style={{ marginBottom: 30 }}>
                <Link to="/dashboard" className="mi-secondary" style={{ textDecoration: "none" }}>
                  ≡ƒôè Back to Dashboard
                </Link>
                <button className="mi-secondary" onClick={() => setMode("library")}>
                  ≡ƒôÜ Question Library
                </button>
                <button className="mi-primary" onClick={startInterview}>
                  ≡ƒöä Try Another Interview
                </button>
              </div>

              {/* Detailed Review Cards */}
              <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16, color: "#ffffff" }}>
                ≡ƒô¥ Detailed Question-by-Question Review
              </h3>

              {interviewQuestions.map((item, index) => {
                const isAnswered = Boolean(item.userAnswer && item.userAnswer.trim());
                return (
                  <article className="mi-result-card" key={item.id} style={{ marginBottom: 20 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                      <span className="mi-category">{item.category}</span>
                      <span className={`mi-status-pill ${isAnswered ? "answered" : "unanswered"}`}>
                        {isAnswered ? `Γ£ô Answered (${item.wordCount} words)` : "ΓÜá∩╕Å Unanswered"}
                      </span>
                    </div>

                    <h2>
                      {index + 1}. {item.question}
                    </h2>

                    {/* Candidate's submitted answer */}
                    <div className={`mi-answer-comparison-box ${!isAnswered ? "unanswered" : ""}`}>
                      <h4 style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5, color: isAnswered ? "#34d399" : "#fbbf24", marginBottom: 6 }}>
                        Your Submitted Answer:
                      </h4>
                      <p className="mi-user-answer" style={{ margin: 0, fontStyle: isAnswered ? "normal" : "italic" }}>
                        {item.userAnswer?.trim() || "No answer was submitted for this question during the interview."}
                      </p>
                    </div>

                    {/* Benchmark Suggested Answer */}
                    <div className="mi-answer-comparison-box" style={{ background: "rgba(124, 58, 237, 0.08)", borderColor: "rgba(139, 92, 246, 0.3)" }}>
                      <h4 style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5, color: "#c4b5fd", marginBottom: 6 }}>
                        Benchmark Suggested Answer:
                      </h4>
                      <p className="mi-answer" style={{ margin: 0 }}>{item.answer}</p>
                    </div>

                    <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
                      <button
                        type="button"
                        className="mi-text-button"
                        onClick={() => toggleLearned(item.id)}
                      >
                        {learned.includes(item.id) ? "Γ£ô Learned" : "+ Mark learned"}
                      </button>
                      <button
                        type="button"
                        className="mi-text-button"
                        onClick={() => toggleBookmark(item.id)}
                      >
                        {bookmarked.includes(item.id) ? "Γÿà Bookmarked" : "Γÿå Bookmark"}
                      </button>
                    </div>
                  </article>
                );
              })}
            </>
          ) : currentQuestion ? (
            /* =========================================================
               LIVE INTERVIEW IN-PROGRESS EXPERIENCE
               ========================================================= */
            <>
              {/* Question Navigator & Summary Strip */}
              <div className="mi-question-navigator">
                <div className="mi-nav-pills-group">
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#a5a3c0", marginRight: 4 }}>
                    QUESTIONS:
                  </span>
                  {interviewQuestions.map((q, idx) => {
                    const ans = (idx === currentIndex ? answer : userAnswers[q.id]) || "";
                    const hasAnswer = Boolean(ans.trim());
                    const isActive = idx === currentIndex;
                    return (
                      <button
                        key={q.id}
                        type="button"
                        className={`mi-nav-pill-btn ${isActive ? "active" : ""} ${hasAnswer ? "answered" : "unanswered"}`}
                        onClick={() => goToQuestion(idx)}
                        title={`Jump to Question ${idx + 1}`}
                      >
                        <span className="mi-pill-status">{hasAnswer ? "Γ£ô" : "ΓÇó"}</span>
                        <span>Q{idx + 1}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Summary Strip & Quick Submit Button */}
                <div className="mi-submit-summary-strip">
                  {(() => {
                    const currentAnswers = { ...userAnswers, [currentQuestion.id]: answer };
                    const attempted = Object.values(currentAnswers).filter((a) => a && a.trim()).length;
                    const unanswered = interviewQuestions.length - attempted;
                    return (
                      <>
                        <span>
                          <strong>{attempted}</strong> of {interviewQuestions.length} attempted
                          {unanswered > 0 && <span style={{ color: "#fbbf24", marginLeft: 6 }}>({unanswered} unanswered)</span>}
                        </span>
                        <button
                          type="button"
                          className="mi-submit-btn-primary"
                          onClick={() => promptSubmitInterview()}
                        >
                          Submit Interview Γ£ô
                        </button>
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* Main Question Panel */}
              <div className="mi-interview-panel">
                <div className="mi-interview-top">
                  <div>
                    <button
                      type="button"
                      className="mi-back-button"
                      onClick={() => setMode("library")}
                      style={{ marginBottom: 6 }}
                    >
                      ΓåÉ Exit interview
                    </button>
                    <p className="mi-eyebrow" style={{ marginTop: 4 }}>
                      MOCK INTERVIEW IN PROGRESS ┬╖ {currentQuestion.category}
                    </p>
                    <span style={{ fontSize: 13, color: "#c4b5fd" }}>
                      Question {currentIndex + 1} of {interviewQuestions.length}
                    </span>
                  </div>

                  <strong className="mi-timer" style={{ color: secondsLeft < 60 ? "#f87171" : "inherit" }}>
                    {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
                  </strong>
                </div>

                <div className="mi-progress-track">
                  <div
                    className="mi-progress-fill"
                    style={{
                      width: `${((currentIndex + 1) / interviewQuestions.length) * 100}%`,
                    }}
                  />
                </div>

                <p className="mi-eyebrow" style={{ marginTop: 14 }}>YOUR QUESTION</p>
                <h2 style={{ fontSize: 20, lineHeight: 1.4, margin: "6px 0 10px" }}>{currentQuestion.question}</h2>
                <p className="mi-subtitle">
                  Explain your thought process, approach, key principles, and any edge cases.
                </p>

                <textarea
                  value={answer}
                  onChange={(event) => setAnswer(event.target.value)}
                  placeholder="Type your explanation or structured answer here..."
                  rows="9"
                />

                <div className="mi-interview-bottom">
                  <span style={{ fontSize: 12, color: "#a5a3c0" }}>
                    {answer.trim() ? answer.trim().split(/\s+/).length : 0} words written ┬╖ {answer.length} characters
                  </span>

                  <div style={{ display: "flex", gap: 10 }}>
                    {currentIndex > 0 && (
                      <button
                        type="button"
                        className="mi-secondary"
                        onClick={prevQuestion}
                      >
                        ΓåÉ Previous
                      </button>
                    )}

                    {currentIndex < interviewQuestions.length - 1 ? (
                      <button
                        type="button"
                        className="mi-primary"
                        onClick={nextQuestion}
                      >
                        Save & Next Question ΓåÆ
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="mi-submit-btn-primary"
                        onClick={() => promptSubmitInterview()}
                      >
                        Review & Submit Interview Γ£ô
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <p>No questions are available. Return to the library.</p>
          )}

          {/* =========================================================
             PRE-SUBMISSION CONFIRMATION MODAL
             ========================================================= */}
          {showConfirmModal && (
            <div
              className="mi-modal-backdrop"
              role="dialog"
              aria-modal="true"
              aria-label="Confirm Mock Interview Submission"
            >
              <div className="mi-modal-card">
                <span className="badge-tag-purple">≡ƒôï ASSESSMENT SUBMISSION</span>
                <h3>Submit Mock Interview?</h3>
                <p style={{ color: "#a5a3c0", fontSize: 13.5, lineHeight: 1.5, margin: "4px 0 16px" }}>
                  Review your completion status before finalizing your interview submission.
                </p>

                {(() => {
                  const currentAnswers = { ...userAnswers, ...(currentQuestion ? { [currentQuestion.id]: answer } : {}) };
                  const attempted = Object.values(currentAnswers).filter((a) => a && a.trim()).length;
                  const unanswered = interviewQuestions.length - attempted;
                  return (
                    <>
                      <div className="mi-modal-stats-list">
                        <div className="mi-modal-stat-item">
                          <span>Interview Category:</span>
                          <strong>{interviewCategory}</strong>
                        </div>
                        <div className="mi-modal-stat-item">
                          <span>Total Questions:</span>
                          <strong>{interviewQuestions.length}</strong>
                        </div>
                        <div className="mi-modal-stat-item">
                          <span>Questions Attempted:</span>
                          <strong style={{ color: "#34d399" }}>{attempted} / {interviewQuestions.length}</strong>
                        </div>
                        <div className="mi-modal-stat-item">
                          <span>Questions Unanswered:</span>
                          <strong style={{ color: unanswered > 0 ? "#fbbf24" : "#34d399" }}>{unanswered}</strong>
                        </div>
                        <div className="mi-modal-stat-item">
                          <span>Time Remaining:</span>
                          <strong>{String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}</strong>
                        </div>
                      </div>

                      {unanswered > 0 && (
                        <div className="mi-modal-warning">
                          ΓÜá∩╕Å You have <strong>{unanswered} unanswered question(s)</strong>.
                          You can go back to complete your answers, or confirm to submit now.
                        </div>
                      )}

                      <div className="mi-modal-actions">
                        <button
                          type="button"
                          className="mi-secondary"
                          disabled={isSubmitting}
                          onClick={() => setShowConfirmModal(false)}
                        >
                          ΓåÉ Keep Editing
                        </button>
                        <button
                          type="button"
                          className="mi-submit-btn-primary"
                          disabled={isSubmitting}
                          onClick={executeSubmitInterview}
                        >
                          {isSubmitting ? "Submitting..." : "Confirm & Submit Interview Γ£ô"}
                        </button>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          )}
        </section>
      )}
    </main>
  );
}
