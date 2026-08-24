// Layout Component
// Main shell containing the persistent Sidebar, Topbar navigation, Breadcrumbs, and Notifications

import React, { useState, useMemo } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { calculateStreak, getTodayDateString } from "./hooks";

export default function Layout({ currentUser, onLogout, theme, toggleTheme }) {
  const location = useLocation();
  
  // Search bar input state
  const [searchQuery, setSearchQuery] = useState("");
  // Notification dropdown open state
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  // Toast notification message popup
  const [toastMessage, setToastMessage] = useState("");

  // Calculate current streak
  const streak = calculateStreak(currentUser?.activeDates || [getTodayDateString()]);

  // Helper to show a temporary toast message
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  // Determine current breadcrumb label based on active route URL
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
  } else if (currentPath.includes("mock")) {
    breadcrumbLabel = "MOCK INTERVIEW";
    pageTitle = "Mock Interview Simulation";
  } else if (currentPath.includes("projects") || currentPath.includes("resume")) {
    breadcrumbLabel = "PROJECTS";
    pageTitle = "Projects & Resume";
  }

  // Calculate avatar initials from user's full name
  const userInitials = useMemo(() => {
    const name = currentUser?.profile?.name || currentUser?.name || "SD";
    return name
      .split(" ")
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }, [currentUser]);

  return (
    <div className="devsphere-layout">
      {/* Sidebar Navigation */}
      <aside className="devsphere-sidebar">
        {/* Brand logo link */}
        <Link className="sidebar-brand" to="/dashboard">
          <div className="brand-icon-box">⚡</div>
          <div className="brand-info">
            <h2>Next<span>Offer</span></h2>
            <p>Placement Preparation</p>
          </div>
        </Link>

        {/* User preview card */}
        <Link className="sidebar-user-card" to="/profile">
          <div className="user-card-left">
            <div className="avatar-initials-small">{userInitials}</div>
            <div className="user-card-details">
              <h4>{currentUser?.profile?.name || currentUser?.name || "Student Developer"}</h4>
              <p>{currentUser?.profile?.title?.split("·")[0] || "Student"}</p>
            </div>
          </div>
          <div className="online-dot" title="Active" />
        </Link>

        {/* Workspace navigation links */}
        <div className="sidebar-section-label">WORKSPACE</div>
        <nav className="sidebar-nav">
          <NavLink
            className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
            to="/dashboard"
          >
            <span className="nav-icon">📊</span>
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
            to="/topics"
          >
            <span className="nav-icon">📚</span>
            <span>Practice Library</span>
          </NavLink>

          <NavLink
            className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
            to="/submissions"
          >
            <span className="nav-icon">📝</span>
            <span>Submissions</span>
          </NavLink>

          <NavLink
            className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
            to="/projects"
          >
            <span className="nav-icon">📁</span>
            <span>Projects & Resume</span>
          </NavLink>

          <NavLink
            className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
            to="/roadmap"
          >
            <span className="nav-icon">🗺️</span>
            <span>Roadmap</span>
          </NavLink>

          <NavLink
            className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
            to="/mock"
          >
            <span className="nav-icon">🎤</span>
            <span>Mock Interview</span>
          </NavLink>

          <NavLink
            className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
            to="/profile"
          >
            <span className="nav-icon">👤</span>
            <span>Profile</span>
          </NavLink>
        </nav>

        {/* Sidebar Footer with Theme toggle and Logout */}
        <div className="sidebar-footer">
          <button
            className="sidebar-action-btn"
            onClick={toggleTheme}
            title="Toggle theme"
          >
            <span>{theme === "light" ? "🌙 Dark" : "☀️ Light"}</span>
          </button>
          <button className="sidebar-action-btn" onClick={onLogout}>
            <span>Log out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="main-content-wrapper">
        <header className="topbar-header">
          {/* Breadcrumb Path */}
          <div className="breadcrumbs-container">
            <span className="breadcrumb-path">NEXTOFFER / {breadcrumbLabel}</span>
            {breadcrumbLabel !== "HOME" && <span className="breadcrumb-title">{pageTitle}</span>}
          </div>

          <div className="topbar-right">
            {/* Streak flame indicator */}
            <div
              className="topbar-streak-pill"
              title={`${streak} Day Active Streak`}
            >
              <span>🔥</span>
              <span>{streak} {streak === 1 ? "Day" : "Days"}</span>
            </div>

            {/* Quick search input */}
            <div className="topbar-search-box">
              <span>🔍</span>
              <input
                type="text"
                placeholder="Search topics, questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <span className="search-shortcut">⌘K</span>
            </div>

            {/* Notification bell button */}
            <button
              className="icon-button"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              title="Notifications"
            >
              🔔
              <span className="notification-badge" />
            </button>

            {/* Profile Avatar Icon */}
            <Link to="/profile" className="topbar-avatar" title="View Profile">
              {userInitials}
            </Link>
          </div>
        </header>

        {/* Notification dropdown modal */}
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
              boxShadow: "var(--shadow-md)"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
              <strong style={{ fontSize: "14px" }}>Notifications</strong>
              <button
                style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
                onClick={() => setNotificationsOpen(false)}
              >
                ✕
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px" }}>
              <div style={{ padding: "8px", background: "var(--bg-surface-elevated)", borderRadius: "6px" }}>
                🎉 Solution accepted for <strong>Two Sum</strong>!
              </div>
              <div style={{ padding: "8px", background: "var(--bg-surface-elevated)", borderRadius: "6px" }}>
                🔥 {streak}-Day learning streak active.
              </div>
            </div>
          </div>
        )}

        {/* Nested route content */}
        <main className="page-container">
          <Outlet context={{ showToast, searchQuery }} />
        </main>
      </div>

      {/* Floating toast notification */}
      {toastMessage && <div className="toast-popup">✓ {toastMessage}</div>}
    </div>
  );
}
