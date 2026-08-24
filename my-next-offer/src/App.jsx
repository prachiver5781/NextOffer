import React, { useState, useMemo, useCallback } from "react";

import {
  Routes,
  Route,
  Link,
  NavLink,
  Navigate,
  Outlet,
  useNavigate,
  useParams,
  useLocation,
} from "react-router-dom";

import {
  defaultProfile,
  dailyChallenge,
  continueLearningList,
  topics,
  roadmap,
} from "./data";

import {
  useLocalStorage,
  useTheme,
  getTodayDateString,
  calculateStreak,
} from "./hooks";

/* =========================================================
   VALIDATION HELPERS
========================================================= */

export const EMAIL_REGEX =
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export function isValidEmail(email) {
  return EMAIL_REGEX.test(email.trim());
}

/* =========================================================
   NUMBER INPUT
========================================================= */

export function StrictNumberInput({
  value,
  onChange,
  placeholder = "Enter numbers only",
  maxLength,
  className = "custom-input",
  required = false,
  id,
  name,
}) {
  const handleKeyDown = (e) => {
    const allowedKeys = [
      "Backspace",
      "Delete",
      "Tab",
      "Escape",
      "Enter",
      "ArrowLeft",
      "ArrowRight",
      "Home",
      "End",
    ];

    if (allowedKeys.includes(e.key) || e.ctrlKey || e.metaKey) {
      return;
    }

    if (!/^[0-9]$/.test(e.key)) {
      e.preventDefault();
    }
  };

  const handleChange = (e) => {
    const numbersOnly = e.target.value.replace(/\D/g, "");

    if (maxLength && numbersOnly.length > maxLength) {
      onChange(numbersOnly.slice(0, maxLength));
    } else {
      onChange(numbersOnly);
    }
  };

  return (
    <input
      id={id}
      name={name}
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      className={className}
      required={required}
      autoComplete="off"
    />
  );
}

/* =========================================================
   EMAIL INPUT
========================================================= */

export function StrictEmailInput({
  value,
  onChange,
  placeholder = "name@example.com",
  className = "custom-input",
  required = false,
  id,
  name,
  showStatus = true,
}) {
  const isFilled = value.trim().length > 0;
  const valid = isValidEmail(value);

  const handleChange = (e) => {
    onChange(e.target.value.replace(/\s/g, ""));
  };

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <input
        id={id}
        name={name}
        type="email"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className={`${className} ${
          isFilled ? (valid ? "valid" : "invalid") : ""
        }`}
        required={required}
        autoComplete="email"
      />

      {showStatus && isFilled && (
        <span
          className={`field-validation-msg ${
            valid ? "success" : "error"
          }`}
          style={{ display: "block", marginTop: "4px" }}
        >
          {valid
            ? "✓ Valid email format"
            : "⚠ Please enter a valid email address (e.g. name@domain.com)"}
        </span>
      )}
    </div>
  );
}

/* =========================================================
   USER STORAGE
========================================================= */

const USERS_STORAGE_KEY = "nextoffer_users_list";
const SESSION_STORAGE_KEY = "nextoffer_active_session";

const INITIAL_USER = {
  id: "user_vanshika",
  name: defaultProfile.name,
  email: defaultProfile.email,
  password: "password123",

  profile: defaultProfile,

  completed: ["arrays", "javascript-es6"],

  submissions: [
    {
      id: "sub_1",
      topicId: "arrays",
      topicTitle: "Arrays & Searching",
      questionId: "arr-1",
      questionTitle: "Two Sum",
      code: `function twoSum(nums, target) {
  const map = new Map();

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];

    if (map.has(complement)) {
      return [map.get(complement), i];
    }

    map.set(nums[i], i);
  }

  return [];
}`,
      language: "javascript",
      status: "Accepted",
      submittedAt: "Yesterday, 8:45 PM",
    },

    {
      id: "sub_2",
      topicId: "arrays",
      topicTitle: "Arrays & Searching",
      questionId: "arr-2",
      questionTitle: "Find the Largest and Second Largest Element",
      code: `function findTwoLargest(arr) {
  let first = -Infinity;
  let second = -Infinity;

  for (let num of arr) {
    if (num > first) {
      second = first;
      first = num;
    } else if (num > second && num !== first) {
      second = num;
    }
  }

  return {
    largest: first,
    secondLargest: second
  };
}`,
      language: "javascript",
      status: "Accepted",
      submittedAt: "2 days ago, 6:15 PM",
    },

    {
      id: "sub_3",
      topicId: "strings",
      topicTitle: "Strings & Frequency Counting",
      questionId: "str-1",
      questionTitle: "Valid Palindrome Check",
      code: `function isPalindrome(s) {
  const clean = s
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

  return clean === clean.split("").reverse().join("");
}`,
      language: "javascript",
      status: "Accepted",
      submittedAt: "3 days ago, 4:20 PM",
    },
  ],

  projects: [
    {
      id: 1,
      name: "AI Resume Analyzer",
      description:
        "Automated candidate resume parsing and scoring system using React and NLP.",
      technologies: "React, Python, FastAPI, Tailwind",
    },

    {
      id: 2,
      name: "NextOffer Placement Platform",
      description:
        "Full-stack student coding and career roadmap ecosystem with resume generator.",
      technologies: "React, ES6+, CSS Grid, Vite",
    },
  ],

  activeDates: [
    getTodayDateString(),
    "2026-08-22",
    "2026-08-21",
    "2026-08-20",
    "2026-08-19",
    "2026-08-18",
    "2026-08-17",
  ],
};

function loadUsersFromStorage() {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);

    if (!raw) {
      const initial = [INITIAL_USER];

      localStorage.setItem(
        USERS_STORAGE_KEY,
        JSON.stringify(initial)
      );

      return initial;
    }

    return JSON.parse(raw);
  } catch (error) {
    console.error("Failed to load users:", error);
    return [INITIAL_USER];
  }
}

function saveUsersToStorage(users) {
  try {
    localStorage.setItem(
      USERS_STORAGE_KEY,
      JSON.stringify(users)
    );
  } catch (error) {
    console.error("Failed to save users:", error);
  }
}

/* =========================================================
   LAYOUT
========================================================= */

