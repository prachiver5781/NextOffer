import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback
} from "react";
import {
  Routes,
  Route,
  Link,
  NavLink,
  Navigate,
  Outlet,
  useNavigate,
  useParams
} from "react-router-dom";

import {
  topics,
  roadmap,
  mockQuestions,
  miniProjects,
  resumeTips
} from "./data";

import {
  useLocalStorage,
  useTheme,
  getTodayDateString,
  calculateStreak
} from "./hooks";

/* =========================================================
   USER AUTH & DATABASE UTILITIES (MULTI-USER SUPPORT)
========================================================= */

const DEFAULT_USERS_KEY = "nextoffer_users_db";
const SESSION_KEY = "nextoffer_active_session_email";

function getUsersDB() {
  try {
    const raw = localStorage.getItem(DEFAULT_USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveUsersDB(users) {
  try {
    localStorage.setItem(DEFAULT_USERS_KEY, JSON.stringify(users));
  } catch (e) {
    console.error("Failed saving users DB", e);
  }
}

/* =========================================================
   NAVBAR & APP LAYOUT
========================================================= */

function Layout({ currentUser, onLogout, theme, toggleTheme }) {
  const streak = useMemo(() => {
    return calculateStreak(currentUser?.activeDates || []);
  }, [currentUser]);

  return (
    <div className="app-shell">
      <header className="navbar">
        <Link className="brand" to="/">
          ⚡ Next<span>Offer</span>
        </Link>

        {currentUser && (
          <nav>
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/topics">Practice Library</NavLink>
            <NavLink to="/submissions">Submissions</NavLink>
            <NavLink to="/roadmap">Roadmap</NavLink>
            <NavLink to="/mock-interview">Mock Interview</NavLink>
            <NavLink to="/resume">Resume Builder</NavLink>
          </nav>
        )}

        <div className="navbar-right">
          {/* Theme Toggle */}
          <button
            className="theme-toggle-btn"
            onClick={toggleTheme}
            title={`Switch to ${theme === "light" ? "Dark" : "Light"} mode`}
            aria-label="Toggle theme"
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>

          {/* Active User Controls */}
          {currentUser ? (
            <>
              {/* Daily Streak Indicator */}
              <div className="streak-pill" title={`${streak} Day Learning Streak`}>
                <span className="flame-icon">🔥</span>
                <span>{streak} {streak === 1 ? "Day" : "Days"}</span>
              </div>

              <Link className="profile-button" to="/profile">
                <span className="profile-avatar">
                  {currentUser.profile?.name
                    ? currentUser.profile.name.charAt(0).toUpperCase()
                    : "U"}
                </span>
                <span className="profile-name">
                  {currentUser.profile?.name || currentUser.name || "Profile"}
                </span>
              </Link>

              <button className="logout-button" onClick={onLogout}>
                Log out
              </button>
            </>
          ) : (
            <Link className="primary-button small-button" to="/login">
              Log in / Sign up
            </Link>
          )}
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer>
        <p>
          NextOffer • Built for 2nd Year Computer Science Students preparing for internships & placements.
        </p>
      </footer>
    </div>
  );
}

/* =========================================================
   PROTECTED ROUTE GUARD
========================================================= */

function ProtectedRoute({ currentUser }) {
  return currentUser ? <Outlet /> : <Navigate to="/login" replace />;
}

/* =========================================================
   HOME (LANDING PAGE)
========================================================= */

function Home({ currentUser }) {
  const streak = calculateStreak(currentUser?.activeDates || []);

  return (
    <section className="hero">
      <div className="hero-content">
        <p className="eyebrow">
          <span>🚀</span> COLLEGE TO PLACEMENT READINESS
        </p>
        <h1>
          Master Tech Interviews.
          <br />
          <span>Get Your NextOffer.</span>
        </h1>
        <p className="hero-text">
          A focused, curriculum-aligned preparation platform for college students.
          Practice DSA problems, master JavaScript & React, track daily streaks,
          log submissions, and build an interview-ready resume.
        </p>

        <div className="hero-actions">
          <Link
            className="primary-button"
            to={currentUser ? "/dashboard" : "/login"}
          >
            {currentUser ? "Continue Preparing →" : "Start Practicing for Free →"}
          </Link>
          <Link className="secondary-button" to="/topics">
            Explore Question Library
          </Link>
        </div>
      </div>

      <div className="hero-card">
        <div className="card-top">
          <span>2nd-Year Study Path</span>
          <strong>{currentUser ? `${streak}🔥 Streak` : "100% Free"}</strong>
        </div>

        <div className="progress">
          <div style={{ width: currentUser ? "65%" : "30%" }} />
        </div>

        <p style={{ marginBottom: "12px" }}>
          {currentUser
            ? "Keep your daily streak going! Solve 1 question today."
            : "Track real progress with per-user persistent analytics."}
        </p>

        <div className="mini-task done">✓ HTML5 & CSS Box Model / Flexbox</div>
        <div className="mini-task done">✓ ES6+ Promises & Async/Await</div>
        <div className="mini-task done">✓ React Hooks & Custom Hooks</div>
        <div className="mini-task">○ LeetCode Array & String Practice</div>
      </div>
    </section>
  );
}

/* =========================================================
   DASHBOARD (ANALYTICS, STREAK TRACKER & RECENT ACTIVITY)
========================================================= */

function Dashboard({ currentUser, updateUser }) {
  const completedTopicsCount = currentUser?.completed?.length || 0;
  const submissionsCount = currentUser?.submissions?.length || 0;
  const streak = calculateStreak(currentUser?.activeDates || []);
  const percentage = topics.length > 0
    ? Math.round((completedTopicsCount / topics.length) * 100)
    : 0;

  const weekDays = useMemo(() => {
    const today = new Date();
    const days = [];
    const activeSet = new Set(currentUser?.activeDates || []);

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
      const isToday = i === 0;
      const isActive = activeSet.has(dateStr);
      days.push({ dateStr, dayName, isToday, isActive });
    }
    return days;
  }, [currentUser?.activeDates]);

  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">STUDENT DASHBOARD</p>
          <h2>Welcome back, {currentUser?.profile?.name || currentUser?.name} 👋</h2>
          <p>Stay consistent. Every problem solved brings you closer to your offer.</p>
        </div>
        <Link className="primary-button" to="/topics">
          + Practice Problems
        </Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card streak-card">
          <strong>🔥 {streak}</strong>
          <span>Current Day Streak</span>
        </div>
        <div className="stat-card">
          <strong>{completedTopicsCount} / {topics.length}</strong>
          <span>Topics Mastered</span>
        </div>
        <div className="stat-card">
          <strong>{submissionsCount}</strong>
          <span>Code Submissions</span>
        </div>
        <div className="stat-card">
          <strong>{percentage}%</strong>
          <span>Syllabus Progress</span>
        </div>
      </div>

      <div className="week-tracker">
        <div className="week-tracker-header">
          <h3>⚡ Weekly Activity & Streak Tracker</h3>
          <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>
            Active days are logged automatically when you practice or submit code
          </span>
        </div>
        <div className="days-row">
          {weekDays.map((day) => (
            <div
              key={day.dateStr}
              className={`day-box ${day.isActive ? "active" : ""} ${day.isToday ? "today" : ""}`}
            >
              <span className="day-label">{day.dayName}</span>
              <span className="day-status">{day.isActive ? "🔥" : "⚪"}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="content-grid">
        <section className="panel">
          <div className="panel-header">
            <h3>Syllabus Roadmap Progress</h3>
            <Link className="text-link" to="/roadmap">View all →</Link>
          </div>
          {roadmap.slice(0, 3).map((item) => (
            <div className="roadmap-row" key={item.week}>
              <span>{item.week}</span>
              <div>
                <strong>{item.title}</strong>
                <small>{item.items.slice(0, 3).join(" • ")}</small>
              </div>
            </div>
          ))}
        </section>

        <section className="panel">
          <div className="panel-header">
            <h3>Recent Submissions</h3>
            <Link className="text-link" to="/submissions">View all →</Link>
          </div>
          {(!currentUser?.submissions || currentUser.submissions.length === 0) ? (
            <p style={{ color: "var(--text-muted)", fontSize: "14px", marginTop: "10px" }}>
              No submissions logged yet. Open any topic and submit your code to see it here!
            </p>
          ) : (
            currentUser.submissions.slice(-3).reverse().map((sub) => (
              <div className="question-preview" key={sub.id}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span className="pill">{sub.topicTitle || "Problem"}</span>
                  <span className="status-tag accepted">✓ {sub.status}</span>
                </div>
                <p><strong>{sub.questionTitle}</strong></p>
                <small style={{ color: "var(--text-muted)" }}>{sub.submittedAt}</small>
              </div>
            ))
          )}
        </section>
      </div>
    </section>
  );
}

/* =========================================================
   TOPICS / PRACTICE LIBRARY
========================================================= */

function Topics({ currentUser, updateUser }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const searchRef = useRef(null);

  useEffect(() => {
    searchRef.current?.focus();
  }, []);

  const completedList = currentUser?.completed || [];

  const filteredTopics = useMemo(() => {
    return topics.filter((topic) => {
      const query = search.toLowerCase();
      const matchesSearch =
        topic.title.toLowerCase().includes(query) ||
        topic.description.toLowerCase().includes(query) ||
        topic.type.toLowerCase().includes(query);

      const matchesFilter = filter === "All" || topic.type === filter;
      return matchesSearch && matchesFilter;
    });
  }, [search, filter]);

  const toggleTopicCompletion = (topicId) => {
    const isDone = completedList.includes(topicId);
    const updatedCompleted = isDone
      ? completedList.filter((id) => id !== topicId)
      : [...completedList, topicId];

    const todayStr = getTodayDateString();
    const activeDates = new Set(currentUser?.activeDates || []);
    if (!isDone) activeDates.add(todayStr);

    updateUser({
      ...currentUser,
      completed: updatedCompleted,
      activeDates: Array.from(activeDates)
    });
  };

  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">PRACTICE LIBRARY</p>
          <h2>Curriculum & Interview Questions</h2>
          <p>Solve problems, review code snippets, and prepare for campus placements.</p>
        </div>
      </div>

      <div className="filters">
        <input
          ref={searchRef}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by topic (e.g. Arrays, React Hooks, Promises)..."
        />

        {["All", "DSA", "JavaScript", "React", "Frontend"].map((item) => (
          <button
            key={item}
            className={`filter ${filter === item ? "active" : ""}`}
            onClick={() => setFilter(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="topic-grid">
        {filteredTopics.map((topic) => {
          const isDone = completedList.includes(topic.id);
          return (
            <article className="topic-card" key={topic.id}>
              <div className="topic-meta">
                <span className="pill">{topic.type}</span>
                <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 600 }}>
                  {topic.level} • {topic.questions?.length || 0} Qs
                </span>
              </div>

              <h3>{topic.title}</h3>
              <p>{topic.description}</p>

              <div className="topic-actions">
                <Link className="primary-button small-button" to={`/topics/${topic.id}`}>
                  Practice Now →
                </Link>
                <button
                  className={`complete-button ${isDone ? "done" : ""}`}
                  onClick={() => toggleTopicCompletion(topic.id)}
                >
                  {isDone ? "✓ Completed" : "Mark Done"}
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {filteredTopics.length === 0 && (
        <div style={{ textAlign: "center", padding: "50px", color: "var(--text-muted)" }}>
          No topics found matching "{search}". Try searching for React, DSA, or Arrays.
        </div>
      )}
    </section>
  );
}

/* =========================================================
   TOPIC DETAILS & LEETCODE-STYLE CODE SUBMISSIONS
========================================================= */

function TopicDetails({ currentUser, updateUser }) {
  const { topicId } = useParams();
  const topic = topics.find((t) => t.id === topicId);

  const [openProblemId, setOpenProblemId] = useState(null);
  const [codeDrafts, setCodeDrafts] = useState({});
  const [submittedFeedback, setSubmittedFeedback] = useState({});

  if (!topic) {
    return <Navigate to="/404" replace />;
  }

  const completedList = currentUser?.completed || [];
  const isTopicDone = completedList.includes(topic.id);

  const getDraftCode = (q) => {
    if (codeDrafts[q.id] !== undefined) return codeDrafts[q.id];
    return q.starterCode || "// Write your solution here...\n";
  };

  const handleCodeChange = (qId, val) => {
    setCodeDrafts((prev) => ({ ...prev, [qId]: val }));
  };

  const handleSubmitCode = (question) => {
    const code = getDraftCode(question);
    const todayStr = getTodayDateString();
    const now = new Date();
    const timestamp = now.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });

    const newSubmission = {
      id: `sub_${Date.now()}`,
      topicId: topic.id,
      topicTitle: topic.title,
      questionId: question.id,
      questionTitle: question.title,
      code: code,
      language: "javascript",
      status: "Accepted",
      submittedAt: timestamp
    };

    const updatedSubmissions = [...(currentUser?.submissions || []), newSubmission];
    const activeDates = new Set(currentUser?.activeDates || []);
    activeDates.add(todayStr);

    updateUser({
      ...currentUser,
      submissions: updatedSubmissions,
      activeDates: Array.from(activeDates)
    });

    setSubmittedFeedback((prev) => ({ ...prev, [question.id]: true }));
    setTimeout(() => {
      setSubmittedFeedback((prev) => ({ ...prev, [question.id]: false }));
    }, 4000);
  };

  const toggleTopicCompletion = () => {
    const updatedCompleted = isTopicDone
      ? completedList.filter((id) => id !== topic.id)
      : [...completedList, topic.id];

    const todayStr = getTodayDateString();
    const activeDates = new Set(currentUser?.activeDates || []);
    if (!isTopicDone) activeDates.add(todayStr);

    updateUser({
      ...currentUser,
      completed: updatedCompleted,
      activeDates: Array.from(activeDates)
    });
  };

  return (
    <section className="page narrow">
      <Link className="back-link" to="/topics">
        ← Back to Practice Library
      </Link>

      <div className="detail-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span className="pill">{topic.type}</span>
          <button
            className={`complete-button ${isTopicDone ? "done" : ""}`}
            onClick={toggleTopicCompletion}
          >
            {isTopicDone ? "✓ Topic Mastered" : "Mark as Completed"}
          </button>
        </div>

        <h2>{topic.title}</h2>
        <p>{topic.description}</p>

        <div className="practice-section">
          <h3 style={{ marginBottom: "16px", fontSize: "20px" }}>
            Practice Problems ({topic.questions?.length || 0})
          </h3>

          {topic.questions?.map((q, idx) => {
            const isOpen = openProblemId === q.id;
            const hasSubmitted = currentUser?.submissions?.some((s) => s.questionId === q.id);

            return (
              <div className="problem-accordion" key={q.id}>
                <div
                  className="problem-header"
                  onClick={() => setOpenProblemId(isOpen ? null : q.id)}
                >
                  <div className="problem-title">
                    <span style={{ color: "var(--primary)", fontWeight: 800 }}>#{idx + 1}</span>
                    <span>{q.title}</span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    {hasSubmitted && <span className="status-tag accepted">✓ Solved</span>}
                    <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                      {isOpen ? "▲ Hide Workspace" : "▼ Solve & Submit"}
                    </span>
                  </div>
                </div>

                {isOpen && (
                  <div className="problem-body">
                    <p className="problem-prompt">{q.prompt}</p>

                    {q.sampleTest && (
                      <div className="sample-test-box">
                        <strong>Test Case / Notes:</strong> {q.sampleTest}
                      </div>
                    )}

                    <div className="code-workspace">
                      <div className="workspace-toolbar">
                        <span>Solution Code Editor (ES6+ JavaScript)</span>
                        <span>Auto-syntax Ready</span>
                      </div>
                      <textarea
                        className="code-editor-area"
                        value={getDraftCode(q)}
                        onChange={(e) => handleCodeChange(q.id, e.target.value)}
                        placeholder="Write your code or explanation here..."
                        rows={10}
                      />
                    </div>

                    <div className="code-actions-row">
                      {submittedFeedback[q.id] ? (
                        <span className="submission-status-badge">
                          🎉 Solution Accepted & Logged!
                        </span>
                      ) : (
                        <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                          Submitting awards streak points & logs to your history.
                        </span>
                      )}

                      <button
                        className="primary-button"
                        onClick={() => handleSubmitCode(q)}
                      >
                        Submit Solution ✓
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   SUBMISSIONS LOG PAGE
========================================================= */

function SubmissionsLog({ currentUser }) {
  const submissions = currentUser?.submissions || [];

  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">MY SUBMISSION HISTORY</p>
          <h2>Recorded Practice Submissions</h2>
          <p>Track your solution code, execution timestamps, and problem history.</p>
        </div>
        <Link className="primary-button" to="/topics">
          + Solve More Problems
        </Link>
      </div>

      {submissions.length === 0 ? (
        <div style={{
          textAlign: "center",
          padding: "60px 20px",
          background: "var(--bg-surface)",
          border: "1px solid var(--border-main)",
          borderRadius: "var(--radius-lg)"
        }}>
          <h3 style={{ marginBottom: "8px" }}>No Submissions Found</h3>
          <p style={{ color: "var(--text-muted)", marginBottom: "20px" }}>
            You haven't submitted any code solutions yet. Visit the Practice Library to get started!
          </p>
          <Link className="primary-button" to="/topics">
            Browse Practice Library
          </Link>
        </div>
      ) : (
        <div className="submissions-table-container">
          <table className="submissions-table">
            <thead>
              <tr>
                <th>Problem</th>
                <th>Topic</th>
                <th>Language</th>
                <th>Submitted At</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {submissions.slice().reverse().map((sub) => (
                <tr key={sub.id}>
                  <td><strong>{sub.questionTitle}</strong></td>
                  <td><span className="pill">{sub.topicTitle}</span></td>
                  <td style={{ fontFamily: "var(--font-mono)", fontSize: "13px" }}>{sub.language || "javascript"}</td>
                  <td style={{ color: "var(--text-muted)", fontSize: "13px" }}>{sub.submittedAt}</td>
                  <td><span className="status-tag accepted">✓ {sub.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

/* =========================================================
   ROADMAP & MINI PROJECTS
========================================================= */

function Roadmap() {
  return (
    <section className="page">
      <p className="eyebrow">SYLLABUS & LEARNING TIMELINE</p>
      <h2>2nd-Year Full-Stack Roadmap</h2>
      <p className="section-intro">
        Structured 6-week curriculum covering Core Web Fundamentals, Modern ES6+, React Hooks, and Deployment.
      </p>

      <div className="timeline">
        {roadmap.map((item) => (
          <article className="timeline-card" key={item.week}>
            <span>{item.week}</span>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <h3>{item.title}</h3>
                <span className="pill">{item.tag}</span>
              </div>
              <div className="tag-list">
                {item.items.map((skill) => (
                  <span key={skill}>{skill}</span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>

      <div style={{ marginTop: "50px" }}>
        <p className="eyebrow">HANDS-ON PRACTICE</p>
        <h2>Recommended College Mini Projects</h2>
        <p className="section-intro">
          Build these projects to build a strong portfolio and ace your semester evaluations.
        </p>

        <div className="mini-projects-grid">
          {miniProjects.map((proj) => (
            <article className="saved-project" key={proj.id} style={{ display: "block" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <h3 style={{ fontSize: "18px" }}>{proj.title}</h3>
                <span className="pill">{proj.syllabusWeek}</span>
              </div>
              <p style={{ color: "var(--text-muted)", fontSize: "14px", margin: "8px 0" }}>
                {proj.description}
              </p>
              <div className="project-tech">
                {proj.technologies.split(",").map((tech) => (
                  <span key={tech} className="tech-tag">{tech.trim()}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   MOCK INTERVIEW
========================================================= */

function MockInterview({ currentUser, updateUser }) {
  const [current, setCurrent] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);

  const question = mockQuestions[current];

  const handleNext = (awardedPoint) => {
    if (awardedPoint) {
      setScore((s) => s + 1);
    }
    setShowAnswer(false);
    setCurrent((c) => (c + 1) % mockQuestions.length);

    const todayStr = getTodayDateString();
    const activeDates = new Set(currentUser?.activeDates || []);
    activeDates.add(todayStr);
    updateUser({
      ...currentUser,
      activeDates: Array.from(activeDates)
    });
  };

  return (
    <section className="page narrow">
      <p className="eyebrow">INTERVIEW FLASHCARDS</p>
      <h2>Mock Interview Practice</h2>
      <p className="section-intro">
        Formulate your technical explanation in your head first, then reveal the model response.
      </p>

      <div className="interview-card">
        <div className="question-number">
          Question {current + 1} of {mockQuestions.length}
        </div>

        <span className="pill">{question.topic}</span>
        <h3>{question.question}</h3>

        {showAnswer && (
          <div className="answer-box">
            <strong>Sample Model Answer:</strong>
            <p style={{ marginTop: "6px" }}>{question.answer}</p>
          </div>
        )}

        <div className="interview-actions">
          <button
            className="secondary-button"
            onClick={() => setShowAnswer(!showAnswer)}
          >
            {showAnswer ? "Hide Model Answer" : "Reveal Answer 💡"}
          </button>

          <button
            className="primary-button"
            onClick={() => handleNext(true)}
          >
            I Knew This (+1 Pt) →
          </button>

          <button
            className="complete-button"
            onClick={() => handleNext(false)}
          >
            Skip / Need Revision
          </button>
        </div>

        <div style={{ marginTop: "18px", fontSize: "14px", color: "var(--text-muted)" }}>
          Session Self-Score: <strong style={{ color: "var(--primary)" }}>{score}</strong>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   RESUME BUILDER & PREVIEW
========================================================= */

function Resume({ currentUser, updateUser }) {
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectTech, setProjectTech] = useState("");
  const [savedMsg, setSavedMsg] = useState(false);

  const projects = currentUser?.projects || [];
  const profile = currentUser?.profile || {};

  const handleAddProject = (e) => {
    e.preventDefault();
    if (!projectName.trim() || !projectDescription.trim()) return;

    const newProject = {
      id: Date.now(),
      name: projectName.trim(),
      description: projectDescription.trim(),
      technologies: projectTech.trim()
    };

    const updatedProjects = [...projects, newProject];
    const todayStr = getTodayDateString();
    const activeDates = new Set(currentUser?.activeDates || []);
    activeDates.add(todayStr);

    updateUser({
      ...currentUser,
      projects: updatedProjects,
      activeDates: Array.from(activeDates)
    });

    setProjectName("");
    setProjectDescription("");
    setProjectTech("");
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2500);
  };

  const handleDeleteProject = (id) => {
    const updated = projects.filter((p) => p.id !== id);
    updateUser({
      ...currentUser,
      projects: updated
    });
  };

  return (
    <section className="page">
      <p className="eyebrow">RESUME & PORTFOLIO BUILDER</p>
      <h2>Build an Interview-Ready Tech Resume</h2>
      <p className="section-intro">
        Add your college projects and technical skills. They will automatically render in the printable resume sheet below.
      </p>

      <div className="resume-builder-grid">
        <section className="panel">
          <h3 style={{ marginBottom: "16px" }}>Tech Resume Best Practices</h3>
          {resumeTips.map((tip, idx) => (
            <div className="mini-task" key={tip} style={{ marginBottom: "8px" }}>
              <span style={{ color: "var(--primary)", fontWeight: 800 }}>#{idx + 1}</span>
              <span>{tip}</span>
            </div>
          ))}
        </section>

        <section className="panel">
          <h3 style={{ marginBottom: "16px" }}>+ Add Project to Resume</h3>
          <form onSubmit={handleAddProject} className="project-form">
            <label>
              Project Name *
              <input
                required
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="e.g. NextOffer Placement Platform"
              />
            </label>

            <label>
              Summary / Impact *
              <textarea
                required
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                placeholder="Engineered a responsive React platform with auth, custom hooks, and dark mode..."
                rows={3}
              />
            </label>

            <label>
              Technologies Used
              <input
                value={projectTech}
                onChange={(e) => setProjectTech(e.target.value)}
                placeholder="e.g. React, React Router, JavaScript ES6+, CSS Grid"
              />
            </label>

            <button className="primary-button" type="submit">
              Save Project to Resume
            </button>

            {savedMsg && (
              <p style={{ color: "var(--success)", fontWeight: 700, fontSize: "14px" }}>
                ✓ Project added to resume preview!
              </p>
            )}
          </form>
        </section>
      </div>

      <section style={{ marginTop: "40px" }}>
        <h3 style={{ fontSize: "22px", marginBottom: "16px" }}>
          Saved Projects ({projects.length})
        </h3>

        {projects.length === 0 ? (
          <p style={{ color: "var(--text-muted)" }}>
            No projects added yet. Use the form above to add your first project.
          </p>
        ) : (
          <div className="saved-projects">
            {projects.map((p) => (
              <article className="saved-project" key={p.id}>
                <div>
                  <h3 style={{ fontSize: "17px" }}>{p.name}</h3>
                  <p style={{ color: "var(--text-muted)", fontSize: "14px", margin: "6px 0" }}>
                    {p.description}
                  </p>
                  {p.technologies && (
                    <div className="project-tech">
                      {p.technologies.split(",").map((tech) => (
                        <span key={tech} className="tech-tag">{tech.trim()}</span>
                      ))}
                    </div>
                  )}
                </div>
                <button className="delete-btn" onClick={() => handleDeleteProject(p.id)}>
                  Delete
                </button>
              </article>
            ))}
          </div>
        )}
      </section>

      <section style={{ marginTop: "40px" }}>
        <h3 style={{ fontSize: "22px", marginBottom: "16px" }}>Live Resume Preview</h3>
        <div className="resume-paper">
          <div className="resume-header">
            <h1>{profile.name || currentUser?.name || "Your Full Name"}</h1>
            <p>
              {profile.email || currentUser?.email || "student@college.edu"} • {profile.phone || "+91 98765 43210"}
            </p>
            {profile.college && (
              <p style={{ color: "var(--primary)", fontWeight: 600 }}>{profile.college}</p>
            )}
          </div>

          <div className="resume-block">
            <h2>Technical Skills</h2>
            <p style={{ color: "var(--text-main)", fontSize: "14px" }}>
              {profile.skills || "JavaScript (ES6+), React.js, HTML5, CSS3, Flexbox/Grid, Git/GitHub, Data Structures"}
            </p>
          </div>

          <div className="resume-block">
            <h2>Projects</h2>
            {projects.length === 0 ? (
              <p style={{ color: "var(--text-muted)", fontStyle: "italic", fontSize: "14px" }}>
                Your saved projects will be listed here automatically.
              </p>
            ) : (
              projects.map((p) => (
                <div className="resume-project" key={p.id}>
                  <div className="resume-project-heading">
                    <strong>{p.name}</strong>
                    {p.technologies && <span>{p.technologies}</span>}
                  </div>
                  <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>{p.description}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </section>
  );
}

/* =========================================================
   PROFILE EDITING
========================================================= */

function Profile({ currentUser, updateUser }) {
  const profile = currentUser?.profile || {};

  const [name, setName] = useState(profile.name || currentUser?.name || "");
  const [email, setEmail] = useState(profile.email || currentUser?.email || "");
  const [phone, setPhone] = useState(profile.phone || "");
  const [college, setCollege] = useState(profile.college || "");
  const [skills, setSkills] = useState(profile.skills || "");
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedUser = {
      ...currentUser,
      name: name.trim(),
      profile: {
        ...profile,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        college: college.trim(),
        skills: skills.trim()
      }
    };

    updateUser(updatedUser);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <section className="page narrow">
      <p className="eyebrow">STUDENT PROFILE</p>
      <h2>Manage Account & Profile</h2>
      <p className="section-intro">
        Your profile data is stored securely per user account and used in your resume preview.
      </p>

      <div className="profile-layout">
        <section className="profile-card">
          <div className="large-avatar">
            {name ? name.charAt(0).toUpperCase() : "U"}
          </div>
          <h3 style={{ fontSize: "20px" }}>{name || "Student Name"}</h3>
          <p style={{ color: "var(--text-muted)", fontSize: "14px", marginTop: "4px" }}>
            {email || currentUser?.email}
          </p>
          <div style={{ marginTop: "16px" }}>
            <span className="pill">{college || "2nd Year Computer Science"}</span>
          </div>
        </section>

        <form className="profile-form" onSubmit={handleSubmit}>
          <label>
            Full Name *
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
            />
          </label>

          <label>
            College / University
            <input
              value={college}
              onChange={(e) => setCollege(e.target.value)}
              placeholder="e.g. ABC Institute of Technology"
            />
          </label>

          <label>
            Phone Number
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
            />
          </label>

          <label>
            Technical Skills Summary
            <textarea
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="e.g. JavaScript, React, DSA, CSS Flexbox, Git"
              rows={3}
            />
          </label>

          <button className="primary-button" type="submit">
            Save Profile Changes
          </button>

          {saved && (
            <p style={{ color: "var(--success)", fontWeight: 700, fontSize: "14px" }}>
              ✓ Profile saved successfully!
            </p>
          )}
        </form>
      </div>
    </section>
  );
}

/* =========================================================
   LOGIN & SIGNUP (MULTI-USER ENGINE)
========================================================= */

function Login({ onLoginSuccess }) {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const normalizedEmail = email.trim().toLowerCase();
    const users = getUsersDB();

    if (mode === "create") {
      if (!name.trim()) {
        setError("Please enter your full name.");
        return;
      }
      if (!normalizedEmail) {
        setError("Please provide a valid email.");
        return;
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
      }

      const existing = users.find((u) => u.email.toLowerCase() === normalizedEmail);
      if (existing) {
        setError("An account with this email already exists. Please log in.");
        return;
      }

      const newUser = {
        id: `usr_${Date.now()}`,
        name: name.trim(),
        email: normalizedEmail,
        password: password,
        profile: {
          name: name.trim(),
          email: normalizedEmail,
          phone: "",
          college: "",
          skills: "JavaScript, React, HTML5, CSS3, Data Structures"
        },
        completed: [],
        submissions: [],
        projects: [],
        activeDates: [getTodayDateString()]
      };

      const updatedUsers = [...users, newUser];
      saveUsersDB(updatedUsers);
      onLoginSuccess(newUser);
      navigate("/dashboard");
      return;
    }

    // LOGIN MODE
    const user = users.find((u) => u.email.toLowerCase() === normalizedEmail);
    if (!user) {
      setError("No account found with this email. Please create an account.");
      return;
    }

    if (user.password !== password) {
      setError("Incorrect password. Please try again.");
      return;
    }

    const todayStr = getTodayDateString();
    const activeDates = new Set(user.activeDates || []);
    activeDates.add(todayStr);
    user.activeDates = Array.from(activeDates);

    saveUsersDB(users);
    onLoginSuccess(user);
    navigate("/dashboard");
  };

  return (
    <section className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <Link className="brand" to="/">
          ⚡ Next<span>Offer</span>
        </Link>

        <h2>{mode === "login" ? "Welcome Back" : "Create Student Account"}</h2>
        <p style={{ color: "var(--text-muted)", fontSize: "14px", marginTop: "4px" }}>
          {mode === "login"
            ? "Log in to access your saved submissions, streak, and resume."
            : "Sign up to track your syllabus progress and placement practice."}
        </p>

        {mode === "create" && (
          <label style={{ marginTop: "14px" }}>
            Full Name *
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Aarav Sharma"
            />
          </label>
        )}

        <label style={{ marginTop: mode === "login" ? "14px" : "0" }}>
          Email Address *
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="student@college.edu"
          />
        </label>

        <label>
          Password *
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={mode === "create" ? "Min. 6 characters" : "••••••••"}
          />
        </label>

        {error && <div className="form-error">{error}</div>}

        <button className="primary-button full" type="submit" style={{ marginTop: "10px" }}>
          {mode === "login" ? "Log In →" : "Create Account →"}
        </button>

        <div className="login-switch">
          {mode === "login" ? (
            <>
              Don't have an account?
              <button type="button" onClick={() => { setMode("create"); setError(""); }}>
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?
              <button type="button" onClick={() => { setMode("login"); setError(""); }}>
                Log in
              </button>
            </>
          )}
        </div>
      </form>
    </section>
  );
}

/* =========================================================
   404 NOT FOUND PAGE
========================================================= */

function NotFound() {
  return (
    <section className="page narrow" style={{ textAlign: "center", padding: "80px 20px" }}>
      <h1 style={{ fontSize: "72px", fontWeight: 900, color: "var(--primary)" }}>404</h1>
      <h2>Looks like this page missed the interview.</h2>
      <p style={{ color: "var(--text-muted)", margin: "16px 0 24px" }}>
        The requested URL was not found on this server.
      </p>
      <Link className="primary-button" to="/">
        Return to Home
      </Link>
    </section>
  );
}

/* =========================================================
   ROOT APP COMPONENT
========================================================= */

export default function App() {
  const [theme, toggleTheme] = useTheme();
  const [currentEmail, setCurrentEmail] = useLocalStorage(SESSION_KEY, null);

  const [users, setUsers] = useState(() => getUsersDB());

  const currentUser = useMemo(() => {
    if (!currentEmail) return null;
    return users.find((u) => u.email.toLowerCase() === currentEmail.toLowerCase()) || null;
  }, [users, currentEmail]);

  const updateUser = useCallback((updatedUser) => {
    const updatedList = users.map((u) =>
      u.email.toLowerCase() === updatedUser.email.toLowerCase() ? updatedUser : u
    );
    setUsers(updatedList);
    saveUsersDB(updatedList);
  }, [users]);

  const handleLoginSuccess = (user) => {
    const existing = users.find((u) => u.email.toLowerCase() === user.email.toLowerCase());
    let updatedList;
    if (existing) {
      updatedList = users.map((u) =>
        u.email.toLowerCase() === user.email.toLowerCase() ? user : u
      );
    } else {
      updatedList = [...users, user];
    }
    setUsers(updatedList);
    saveUsersDB(updatedList);
    setCurrentEmail(user.email);
  };

  const handleLogout = () => {
    setCurrentEmail(null);
  };

  return (
    <Routes>
      <Route
        path="/login"
        element={
          currentUser ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Login onLoginSuccess={handleLoginSuccess} />
          )
        }
      />

      <Route
        element={
          <Layout
            currentUser={currentUser}
            onLogout={handleLogout}
            theme={theme}
            toggleTheme={toggleTheme}
          />
        }
      >
        <Route index element={<Home currentUser={currentUser} />} />

        <Route element={<ProtectedRoute currentUser={currentUser} />}>
          <Route
            path="dashboard"
            element={
              <Dashboard
                currentUser={currentUser}
                updateUser={updateUser}
              />
            }
          />

          <Route
            path="topics"
            element={
              <Topics
                currentUser={currentUser}
                updateUser={updateUser}
              />
            }
          />

          <Route
            path="topics/:topicId"
            element={
              <TopicDetails
                currentUser={currentUser}
                updateUser={updateUser}
              />
            }
          />

          <Route
            path="submissions"
            element={
              <SubmissionsLog
                currentUser={currentUser}
              />
            }
          />

          <Route
            path="roadmap"
            element={<Roadmap />}
          />

          <Route
            path="mock-interview"
            element={
              <MockInterview
                currentUser={currentUser}
                updateUser={updateUser}
              />
            }
          />

          <Route
            path="resume"
            element={
              <Resume
                currentUser={currentUser}
                updateUser={updateUser}
              />
            }
          />

          <Route
            path="profile"
            element={
              <Profile
                currentUser={currentUser}
                updateUser={updateUser}
              />
            }
          />
        </Route>

        <Route path="404" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}