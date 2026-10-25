// Layout Component
// Main shell containing the persistent Sidebar, Topbar navigation, Breadcrumbs, and Notifications

import React, { useState, useMemo } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { calculateStreak, useTimeTracker } from "./hooks";

export default function Layout({ currentUser, onLogout }) {
  const location = useLocation();
  const userKey = currentUser?.id || currentUser?.email || "guest";
  useTimeTracker(userKey);
  
  // Search bar input state
  const [searchQuery, setSearchQuery] = useState("");
  // Notification dropdown open state
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  // Toast notification message popup
  const [toastMessage, setToastMessage] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Calculate current streak
  const streak = calculateStreak(currentUser?.activeDates || []);

  // Helper to show a temporary toast message
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  // Determine current breadcrumb label based on active route URL
  const currentPath = location.pathname;
  let breadcrumbLabel = "HOME";
  let pageTitle = "Dashboard";

  if (currentPath.includes("settings")) {
    breadcrumbLabel = "SETTINGS";
    pageTitle = "Settings";
  } else if (currentPath.includes("notes")) {
    breadcrumbLabel = "QUICK NOTES";
    pageTitle = "Quick Notes & Revision";
  } else if (currentPath.includes("profile")) {
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
      <aside className={`devsphere-sidebar ${mobileMenuOpen ? "open" : ""}`}>
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
        <button
          type="button"
          className="mobile-sidebar-close"
          aria-label="Close navigation menu"
          onClick={() => setMobileMenuOpen(false)}
        >✕</button>
        <nav className="sidebar-nav" onClick={(event) => {
          if (event.target.closest("a")) setMobileMenuOpen(false);
        }}>
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
            to="/mock-interview"
          >
            <span className="nav-icon">🎤</span>
            <span>Mock Interview</span>
          </NavLink>

          <NavLink
            className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
            to="/notes"
          >
            <span className="nav-icon">💡</span>
            <span>Quick Notes</span>
          </NavLink>

          <NavLink
            className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
            to="/profile"
          >
            <span className="nav-icon">👤</span>
            <span>Profile</span>
          </NavLink>

          <NavLink
            className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
            to="/settings"
          >
            <span className="nav-icon">⚙️</span>
            <span>Settings</span>
          </NavLink>
        </nav>

        {/* Sidebar Footer with Logout */}
        <div className="sidebar-footer">
          <button
            type="button"
            className="sidebar-action-btn"
            onClick={() => { setMobileMenuOpen(false); onLogout(); }}
            style={{ width: "100%", justifyContent: "center" }}
            title="Log out of NextOffer"
          >
            <span>🚪 Log out</span>
          </button>
        </div>
      </aside>

      {mobileMenuOpen && (
        <button
          type="button"
          className="mobile-sidebar-backdrop"
          aria-label="Close navigation menu"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="main-content-wrapper">
        <header className="topbar-header">
          <button
            type="button"
            className="mobile-menu-toggle"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((open) => !open)}
          >{mobileMenuOpen ? "✕" : "☰"}</button>
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

            {/* Profile Avatar Icon */}
            <Link to="/profile" className="topbar-avatar" title="View Profile">
              {userInitials}
            </Link>
          </div>
        </header>

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