function Layout({
  currentUser,
  onLogout,
  theme,
  toggleTheme,
}) {
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const streak = calculateStreak(
    currentUser?.activeDates || [getTodayDateString()]
  );

  const showToast = (message) => {
    setToastMessage(message);

    setTimeout(() => {
      setToastMessage("");
    }, 3000);
  };

  const currentPath = location.pathname;

  let breadcrumbLabel = "HOME";
  let pageTitle = "Dashboard";

  if (currentPath.includes("profile")) {
    breadcrumbLabel = "PROFILE";
    pageTitle = "Profile";
  } else if (currentPath.includes("topics")) {
    breadcrumbLabel = "PRACTICE LIBRARY";
    pageTitle = "Practice Library";
  } else if (currentPath.includes("submissions")) {
    breadcrumbLabel = "SUBMISSIONS";
    pageTitle = "Submitted Solutions";
  } else if (currentPath.includes("roadmap")) {
    breadcrumbLabel = "ROADMAP";
    pageTitle = "Learning Roadmap";
  } else if (
    currentPath.includes("projects") ||
    currentPath.includes("resume")
  ) {
    breadcrumbLabel = "PROJECTS";
    pageTitle = "Projects & Resume";
  }

  const userInitials = useMemo(() => {
    const name =
      currentUser?.profile?.name ||
      currentUser?.name ||
      "VG";

    return name
      .split(" ")
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }, [currentUser]);

  return (
    <div className="devsphere-layout">

      {/* Sidebar */}

      <aside className="devsphere-sidebar">

        <Link
          className="sidebar-brand"
          to="/dashboard"
        >
          <div className="brand-icon-box">
            ⚡
          </div>

          <div className="brand-info">
            <h2>
              Next<span>Offer</span>
            </h2>

            <p>
              Career & Placement Platform
            </p>
          </div>
        </Link>

        {/* User Preview */}

        <Link
          className="sidebar-user-card"
          to="/profile"
        >
          <div className="user-card-left">

            <div className="avatar-initials-small">
              {userInitials}
            </div>

            <div className="user-card-details">
              <h4>
                {currentUser?.profile?.name ||
                  currentUser?.name ||
                  "Vanshika Goel"}
              </h4>

              <p>
                {currentUser?.profile?.title?.split("·")[0] ||
                  "Frontend Developer"}
              </p>
            </div>
          </div>

          <div
            className="online-dot"
            title="Active"
          />
        </Link>

        {/* Navigation */}

        <div className="sidebar-section-label">
          WORKSPACE
        </div>

        <nav className="sidebar-nav">

          <NavLink
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
            to="/dashboard"
          >
            <span className="nav-icon">📊</span>
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
            to="/topics"
          >
            <span className="nav-icon">📚</span>
            <span>Practice Library</span>
          </NavLink>

          <NavLink
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
            to="/submissions"
          >
            <span className="nav-icon">📝</span>
            <span>Submissions</span>
          </NavLink>

          <NavLink
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
            to="/projects"
          >
            <span className="nav-icon">📁</span>
            <span>Projects</span>
          </NavLink>

          <NavLink
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
            to="/roadmap"
          >
            <span className="nav-icon">🗺️</span>
            <span>Roadmap</span>
          </NavLink>

          <NavLink
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
            to="/profile"
          >
            <span className="nav-icon">👤</span>
            <span>Profile</span>
          </NavLink>

        </nav>

        {/* Sidebar Footer */}

        <div className="sidebar-footer">

          <button
            className="sidebar-action-btn"
            onClick={toggleTheme}
            title="Toggle theme"
          >
            <span>
              {theme === "light"
                ? "🌙 Dark"
                : "☀️ Light"}
            </span>
          </button>

          <button
            className="sidebar-action-btn"
            onClick={onLogout}
          >
            <span>Log out</span>
          </button>

        </div>

      </aside>

      {/* Main Content */}

      <div className="main-content-wrapper">

        <header className="topbar-header">

          <div className="breadcrumbs-container">

            <span className="breadcrumb-path">
              NEXTOFFER / {breadcrumbLabel}
            </span>

            {breadcrumbLabel !== "HOME" && (
              <span className="breadcrumb-title">
                {pageTitle}
              </span>
            )}

          </div>

          <div className="topbar-right">

            {/* Streak */}

            <div
              className="topbar-streak-pill"
              title={`${streak} Day Active Streak`}
            >
              <span>🔥</span>

              <span>
                {streak} {streak === 1 ? "Day" : "Days"}
              </span>
            </div>

            {/* Search */}

            <div className="topbar-search-box">

              <span>🔍</span>

              <input
                type="text"
                placeholder="Search topics, questions..."
                value={searchQuery}
                onChange={(e) =>
                  setSearchQuery(e.target.value)
                }
              />

              <span className="search-shortcut">
                ⌘K
              </span>

            </div>

            {/* Notifications */}

            <button
              className="icon-button"
              onClick={() =>
                setNotificationsOpen(
                  !notificationsOpen
                )
              }
              title="Notifications"
            >
              🔔
              <span className="notification-badge" />
            </button>

            {/* Avatar */}

            <Link
              to="/profile"
              className="topbar-avatar"
              title="View Profile"
            >
              {userInitials}
            </Link>

          </div>

        </header>

        {/* Notifications */}

        {notificationsOpen && (
          <div
            style={{
              position: "fixed",
              top: "70px",
              right: "32px",
              width: "320px",
              background: "var(--bg-surface)",
              border: "1px solid var(--border-main)",
              borderRadius: "var(--radius-lg)",
              padding: "16px",
              zIndex: 1000,
              boxShadow: "var(--shadow-md)",
            }}
          >

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "12px",
              }}
            >
              <strong style={{ fontSize: "14px" }}>
                Notifications
              </strong>

              <button
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--text-muted)",
                  cursor: "pointer",
                }}
                onClick={() =>
                  setNotificationsOpen(false)
                }
              >
                ✕
              </button>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                fontSize: "13px",
              }}
            >

              <div
                style={{
                  padding: "8px",
                  background:
                    "var(--bg-surface-elevated)",
                  borderRadius: "6px",
                }}
              >
                🎉 Solution accepted for{" "}
                <strong>Two Sum</strong>!
              </div>

              <div
                style={{
                  padding: "8px",
                  background:
                    "var(--bg-surface-elevated)",
                  borderRadius: "6px",
                }}
              >
                🔥 {streak}-Day learning streak maintained.
              </div>

            </div>
          </div>
        )}

        <main className="page-container">
          <Outlet
            context={{
              showToast,
              searchQuery,
            }}
          />
        </main>

      </div>

      {toastMessage && (
        <div className="toast-popup">
          ✓ {toastMessage}
        </div>
      )}

    </div>
  );
}

/* =========================================================
   PROTECTED ROUTE
========================================================= */

function ProtectedRoute({ currentUser }) {
  return currentUser ? (
    <Outlet />
  ) : (
    <Navigate
      to="/login"
      replace
    />
  );
}

/* =========================================================
   DASHBOARD
========================================================= */

function Dashboard({ currentUser }) {
  const navigate = useNavigate();

  const streak = calculateStreak(
    currentUser?.activeDates || [getTodayDateString()]
  );

  const userName =
    currentUser?.profile?.name ||
    currentUser?.name ||
    "Vanshika";

  const firstName = userName.split(" ")[0];

  const submissions =
    currentUser?.submissions || [];

  return (
    <section>

      <div style={{ marginBottom: "20px" }}>
        <h2
          style={{
            fontSize: "20px",
            fontWeight: 700,
            color: "var(--text-main)",
          }}
        >
          Good evening, {firstName} 👋
        </h2>
      </div>

      {/* Hero */}

      <div className="dashboard-hero-card">

        <div className="hero-left-content">

          <div className="badge-tag-purple">
            <span>✨</span> YOUR DEVELOPER JOURNEY
          </div>

          <h1>
            Build skills that
            <br />
            compound over time.
          </h1>

          <p>
            Practice coding every day, ship impactful
            projects, and turn your technical consistency
            into job offers.
          </p>

          <div className="hero-btn-group">

            <button
              className="btn-primary-gradient"
              onClick={() => navigate("/topics")}
            >
              Start coding →
            </button>

            <button
              className="btn-secondary-dark"
              onClick={() => navigate("/roadmap")}
            >
              View roadmap
            </button>

          </div>
        </div>

        {/* Radar */}

        <div className="hero-radar-wrapper">

          <div className="orbit-circle orbit-1">
            <div className="orbit-particle particle-1">
              💻
            </div>
          </div>

          <div className="orbit-circle orbit-2">
            <div className="orbit-particle particle-2">
              🚀
            </div>
          </div>

          <div className="orbit-circle orbit-3">
            <div className="orbit-particle particle-3">
              💎
            </div>
          </div>

          <div className="radar-center-badge">
            <span className="streak-num">
              {streak > 0 ? streak : 17}
            </span>

            <span className="streak-lbl">
              Day Streak
            </span>
          </div>

        </div>

      </div>

      {/* Dashboard Cards */}

      <div className="dashboard-horizontal-grid">

        {/* Daily Challenge */}

        <div className="dashboard-panel-card">

          <div className="panel-header-row">

            <div className="panel-title-group">
              <h3>Daily challenge</h3>
              <p>Keep your streak alive</p>
            </div>

            <Link
              to="/topics"
              className="panel-link-text"
            >
              View all →
            </Link>

          </div>

          <div
            className="daily-challenge-box"
            style={{ flex: 1 }}
          >

            <span className="challenge-number-watermark">
              01
            </span>

            <div className="challenge-details">

              <div className="challenge-tags-top">

                <span className="difficulty-badge-easy">
                  EASY
                </span>

                <span
                  style={{
                    fontSize: "11px",
                    color: "var(--text-subtle)",
                  }}
                >
                  {dailyChallenge.acceptance}
                </span>

              </div>

              <h4>
                {dailyChallenge.title}
              </h4>

              <p>
                {dailyChallenge.description}
              </p>

              <div className="tag-pills-row">

                {dailyChallenge.tags
                  .slice(0, 3)
                  .map((tag) => (
                    <span
                      className="tag-pill"
                      key={tag}
                    >
                      {tag}
                    </span>
                  ))}

              </div>

            </div>

            <button
              className="challenge-action-circle"
              onClick={() =>
                navigate("/topics/arrays")
              }
              title="Solve Problem"
            >
              ➔
            </button>

          </div>

        </div>

        {/* Continue Learning */}

        <div className="dashboard-panel-card">

          <div className="panel-header-row">

            <div className="panel-title-group">
              <h3>Continue learning</h3>
              <p>Pick up where you left off</p>
            </div>

            <Link
              to="/topics"
              className="panel-link-text"
            >
              Library →
            </Link>

          </div>

          <div className="continue-learning-list">

            {continueLearningList.map((item) => (
              <div
                className="continue-learning-item"
                key={item.id}
                onClick={() => navigate("/topics")}
              >

                <span className="cl-icon">
                  {item.icon}
                </span>

                <div className="cl-progress-info">

                  <div className="cl-title-row">
                    <strong>{item.title}</strong>
                    <span>{item.progress}%</span>
                  </div>

                  <div className="progress-bar-track">

                    <div
                      className="progress-bar-fill"
                      style={{
                        width: `${item.progress}%`,
                      }}
                    />

                  </div>

                </div>

                <span className="cl-arrow">
                  ➔
                </span>

              </div>
            ))}

          </div>

        </div>

      </div>

      {/* Recent Submissions */}

      <div className="dashboard-panel-card">

        <div className="panel-header-row">

          <div className="panel-title-group">
            <h3>Recent Submissions</h3>
            <p>
              Your recorded code solutions and status
            </p>
          </div>

          <Link
            to="/submissions"
            className="panel-link-text"
          >
            View all submissions ({submissions.length}) →
          </Link>

        </div>

        {submissions.length === 0 ? (
          <div
            style={{
              padding: "20px 0",
              color: "var(--text-muted)",
              fontSize: "13.5px",
            }}
          >
            No submissions recorded yet. Head over to
            the Practice Library to solve your first
            question!
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "14px",
            }}
          >
            {submissions
              .slice(-3)
              .reverse()
              .map((sub) => (
                <div
                  key={sub.id}
                  style={{
                    background:
                      "var(--bg-surface-elevated)",
                    padding: "16px",
                    borderRadius: "10px",
                    border:
                      "1px solid var(--border-main)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >

                  <div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "8px",
                      }}
                    >
                      <span className="tag-pill">
                        {sub.topicTitle || "DSA"}
                      </span>

                      <span className="status-badge-accepted">
                        ✓ {sub.status}
                      </span>
                    </div>

                    <h4
                      style={{
                        fontSize: "14.5px",
                        fontWeight: 700,
                        color: "var(--text-main)",
                        marginBottom: "4px",
                      }}
                    >
                      {sub.questionTitle}
                    </h4>

                    <p
                      style={{
                        fontSize: "11.5px",
                        color: "var(--text-muted)",
                      }}
                    >
                      {sub.submittedAt}
                    </p>

                  </div>

                  <Link
                    to="/submissions"
                    className="view-code-btn"
                    style={{
                      alignSelf: "flex-start",
                      marginTop: "12px",
                    }}
                  >
                    View Code →
                  </Link>

                </div>
              ))}
          </div>
        )}

      </div>

    </section>
  );
}

/* =========================================================
   SUBMISSIONS
========================================================= */

function SubmissionsView({ currentUser }) {
  const [filter, setFilter] = useState("All");
  const [selectedSubmission, setSelectedSubmission] =
    useState(null);

  const submissions =
    currentUser?.submissions || [];

  const filtered = useMemo(() => {
    if (filter === "All") {
      return submissions;
    }

    return submissions.filter((submission) =>
      submission.topicTitle
        ?.toLowerCase()
        .includes(filter.toLowerCase())
    );
  }, [submissions, filter]);

  return (
    <section>

      <div style={{ marginBottom: "24px" }}>

        <div className="badge-tag-purple">
          📝 RECORDED PRACTICE
        </div>

        <h1
          style={{
            fontSize: "28px",
            fontWeight: 800,
            color: "var(--text-main)",
            marginBottom: "6px",
          }}
        >
          Code Submissions & Solutions
        </h1>

        <p
          style={{
            color: "var(--text-muted)",
            fontSize: "14px",
          }}
        >
          Review your submitted algorithms,
          execution timestamps, and accepted solutions.
        </p>

      </div>

      <div className="topic-filters-bar">

        {[
          "All",
          "Arrays",
          "Strings",
          "JavaScript",
          "React",
        ].map((category) => (
          <button
            key={category}
            className={`topic-category-pill ${
              filter === category ? "active" : ""
            }`}
            onClick={() => setFilter(category)}
          >
            {category}
          </button>
        ))}

      </div>

      <div className="submissions-table-card">

        {filtered.length === 0 ? (
          <div
            style={{
              padding: "48px 24px",
              textAlign: "center",
              color: "var(--text-muted)",
            }}
          >
            <h3>No submissions found</h3>

            <p
              style={{
                marginTop: "8px",
                fontSize: "13.5px",
              }}
            >
              Solve problems in the Practice Library
              to log your code solutions here.
            </p>

            <Link
              to="/topics"
              className="btn-primary-gradient"
              style={{
                marginTop: "16px",
                display: "inline-flex",
              }}
            >
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

              {filtered
                .slice()
                .reverse()
                .map((submission) => (
                  <tr key={submission.id}>

                    <td>
                      <strong>
                        {submission.questionTitle}
                      </strong>
                    </td>

                    <td>
                      <span className="tag-pill">
                        {submission.topicTitle || "DSA"}
                      </span>
                    </td>

                    <td>
                      <span
                        style={{
                          fontFamily:
                            "var(--font-mono)",
                          fontSize: "12.5px",
                          color: "var(--cyan)",
                        }}
                      >
                        {submission.language ||
                          "javascript"}
                      </span>
                    </td>

                    <td
                      style={{
                        color: "var(--text-muted)",
                        fontSize: "13px",
                      }}
                    >
                      {submission.submittedAt}
                    </td>

                    <td>
                      <span className="status-badge-accepted">
                        ✓ {submission.status}
                      </span>
                    </td>

                    <td>
                      <button
                        className="view-code-btn"
                        onClick={() =>
                          setSelectedSubmission(
                            submission
                          )
                        }
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

      {/* Code Modal */}

      {selectedSubmission && (
        <div className="modal-backdrop">

          <div className="modal-dialog-card wide">

            <div className="modal-header-row">

              <div>
                <span className="badge-tag-purple">
                  {selectedSubmission.topicTitle}
                </span>

                <h3 style={{ marginTop: "4px" }}>
                  {selectedSubmission.questionTitle}
                </h3>
              </div>

              <button
                className="close-modal-btn"
                onClick={() =>
                  setSelectedSubmission(null)
                }
              >
                ✕
              </button>

            </div>

            <div
              style={{
                marginBottom: "16px",
                fontSize: "13px",
                color: "var(--text-muted)",
              }}
            >
              Submitted on{" "}
              <strong>
                {selectedSubmission.submittedAt}
              </strong>{" "}
              • Language:{" "}
              <strong>
                {selectedSubmission.language ||
                  "JavaScript"}
              </strong>
            </div>

            <div
              style={{
                background: "#0a0e1a",
                padding: "16px",
                borderRadius: "10px",
                border:
                  "1px solid var(--border-main)",
                overflowX: "auto",
              }}
            >
              <pre
                style={{
                  fontFamily:
                    "var(--font-mono)",
                  fontSize: "13px",
                  color: "#c7d2fe",
                  lineHeight: "1.6",
                }}
              >
                {selectedSubmission.code ||
                  "// No code captured"}
              </pre>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "20px",
              }}
            >
              <button
                className="btn-primary-gradient"
                onClick={() =>
                  setSelectedSubmission(null)
                }
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

/* =========================================================
   PROFILE
========================================================= */

function Profile({
  currentUser,
  updateUser,
}) {
  const [isEditOpen, setIsEditOpen] =
    useState(false);

  const [toastMessage, setToastMessage] =
    useState("");

  const profile =
    currentUser?.profile || defaultProfile;

  const [editName, setEditName] =
    useState(profile.name || "");

  const [editEmail, setEditEmail] =
    useState(profile.email || "");

  const [editPhone, setEditPhone] =
    useState(profile.phone || "");

  const [editTitle, setEditTitle] =
    useState(
      profile.title ||
        "Frontend & Full Stack Developer · Student Developer"
    );

  const [editLocation, setEditLocation] =
    useState(
      profile.location ||
        "India · Open to internships"
    );

  const [editAbout, setEditAbout] =
    useState(profile.about || "");

  const [editSkills, setEditSkills] =
    useState(
      (profile.skills || []).join(", ")
    );

  const [formError, setFormError] =
    useState("");

  const userInitials = useMemo(() => {
    return (profile.name || "VG")
      .split(" ")
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }, [profile.name]);

  const handleShareProfile = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        window.location.href
      );

      setToastMessage(
        "Profile URL copied to clipboard!"
      );

      setTimeout(() => {
        setToastMessage("");
      }, 3000);
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();

    setFormError("");

    if (!isValidEmail(editEmail)) {
      setFormError(
        "Please enter a valid email address."
      );
      return;
    }

    if (
      editPhone &&
      !/^\d+$/.test(editPhone)
    ) {
      setFormError(
        "Phone number must only contain digits (0-9)."
      );
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
      skills: editSkills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),
    };

    updateUser({
      ...currentUser,
      name: editName.trim(),
      email: editEmail.trim(),
      profile: updatedProfile,
    });

    setIsEditOpen(false);

    setToastMessage(
      "Profile updated successfully!"
    );

    setTimeout(() => {
      setToastMessage("");
    }, 3000);
  };

  return (
    <section>

      {/* Banner */}

      <div className="profile-hero-banner">

        <div className="profile-banner-top">

          <div className="profile-identity-group">

            <div className="profile-large-avatar">
              {userInitials}
            </div>

            <div className="profile-names-group">

              <h2>
                {profile.name ||
                  "Vanshika Goel"}

                <span
                  className="verified-badge"
                  title="Verified Developer"
                >
                  ✓
                </span>
              </h2>

              <p className="role-title">
                {profile.title ||
                  "Frontend & Full Stack Developer"}
              </p>

              <p className="location-tag">
                📍{" "}
                {profile.location ||
                  "India · Open to internships"}
              </p>

            </div>

          </div>

          <div className="profile-banner-actions">

            <button
              className="btn-secondary-dark"
              onClick={() =>
                setIsEditOpen(true)
              }
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

        {/* Stats */}

        <div className="profile-stats-row">

          <div className="profile-stat-item">
            <strong>
              {profile.stats?.problems || 87}
            </strong>
            <span>Problems</span>
          </div>

          <div className="profile-stat-item">
            <strong>
              {profile.stats?.projects || 12}
            </strong>
            <span>Projects</span>
          </div>

        </div>

      </div>

      {/* Details */}

      <div className="profile-details-grid">

        <div className="dashboard-panel-card">

          <h3
            style={{
              fontSize: "16px",
              fontWeight: 700,
              marginBottom: "12px",
              color: "var(--text-main)",
            }}
          >
            About
          </h3>

          <p className="about-bio-text">
            {profile.about ||
              "Student developer interested in building high-performance web products, solving DSA problems and learning in public. Currently exploring React, JavaScript, and full-stack engineering."}
          </p>

          <h3
            style={{
              fontSize: "16px",
              fontWeight: 700,
              marginBottom: "12px",
              color: "var(--text-main)",
            }}
          >
            Skills
          </h3>

          <div className="skills-pill-container">

            {(profile.skills ||
              defaultProfile.skills
            ).map((skill) => (
              <span
                className="skill-badge-pill"
                key={skill}
              >
                {skill}
              </span>
            ))}

          </div>

        </div>

        <div className="dashboard-panel-card">

          <h3
            style={{
              fontSize: "16px",
              fontWeight: 700,
              marginBottom: "16px",
              color: "var(--text-main)",
            }}
          >
            Achievements
          </h3>

          <div
            style={{
              padding: "40px 20px",
              textAlign: "center",
              border:
                "1px dashed var(--border-main)",
              borderRadius: "var(--radius-md)",
              color: "var(--text-muted)",
            }}
          >
            <span
              style={{
                fontSize: "24px",
                display: "block",
                marginBottom: "8px",
              }}
            >
              🏆
            </span>

            <p style={{ fontSize: "13px" }}>
              No achievements unlocked yet.
            </p>
          </div>

        </div>

      </div>

      {/* Edit Modal */}

      {isEditOpen && (
        <div className="modal-backdrop">

          <div className="modal-dialog-card">

            <div className="modal-header-row">

              <h3>Edit Profile</h3>

              <button
                className="close-modal-btn"
                onClick={() =>
                  setIsEditOpen(false)
                }
              >
                ✕
              </button>

            </div>

            <form
              onSubmit={handleSaveProfile}
              className="custom-form"
            >

              <div className="form-field-group">

                <label>Full Name *</label>

                <input
                  type="text"
                  required
                  className="custom-input"
                  value={editName}
                  onChange={(e) =>
                    setEditName(e.target.value)
                  }
                />

              </div>

              <div className="form-field-group">

                <label>
                  <span>Email Address *</span>

                  <span className="field-constraint-tag">
                    Valid email only
                  </span>
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

                  <span className="field-constraint-tag">
                    Digits only (0-9)
                  </span>
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
                  onChange={(e) =>
                    setEditTitle(e.target.value)
                  }
                />

              </div>

              <div className="form-field-group">

                <label>Location & Status</label>

                <input
                  type="text"
                  className="custom-input"
                  value={editLocation}
                  onChange={(e) =>
                    setEditLocation(e.target.value)
                  }
                />

              </div>

              <div className="form-field-group">

                <label>About Me</label>

                <textarea
                  className="custom-textarea"
                  rows={3}
                  value={editAbout}
                  onChange={(e) =>
                    setEditAbout(e.target.value)
                  }
                />

              </div>

              <div className="form-field-group">

                <label>
                  Skills (comma separated)
                </label>

                <input
                  type="text"
                  className="custom-input"
                  value={editSkills}
                  onChange={(e) =>
                    setEditSkills(e.target.value)
                  }
                />

              </div>

              {formError && (
                <div
                  style={{
                    color: "#f87171",
                    fontSize: "13px",
                    fontWeight: 600,
                  }}
                >
                  {formError}
                </div>
              )}

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "12px",
                  marginTop: "12px",
                }}
              >

                <button
                  type="button"
                  className="btn-secondary-dark"
                  onClick={() =>
                    setIsEditOpen(false)
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn-primary-gradient"
                >
                  Save Changes
                </button>

              </div>

            </form>

          </div>
        </div>
      )}

      {toastMessage && (
        <div className="toast-popup">
          ✓ {toastMessage}
        </div>
      )}

    </section>
  );
}

/* =========================================================
   PRACTICE LIBRARY
========================================================= */

function PracticeLibrary({ currentUser }) {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const completed =
    currentUser?.completed || [];

  const filteredTopics = useMemo(() => {
    return topics.filter((topic) => {

      const searchText =
        search.toLowerCase();

      const matchesSearch =
        topic.title
          .toLowerCase()
          .includes(searchText) ||
        topic.type
          .toLowerCase()
          .includes(searchText) ||
        topic.description
          .toLowerCase()
          .includes(searchText);

      const matchesFilter =
        filter === "All" ||
        topic.type === filter;

      return matchesSearch && matchesFilter;
    });
  }, [search, filter]);

  return (
    <section>

      <div style={{ marginBottom: "24px" }}>

        <div className="badge-tag-purple">
          📚 PRACTICE LIBRARY
        </div>

        <h1
          style={{
            fontSize: "28px",
            fontWeight: 800,
            color: "var(--text-main)",
            marginBottom: "6px",
          }}
        >
          Curriculum & Interview Questions
        </h1>

        <p
          style={{
            color: "var(--text-muted)",
            fontSize: "14px",
          }}
        >
          Master essential DSA algorithms,
          JavaScript concepts, and placement questions.
        </p>

      </div>

      <div className="topic-filters-bar">

        <input
          type="text"
          className="filter-search-input"
          placeholder="Search problems (e.g. Arrays, Palindrome, ES6)..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        {[
          "All",
          "DSA",
          "JavaScript",
          "React",
          "Frontend",
        ].map((category) => (
          <button
            key={category}
            className={`topic-category-pill ${
              filter === category ? "active" : ""
            }`}
            onClick={() =>
              setFilter(category)
            }
          >
            {category}
          </button>
        ))}

      </div>

      <div className="topics-list-grid">

        {filteredTopics.map((topic) => {

          const isCompleted =
            completed.includes(topic.id);

          return (
            <div
              className="topic-item-card"
              key={topic.id}
            >

              <div className="topic-item-header">

                <span className="difficulty-badge-easy">
                  {topic.type}
                </span>

                <span
                  style={{
                    fontSize: "12px",
                    color: "var(--text-subtle)",
                    fontWeight: 600,
                  }}
                >
                  {topic.questions?.length || 0} Questions
                </span>

              </div>

              <h3>{topic.title}</h3>

              <p>{topic.description}</p>

              <div className="topic-item-footer">

                <Link
                  to={`/topics/${topic.id}`}
                  className="btn-primary-gradient"
                  style={{
                    fontSize: "12.5px",
                    padding: "6px 14px",
                  }}
                >
                  Practice Now →
                </Link>

                {isCompleted && (
                  <span
                    style={{
                      color: "#34d399",
                      fontSize: "12px",
                      fontWeight: 700,
                    }}
                  >
                    ✓ Mastered
                  </span>
                )}

              </div>

            </div>
          );
        })}

      </div>

    </section>
  );
}

/* =========================================================
   TOPIC DETAILS
========================================================= */

function TopicDetails({
  currentUser,
  updateUser,
}) {
  const { topicId } = useParams();

  const topic = topics.find(
    (item) => item.id === topicId
  );

  const [activeQId, setActiveQId] =
    useState(null);

  const [codeDrafts, setCodeDrafts] =
    useState({});

  const [feedback, setFeedback] =
    useState({});

  if (!topic) {
    return (
      <Navigate
        to="/topics"
        replace
      />
    );
  }

  const questions = topic.questions || [];

  const handleRunCode = (question) => {
    const todayStr =
      getTodayDateString();

    const activeDates = new Set(
      currentUser?.activeDates || []
    );

    activeDates.add(todayStr);

    const completed = new Set(
      currentUser?.completed || []
    );

    completed.add(topic.id);

    const newSubmission = {
      id: `sub_${Date.now()}`,
      topicId: topic.id,
      topicTitle: topic.title,
      questionId: question.id,
      questionTitle: question.title,

      code:
        codeDrafts[question.id] !== undefined
          ? codeDrafts[question.id]
          : question.starterCode,

      language: "javascript",
      status: "Accepted",

      submittedAt:
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
    };

    updateUser({
      ...currentUser,

      completed: Array.from(completed),

      activeDates: Array.from(activeDates),

      submissions: [
        ...(currentUser?.submissions || []),
        newSubmission,
      ],
    });

    setFeedback((previous) => ({
      ...previous,
      [question.id]: true,
    }));

    setTimeout(() => {
      setFeedback((previous) => ({
        ...previous,
        [question.id]: false,
      }));
    }, 4000);
  };

  return (
    <section
      style={{
        maxWidth: "900px",
        margin: "0 auto",
      }}
    >

      <Link
        to="/topics"
        style={{
          color: "#818cf8",
          fontSize: "13.5px",
          display: "inline-block",
          marginBottom: "16px",
        }}
      >
        ← Back to Practice Library
      </Link>

      <div
        className="dashboard-panel-card"
        style={{ marginBottom: "24px" }}
      >

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "8px",
          }}
        >
          <span className="badge-tag-purple">
            {topic.type}
          </span>

          <span
            style={{
              fontSize: "12px",
              color: "var(--text-muted)",
            }}
          >
            {topic.level}
          </span>
        </div>

        <h2
          style={{
            fontSize: "22px",
            fontWeight: 800,
            color: "var(--text-main)",
          }}
        >
          {topic.title}
        </h2>

        <p
          style={{
            color: "var(--text-muted)",
            fontSize: "14px",
            marginTop: "4px",
          }}
        >
          {topic.description}
        </p>

      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >

        {questions.map((question, index) => {

          const isOpen =
            activeQId === question.id;

          const codeValue =
            codeDrafts[question.id] !== undefined
              ? codeDrafts[question.id]
              : question.starterCode;

          return (
            <div
              className="dashboard-panel-card"
              key={question.id}
            >

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  cursor: "pointer",
                }}
                onClick={() =>
                  setActiveQId(
                    isOpen
                      ? null
                      : question.id
                  )
                }
              >

                <div>

                  <span
                    style={{
                      color: "var(--cyan)",
                      fontWeight: 800,
                      marginRight: "8px",
                    }}
                  >
                    #{index + 1}
                  </span>

                  <strong
                    style={{
                      fontSize: "15px",
                    }}
                  >
                    {question.title}
                  </strong>

                </div>

                <button className="view-code-btn">
                  {isOpen
                    ? "Hide Editor ▲"
                    : "Solve Problem ▼"}
                </button>

              </div>

              {isOpen && (
                <div
                  style={{
                    marginTop: "16px",
                  }}
                >

                  <p
                    style={{
                      fontSize: "13.5px",
                      color: "var(--text-muted)",
                      marginBottom: "12px",
                    }}
                  >
                    {question.prompt}
                  </p>

                  {question.sampleTest && (
                    <div
                      style={{
                        padding: "8px 12px",
                        background:
                          "var(--bg-app)",
                        borderRadius: "6px",
                        fontSize: "12.5px",
                        marginBottom: "12px",
                        border:
                          "1px solid var(--border-main)",
                      }}
                    >
                      <strong>
                        Test Note:
                      </strong>{" "}
                      {question.sampleTest}
                    </div>
                  )}

                  <textarea
                    style={{
                      width: "100%",
                      fontFamily:
                        "var(--font-mono)",
                      fontSize: "13px",
                      background: "#0a0e1a",
                      color: "#a5b4fc",
                      padding: "12px",
                      borderRadius: "8px",
                      border:
                        "1px solid var(--border-main)",
                      outline: "none",
                      lineHeight: "1.5",
                    }}
                    rows={8}
                    value={codeValue}
                    onChange={(e) =>
                      setCodeDrafts({
                        ...codeDrafts,
                        [question.id]:
                          e.target.value,
                      })
                    }
                  />

                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      alignItems: "center",
                      marginTop: "12px",
                    }}
                  >

                    {feedback[question.id] ? (
                      <span
                        style={{
                          color: "#34d399",
                          fontWeight: 700,
                          fontSize: "13px",
                        }}
                      >
                        🎉 Accepted! Solution logged to
                        Submissions.
                      </span>
                    ) : (
                      <span
                        style={{
                          color:
                            "var(--text-subtle)",
                          fontSize: "12px",
                        }}
                      >
                        Submitting updates your streak
                        and logs to Submissions.
                      </span>
                    )}

                    <button
                      className="btn-primary-gradient"
                      onClick={() =>
                        handleRunCode(question)
                      }
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

    </section>
  );
}

/* =========================================================
   ROADMAP
========================================================= */

function Roadmap() {
  return (
    <section>

      <div style={{ marginBottom: "28px" }}>

        <div className="badge-tag-purple">
          🗺️ CURRICULUM TIMELINE
        </div>

        <h1
          style={{
            fontSize: "28px",
            fontWeight: 800,
            color: "var(--text-main)",
            marginBottom: "6px",
          }}
        >
          Full-Stack & Placement Roadmap
        </h1>

        <p
          style={{
            color: "var(--text-muted)",
            fontSize: "14px",
          }}
        >
          Structured 6-week curriculum covering Core Web
          Fundamentals, Modern ES6+, React Hooks, and
          Deployment.
        </p>

      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >

        {roadmap.map((item) => (
          <div
            className="dashboard-panel-card"
            key={item.week}
          >

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "8px",
              }}
            >

              <span className="badge-tag-purple">
                {item.week}
              </span>

              <span className="difficulty-badge-easy">
                {item.tag}
              </span>

            </div>

            <h3
              style={{
                fontSize: "18px",
                fontWeight: 700,
                marginBottom: "8px",
              }}
            >
              {item.title}
            </h3>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
              }}
            >
              {item.items.map((itemName) => (
                <span
                  className="tag-pill"
                  key={itemName}
                >
                  {itemName}
                </span>
              ))}
            </div>

          </div>
        ))}

      </div>

    </section>
  );
}

/* =========================================================
   PROJECTS & RESUME
========================================================= */

function ProjectsResume({
  currentUser,
  updateUser,
}) {
  const [projName, setProjName] =
    useState("");

  const [projDesc, setProjDesc] =
    useState("");

  const [projTech, setProjTech] =
    useState("");

  const [contactPhone, setContactPhone] =
    useState(
      currentUser?.profile?.phone || ""
    );

  const [contactEmail, setContactEmail] =
    useState(
      currentUser?.profile?.email || ""
    );

  const [savedSuccess, setSavedSuccess] =
    useState(false);

  const projects =
    currentUser?.projects || [];

  const handleAddProject = (e) => {
    e.preventDefault();

    if (
      !projName.trim() ||
      !projDesc.trim()
    ) {
      return;
    }

    const newProject = {
      id: Date.now(),
      name: projName.trim(),
      description: projDesc.trim(),
      technologies: projTech.trim(),
    };

    updateUser({
      ...currentUser,

      projects: [
        ...(currentUser?.projects || []),
        newProject,
      ],
    });

    setProjName("");
    setProjDesc("");
    setProjTech("");

    setSavedSuccess(true);

    setTimeout(() => {
      setSavedSuccess(false);
    }, 2500);
  };

  return (
    <section>

      <div style={{ marginBottom: "24px" }}>

        <div className="badge-tag-purple">
          📁 PORTFOLIO ENGINE
        </div>

        <h1
          style={{
            fontSize: "28px",
            fontWeight: 800,
            color: "var(--text-main)",
            marginBottom: "6px",
          }}
        >
          Shipped Projects & Resume
        </h1>

        <p
          style={{
            color: "var(--text-muted)",
            fontSize: "14px",
          }}
        >
          Manage your deployed projects and generate an
          ATS-optimized technical resume.
        </p>

      </div>

      <div
        className="dashboard-bottom-grid"
        style={{
          marginBottom: "32px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
        }}
      >

        {/* Add Project */}

        <div className="dashboard-panel-card">

          <h3
            style={{
              fontSize: "16px",
              fontWeight: 700,
              marginBottom: "16px",
            }}
          >
            + Add Shipped Project
          </h3>

          <form
            onSubmit={handleAddProject}
            className="custom-form"
          >

            <div className="form-field-group">

              <label>
                Project Title *
              </label>

              <input
                required
                className="custom-input"
                value={projName}
                onChange={(e) =>
                  setProjName(e.target.value)
                }
                placeholder="e.g. Distributed Task Queue"
              />

            </div>

            <div className="form-field-group">

              <label>
                Impact & Description *
              </label>

              <textarea
                required
                className="custom-textarea"
                rows={3}
                value={projDesc}
                onChange={(e) =>
                  setProjDesc(e.target.value)
                }
                placeholder="Engineered high-throughput queue with Redis & Node.js..."
              />

            </div>

            <div className="form-field-group">

              <label>
                Technologies
              </label>

              <input
                className="custom-input"
                value={projTech}
                onChange={(e) =>
                  setProjTech(e.target.value)
                }
                placeholder="e.g. React, Python, PostgreSQL, Docker"
              />

            </div>

            <button
              type="submit"
              className="btn-primary-gradient"
            >
              Save Project
            </button>

            {savedSuccess && (
              <span
                style={{
                  color: "#34d399",
                  fontWeight: 700,
                  fontSize: "13px",
                }}
              >
                ✓ Project added to portfolio!
              </span>
            )}

          </form>

        </div>

        {/* Resume Contact */}

        <div className="dashboard-panel-card">

          <h3
            style={{
              fontSize: "16px",
              fontWeight: 700,
              marginBottom: "16px",
            }}
          >
            Resume Contact Details
          </h3>

          <div className="custom-form">

            <div className="form-field-group">

              <label>

                <span>
                  Contact Email
                </span>

                <span className="field-constraint-tag">
                  Valid email only
                </span>

              </label>

              <StrictEmailInput
                value={contactEmail}
                onChange={setContactEmail}
              />

            </div>

            <div className="form-field-group">

              <label>

                <span>
                  Contact Phone
                </span>

                <span className="field-constraint-tag">
                  Numbers only (0-9)
                </span>

              </label>

              <StrictNumberInput
                value={contactPhone}
                onChange={setContactPhone}
                maxLength={12}
              />

            </div>

            <div
              style={{
                marginTop: "12px",
                fontSize: "12.5px",
                color: "var(--text-muted)",
              }}
            >
              Contact info will automatically appear in
              your ATS resume preview below.
            </div>

          </div>

        </div>

      </div>

      {/* Projects */}

      <div className="dashboard-panel-card">

        <h3
          style={{
            fontSize: "16px",
            fontWeight: 700,
            marginBottom: "16px",
          }}
        >
          Shipped Projects ({projects.length})
        </h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "16px",
          }}
        >

          {projects.map((project) => (
            <div
              key={project.id}
              style={{
                background:
                  "var(--bg-surface-elevated)",
                padding: "16px",
                borderRadius: "10px",
                border:
                  "1px solid var(--border-main)",
              }}
            >

              <h4
                style={{
                  fontSize: "15px",
                  fontWeight: 700,
                  color: "var(--text-main)",
                  marginBottom: "4px",
                }}
              >
                {project.name}
              </h4>

              <p
                style={{
                  fontSize: "12.5px",
                  color: "var(--text-muted)",
                  marginBottom: "10px",
                }}
              >
                {project.description}
              </p>

              <span className="tag-pill">
                {project.technologies}
              </span>

            </div>
          ))}

        </div>

      </div>

    </section>
  );
}

/* =========================================================
   LOGIN / SIGNUP
========================================================= */

function Login({ onLoginSuccess }) {
  const navigate = useNavigate();

  const [mode, setMode] =
    useState("login");

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    setError("");

    if (!isValidEmail(email)) {
      setError(
        "Please enter a valid email address."
      );
      return;
    }

    const normalizedEmail =
      email.trim().toLowerCase();

    const users =
      loadUsersFromStorage();

    /* -------------------------
       SIGN UP
    ------------------------- */

    if (mode === "create") {

      if (!name.trim()) {
        setError(
          "Please enter your name."
        );
        return;
      }

      if (password.length < 6) {
        setError(
          "Password must be at least 6 characters."
        );
        return;
      }

      const existing = users.find(
        (user) =>
          user.email.toLowerCase() ===
          normalizedEmail
      );

      if (existing) {
        setError(
          "An account with this email already exists. Please log in."
        );
        return;
      }

      const newUser = {
        id: `user_${Date.now()}`,

        name: name.trim(),

        email: normalizedEmail,

        password,

        profile: {
          name: name.trim(),
          email: normalizedEmail,
          phone: phone.trim(),

          title:
            "Frontend Developer · Student Developer",

          location:
            "India · Open to internships",

          about:
            "Enthusiastic developer learning in public and preparing for tech placements.",

          skills: [
            "JavaScript",
            "React",
            "Python",
            "DSA",
            "HTML5",
            "CSS3",
          ],

          stats: {
            problems: 0,
            projects: 0,
          },
        },

        completed: [],
        submissions: [],
        projects: [],

        activeDates: [
          getTodayDateString(),
        ],
      };

      const updated = [
        ...users,
        newUser,
      ];

      saveUsersToStorage(updated);

      onLoginSuccess(newUser);

      navigate("/dashboard");

      return;
    }

    /* -------------------------
       LOGIN
    ------------------------- */

    const user = users.find(
      (item) =>
        item.email.toLowerCase() ===
        normalizedEmail
    );

    if (!user) {
      setError(
        "No account found with this email. Please sign up."
      );
      return;
    }

    if (user.password !== password) {
      setError(
        "Incorrect password."
      );
      return;
    }

    const todayStr =
      getTodayDateString();

    const activeDates = new Set(
      user.activeDates || []
    );

    activeDates.add(todayStr);

    user.activeDates =
      Array.from(activeDates);

    saveUsersToStorage(users);

    onLoginSuccess(user);

    navigate("/dashboard");
  };

  return (
    <div className="login-screen-wrapper">

      <div className="auth-form-card">

        <div className="auth-brand-header">

          <div className="brand-icon-box">
            ⚡
          </div>

          <div>

            <h2
              style={{
                fontSize: "20px",
                fontWeight: 800,
              }}
            >
              Next<span>Offer</span>
            </h2>

            <p
              style={{
                fontSize: "12px",
                color: "var(--text-muted)",
              }}
            >
              Placement Prep Platform
            </p>

          </div>

        </div>

        <h3
          style={{
            fontSize: "18px",
            fontWeight: 700,
            marginBottom: "6px",
          }}
        >
          {mode === "login"
            ? "Welcome back"
            : "Create Student Account"}
        </h3>

        <p
          style={{
            color: "var(--text-muted)",
            fontSize: "13.5px",
            marginBottom: "20px",
          }}
        >
          {mode === "login"
            ? "Log in to view your dashboard, track streak, and continue practice."
            : "Sign up to solve challenges and prepare for tech placements."}
        </p>

        <form
          onSubmit={handleSubmit}
          className="custom-form"
        >

          {/* Name */}

          {mode === "create" && (
            <div className="form-field-group">

              <label>
                Full Name *
              </label>

              <input
                required
                className="custom-input"
                placeholder="e.g. Vanshika Goel"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
              />

            </div>
          )}

          {/* Email */}

          <div className="form-field-group">

            <label>

              <span>
                Email Address *
              </span>

              <span className="field-constraint-tag">
                Valid email only
              </span>

            </label>

            <StrictEmailInput
              required
              value={email}
              onChange={setEmail}
              placeholder="e.g. vanshika.goel@college.edu"
            />

          </div>

          {/* Phone */}

          {mode === "create" && (
            <div className="form-field-group">

              <label>

                <span>
                  Phone Number
                </span>

                <span className="field-constraint-tag">
                  Digits only (0-9)
                </span>

              </label>

              <StrictNumberInput
                value={phone}
                onChange={setPhone}
                placeholder="e.g. 9876543210"
                maxLength={12}
              />

            </div>
          )}

          {/* Password */}

          <div className="form-field-group">

            <label>
              Password *
            </label>

            <input
              required
              type="password"
              className="custom-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />

          </div>

          {error && (
            <div
              style={{
                color: "#f87171",
                fontSize: "13px",
                fontWeight: 600,
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn-primary-gradient"
            style={{
              width: "100%",
              justifyContent: "center",
              padding: "12px",
            }}
          >
            {mode === "login"
              ? "Sign In →"
              : "Create Account →"}
          </button>

          {/* Switch Login / Signup */}

          <div
            style={{
              textAlign: "center",
              marginTop: "12px",
              fontSize: "13px",
              color: "var(--text-muted)",
            }}
          >

            {mode === "login" ? (
              <>
                Don't have an account?{" "}

                <button
                  type="button"
                  style={{
                    background: "none",
                    border: "none",
                    color: "#818cf8",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setMode("create");
                    setError("");
                  }}
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already registered?{" "}

                <button
                  type="button"
                  style={{
                    background: "none",
                    border: "none",
                    color: "#818cf8",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setMode("login");
                    setError("");
                  }}
                >
                  Sign in
                </button>
              </>
            )}

          </div>

        </form>

      </div>

    </div>
  );
}

/* =========================================================
   APP ROOT
========================================================= */

export default function App() {
  const [theme, toggleTheme] =
    useTheme();

  const [currentEmail, setCurrentEmail] =
    useLocalStorage(
      SESSION_STORAGE_KEY,
      INITIAL_USER.email
    );

  const [users, setUsers] =
    useState(() =>
      loadUsersFromStorage()
    );

  /*
   * IMPORTANT FIX:
   *
   * Previously this had:
   *
   * users.find(...) || users[0]
   *
   * That caused logout to fail because after
   * currentEmail became null, the first user was
   * automatically selected again.
   */

  const currentUser = useMemo(() => {
    if (!currentEmail) {
      return null;
    }

    return (
      users.find(
        (user) =>
          user.email.toLowerCase() ===
          currentEmail.toLowerCase()
      ) || null
    );
  }, [users, currentEmail]);

  /* Update existing user */

  const updateUser = useCallback(
    (updatedUser) => {
      const updatedList = users.map(
        (user) =>
          user.email.toLowerCase() ===
          updatedUser.email.toLowerCase()
            ? updatedUser
            : user
      );

      setUsers(updatedList);

      saveUsersToStorage(updatedList);
    },
    [users]
  );

  /* Login */

  const handleLoginSuccess = (user) => {
    const existing = users.find(
      (item) =>
        item.email.toLowerCase() ===
        user.email.toLowerCase()
    );

    let updatedList;

    if (existing) {
      updatedList = users.map(
        (item) =>
          item.email.toLowerCase() ===
          user.email.toLowerCase()
            ? user
            : item
      );
    } else {
      updatedList = [
        ...users,
        user,
      ];
    }

    setUsers(updatedList);

    saveUsersToStorage(updatedList);

    setCurrentEmail(user.email);
  };

  /* Logout */

  const handleLogout = () => {
    setCurrentEmail(null);
  };

  return (
    <Routes>

      {/* Login Route */}

      <Route
        path="/login"
        element={
          currentUser ? (
            <Navigate
              to="/dashboard"
              replace
            />
          ) : (
            <Login
              onLoginSuccess={
                handleLoginSuccess
              }
            />
          )
        }
      />

      {/* Main Layout */}

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

        <Route
          index
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

        {/* Protected Routes */}

        <Route
          element={
            <ProtectedRoute
              currentUser={currentUser}
            />
          }
        >

          <Route
            path="dashboard"
            element={
              <Dashboard
                currentUser={currentUser}
              />
            }
          />

          <Route
            path="topics"
            element={
              <PracticeLibrary
                currentUser={currentUser}
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
              <SubmissionsView
                currentUser={currentUser}
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

          <Route
            path="projects"
            element={
              <ProjectsResume
                currentUser={currentUser}
                updateUser={updateUser}
              />
            }
          />

          <Route
            path="resume"
            element={
              <ProjectsResume
                currentUser={currentUser}
                updateUser={updateUser}
              />
            }
          />

          <Route
            path="roadmap"
            element={<Roadmap />}
          />

        </Route>

        {/* Unknown Route */}

        <Route
          path="*"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

      </Route>

    </Routes>
  );
}