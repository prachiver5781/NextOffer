// Profile Page Component - NextOffer
// Designed for B.Tech CSE Project Evaluation II
// Implements:
// 1. Professional profile links (GitHub, LinkedIn, LeetCode, HackerRank, Portfolio) with validation
// 2. Clickable icons on profile and resume
// 3. Profile completion indicator with percentage and missing section recommendations
// 4. Live REST API fetch integration with GitHub API
// 5. Functional Badges and Milestones connected to user practice progress
// 6. Interactive Shipped Projects section with tech stack and live/GitHub links
// 7. Recent Submissions activity & question tracking without double counting

import React, { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  isValidEmail,
  StrictEmailInput,
  StrictNumberInput,
  StrictUrlInput,
  validatePlatformLink
} from "./ValidationInputs";
import ProfileCompletionCard from "./components/ProfileCompletionCard";
import ProfessionalLinksBar from "./components/ProfessionalLinksBar";
import GitHubStatsFetcher from "./components/GitHubStatsFetcher";
import { calculateStreak } from "./hooks";
import { getSubmissions } from "./submissionUtils";

export default function Profile({ currentUser, updateUser }) {
  const navigate = useNavigate();

  // Modal open / close state
  const [isEditOpen, setIsEditOpen] = useState(false);
  // Badges view toggle: "badges" | "milestones"
  const [badgeView, setBadgeView] = useState("badges");
  // Temporary toast popup message
  const [toastMessage, setToastMessage] = useState("");

  const profile = currentUser?.profile || {};
  const currentLinks = profile.links || {};
  const projects = currentUser?.projects || [];
  const submissions = currentUser?.submissions || [];

  // Calculate unique questions solved count (avoids double counting)
  const uniqueSolvedCount = useMemo(() => {
    const uniqueIds = new Set(
      submissions.map((s) => s.questionId || s.questionTitle)
    );
    return Math.max(uniqueIds.size, profile.stats?.problems || 0);
  }, [submissions, profile.stats?.problems]);

  // Streak calculation
  const streak = useMemo(() => {
    return calculateStreak(currentUser?.activeDates || []);
  }, [currentUser?.activeDates]);

  // Mock interview count from submissions
  const [mockAttemptsCount, setMockAttemptsCount] = useState(0);
  useEffect(() => {
    try {
      const allSubs = getSubmissions();
      const count = allSubs.filter((item) => item.source === "Mock Interview" && Array.isArray(item.questions)).length;
      setMockAttemptsCount(count);
    } catch {
      setMockAttemptsCount(0);
    }
  }, []);

  // Form input states for editing profile
  const [editName, setEditName] = useState(profile.name || currentUser?.name || "");
  const [editEmail, setEditEmail] = useState(profile.email || currentUser?.email || "");
  const [editPhone, setEditPhone] = useState(profile.phone || "");
  const [editTitle, setEditTitle] = useState(
    profile.title || "Frontend & Full Stack Developer · Student Developer"
  );
  const [editLocation, setEditLocation] = useState(profile.location || "India · Open to internships");
  const [editAbout, setEditAbout] = useState(profile.about || "");
  const [editSkills, setEditSkills] = useState(
    (profile.skills || ["JavaScript", "React", "Python", "DSA", "HTML5", "CSS3"]).join(", ")
  );

  // Professional links form states
  const [editGithub, setEditGithub] = useState(currentLinks.github || "");
  const [editLinkedin, setEditLinkedin] = useState(currentLinks.linkedin || "");
  const [editLeetcode, setEditLeetcode] = useState(currentLinks.leetcode || "");
  const [editHackerrank, setEditHackerrank] = useState(currentLinks.hackerrank || "");
  const [editPortfolio, setEditPortfolio] = useState(currentLinks.portfolio || "");

  // Form error message
  const [formError, setFormError] = useState("");

  // Sync state when edit modal opens
  const handleOpenEdit = () => {
    setEditName(profile.name || currentUser?.name || "");
    setEditEmail(profile.email || currentUser?.email || "");
    setEditPhone(profile.phone || "");
    setEditTitle(profile.title || "Frontend & Full Stack Developer · Student Developer");
    setEditLocation(profile.location || "India · Open to internships");
    setEditAbout(profile.about || "");
    setEditSkills((profile.skills || []).join(", "));
    setEditGithub(profile.links?.github || "");
    setEditLinkedin(profile.links?.linkedin || "");
    setEditLeetcode(profile.links?.leetcode || "");
    setEditHackerrank(profile.links?.hackerrank || "");
    setEditPortfolio(profile.links?.portfolio || "");
    setFormError("");
    setIsEditOpen(true);
  };

  // Calculate initials for large avatar circle
  const userInitials = useMemo(() => {
    const name = profile.name || currentUser?.name || "SD";
    return name
      .split(" ")
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }, [profile.name, currentUser?.name]);

  // Copy profile link to clipboard
  const handleShareProfile = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setToastMessage("Profile URL copied to clipboard!");
      setTimeout(() => setToastMessage(""), 3000);
    }
  };

  // Auto-sync bio from live GitHub API response
  const handleSyncGitHubBio = (githubData) => {
    if (githubData.bio) {
      setEditAbout(githubData.bio);
      setToastMessage("GitHub bio synchronized into profile editor!");
      setTimeout(() => setToastMessage(""), 3000);
    }
  };

  // Save updated profile data with validation
  const handleSaveProfile = (e) => {
    e.preventDefault();
    setFormError("");

    if (!isValidEmail(editEmail)) {
      setFormError("Please enter a valid email address.");
      return;
    }

    if (editPhone && !/^\d+$/.test(editPhone)) {
      setFormError("Phone number must only contain digits (0-9).");
      return;
    }

    const linksToValidate = [
      { key: "github", val: editGithub, name: "GitHub" },
      { key: "linkedin", val: editLinkedin, name: "LinkedIn" },
      { key: "leetcode", val: editLeetcode, name: "LeetCode" },
      { key: "hackerrank", val: editHackerrank, name: "HackerRank" },
      { key: "portfolio", val: editPortfolio, name: "Portfolio" }
    ];

    for (const item of linksToValidate) {
      if (item.val && item.val.trim()) {
        const check = validatePlatformLink(item.key, item.val);
        if (!check.isValid) {
          setFormError(`Invalid ${item.name} link format: ${check.message}`);
          return;
        }
      }
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
        .map((s) => s.trim())
        .filter(Boolean),
      links: {
        github: editGithub.trim(),
        linkedin: editLinkedin.trim(),
        leetcode: editLeetcode.trim(),
        hackerrank: editHackerrank.trim(),
        portfolio: editPortfolio.trim()
      },
      stats: {
        ...profile.stats,
        problems: uniqueSolvedCount,
        projects: projects.length
      }
    };

    updateUser({
      ...currentUser,
      name: editName.trim(),
      email: editEmail.trim(),
      profile: updatedProfile
    });

    setIsEditOpen(false);
    setToastMessage("Profile and professional links saved successfully!");
    setTimeout(() => setToastMessage(""), 3000);
  };

  // -------------------------------------------------------------
  // FUNCTIONAL BADGES DEFINITION (Connected directly to progress)
  // -------------------------------------------------------------
  const badgesList = useMemo(() => {
    return [
      {
        id: "badge_first_problem",
        icon: "🎯",
        name: "First Problem Solved",
        description: "Submit your very first practice question solution.",
        isUnlocked: uniqueSolvedCount >= 1,
        progressText: `${Math.min(uniqueSolvedCount, 1)} / 1 solved`
      },
      {
        id: "badge_streak",
        icon: "🔥",
        name: "Consistent Learner",
        description: "Maintain an active practice streak on NextOffer.",
        isUnlocked: streak >= 1,
        progressText: `${streak} day streak`
      },
      {
        id: "badge_solver_5",
        icon: "⚡",
        name: "Challenge Solver (5+)",
        description: "Successfully solve and submit 5 unique challenges.",
        isUnlocked: uniqueSolvedCount >= 5,
        progressText: `${Math.min(uniqueSolvedCount, 5)} / 5 solved`
      },
      {
        id: "badge_project_builder",
        icon: "💻",
        name: "Project Builder",
        description: "Add a shipped project to your portfolio and resume.",
        isUnlocked: projects.length >= 1,
        progressText: `${Math.min(projects.length, 1)} / 1 project`
      },
      {
        id: "badge_master_10",
        icon: "🧠",
        name: "Algorithm Ace (10+)",
        description: "Reach double digits with 10 solved challenges.",
        isUnlocked: uniqueSolvedCount >= 10,
        progressText: `${Math.min(uniqueSolvedCount, 10)} / 10 solved`
      },
      {
        id: "badge_mock_interview",
        icon: "🎙️",
        name: "Interview Contender",
        description: "Complete at least 1 mock interview session.",
        isUnlocked: mockAttemptsCount >= 1,
        progressText: `${Math.min(mockAttemptsCount, 1)} / 1 interview`
      }
    ];
  }, [uniqueSolvedCount, streak, projects.length, mockAttemptsCount]);

  const unlockedBadgesCount = useMemo(() => {
    return badgesList.filter((b) => b.isUnlocked).length;
  }, [badgesList]);

  // -------------------------------------------------------------
  // FUNCTIONAL MILESTONES DEFINITION (Connected to progress)
  // -------------------------------------------------------------
  const milestonesList = useMemo(() => {
    return [
      {
        id: "m_1",
        level: "Level 1",
        title: "Placement Starter",
        description: "Solve 2 challenges to begin your technical placement preparation.",
        progress: Math.min(100, Math.round((Math.min(uniqueSolvedCount, 2) / 2) * 100)),
        metricText: `${Math.min(uniqueSolvedCount, 2)} of 2 challenges solved`,
        isComplete: uniqueSolvedCount >= 2
      },
      {
        id: "m_2",
        level: "Level 2",
        title: "Portfolio Ready Aspirant",
        description: "Solve 5 challenges and add at least 1 project to your portfolio.",
        progress: Math.min(100, Math.round(((Math.min(uniqueSolvedCount, 5) / 5) * 60 + (projects.length >= 1 ? 40 : 0)))),
        metricText: `${Math.min(uniqueSolvedCount, 5)}/5 problems · ${projects.length >= 1 ? "Project added ✓" : "0/1 project"}`,
        isComplete: uniqueSolvedCount >= 5 && projects.length >= 1
      },
      {
        id: "m_3",
        level: "Level 3",
        title: "Interview Ready Candidate",
        description: "Solve 10 challenges and complete 1 full mock interview simulation.",
        progress: Math.min(100, Math.round(((Math.min(uniqueSolvedCount, 10) / 10) * 60 + (mockAttemptsCount >= 1 ? 40 : 0)))),
        metricText: `${Math.min(uniqueSolvedCount, 10)}/10 problems · ${mockAttemptsCount >= 1 ? "Interview completed ✓" : "0/1 interview"}`,
        isComplete: uniqueSolvedCount >= 10 && mockAttemptsCount >= 1
      }
    ];
  }, [uniqueSolvedCount, projects.length, mockAttemptsCount]);

  // Topics solved breakdown
  const topicStats = useMemo(() => {
    const counts = {};
    for (const sub of submissions) {
      const topic = sub.topicTitle || "General";
      counts[topic] = (counts[topic] || 0) + 1;
    }
    return Object.entries(counts).slice(0, 5);
  }, [submissions]);

  return (
    <section>
      {/* Profile Hero Banner */}
      <div className="profile-hero-banner">
        <div className="profile-banner-top">
          <div className="profile-identity-group">
            <div className="profile-large-avatar">{userInitials}</div>
            <div className="profile-names-group">
              <h2>
                {profile.name || currentUser?.name || "Student Developer"}
                <span className="verified-badge" title="Verified Student">✓</span>
              </h2>
              <p className="role-title">{profile.title || "Student Developer"}</p>
              <p className="location-tag">📍 {profile.location || "India · Open to internships"}</p>

              {/* Clickable Professional Icons Row */}
              <div style={{ marginTop: "12px" }}>
                <ProfessionalLinksBar
                  links={profile.links}
                  onEditClick={handleOpenEdit}
                />
              </div>
            </div>
          </div>

          <div className="profile-banner-actions">
            <button
              type="button"
              className="btn-secondary-dark"
              onClick={handleOpenEdit}
            >
              Edit Profile
            </button>
            <button
              type="button"
              className="btn-share-profile"
              onClick={handleShareProfile}
            >
              Share Profile
            </button>
          </div>
        </div>

        {/* Real Progress Stats Row */}
        <div className="profile-stats-row">
          <div className="profile-stat-item">
            <strong>{uniqueSolvedCount}</strong>
            <span>Questions Solved</span>
          </div>
          <div className="profile-stat-item">
            <strong>{projects.length}</strong>
            <span>Shipped Projects</span>
          </div>
          <div className="profile-stat-item">
            <strong>{streak} {streak === 1 ? "Day" : "Days"}</strong>
            <span>Active Streak</span>
          </div>
          <div className="profile-stat-item">
            <strong>
              {Object.values(profile.links || {}).filter(Boolean).length} / 5
            </strong>
            <span>Links Connected</span>
          </div>
        </div>
      </div>

      {/* Profile Completion Indicator */}
      <ProfileCompletionCard
        currentUser={currentUser}
        onOpenEdit={handleOpenEdit}
      />

      {/* Main Details Grid */}
      <div className="profile-details-grid" style={{ marginBottom: "24px" }}>
        {/* Left Column: About & Skills */}
        <div className="dashboard-panel-card">
          <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "12px", color: "var(--text-main)" }}>
            About Me
          </h3>
          <p className="about-bio-text">
            {profile.about ||
              "Student developer interested in building web applications, practicing DSA problems, and preparing for placement drives."}
          </p>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-main)", margin: 0 }}>
              Technical Skills ({profile.skills?.length || 0})
            </h3>
            <button
              type="button"
              onClick={handleOpenEdit}
              style={{ background: "none", border: "none", color: "var(--cyan)", fontSize: "12px", cursor: "pointer", fontWeight: 600 }}
            >
              + Edit Skills
            </button>
          </div>
          <div className="skills-pill-container" style={{ marginBottom: "20px" }}>
            {(profile.skills || ["JavaScript", "React", "Python", "DSA", "HTML5", "CSS3"]).map((skill) => (
              <span className="skill-badge-pill" key={skill}>
                {skill}
              </span>
            ))}
          </div>

          {/* Connected Professional Links Summary */}
          <h3 style={{ fontSize: "16px", fontWeight: 700, marginTop: "24px", marginBottom: "12px", color: "var(--text-main)" }}>
            Connected Portfolios & Profiles
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "13px", padding: "8px 12px", background: "var(--bg-app)", borderRadius: "6px" }}>
              <span>🐙 GitHub</span>
              {profile.links?.github ? (
                <a href={profile.links.github} target="_blank" rel="noopener noreferrer" style={{ color: "var(--cyan)", fontWeight: 600 }}>
                  View Profile ↗
                </a>
              ) : (
                <span style={{ color: "var(--text-muted)", fontSize: "12px" }}>Not added</span>
              )}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "13px", padding: "8px 12px", background: "var(--bg-app)", borderRadius: "6px" }}>
              <span>💼 LinkedIn</span>
              {profile.links?.linkedin ? (
                <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: "var(--cyan)", fontWeight: 600 }}>
                  View Profile ↗
                </a>
              ) : (
                <span style={{ color: "var(--text-muted)", fontSize: "12px" }}>Not added</span>
              )}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "13px", padding: "8px 12px", background: "var(--bg-app)", borderRadius: "6px" }}>
              <span>⚡ LeetCode</span>
              {profile.links?.leetcode ? (
                <a href={profile.links.leetcode} target="_blank" rel="noopener noreferrer" style={{ color: "var(--cyan)", fontWeight: 600 }}>
                  View Profile ↗
                </a>
              ) : (
                <span style={{ color: "var(--text-muted)", fontSize: "12px" }}>Not added</span>
              )}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "13px", padding: "8px 12px", background: "var(--bg-app)", borderRadius: "6px" }}>
              <span>🟩 HackerRank</span>
              {profile.links?.hackerrank ? (
                <a href={profile.links.hackerrank} target="_blank" rel="noopener noreferrer" style={{ color: "var(--cyan)", fontWeight: 600 }}>
                  View Profile ↗
                </a>
              ) : (
                <span style={{ color: "var(--text-muted)", fontSize: "12px" }}>Not added</span>
              )}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "13px", padding: "8px 12px", background: "var(--bg-app)", borderRadius: "6px" }}>
              <span>🌐 Portfolio</span>
              {profile.links?.portfolio ? (
                <a href={profile.links.portfolio} target="_blank" rel="noopener noreferrer" style={{ color: "var(--cyan)", fontWeight: 600 }}>
                  View Website ↗
                </a>
              ) : (
                <span style={{ color: "var(--text-muted)", fontSize: "12px" }}>Not added</span>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Functional Badges & Milestones & GitHub API */}
        <div>
          {/* FUNCTIONAL BADGES & MILESTONES CARD */}
          <div className="dashboard-panel-card" style={{ marginBottom: "20px" }}>
            <div className="panel-header-row" style={{ marginBottom: 12 }}>
              <div className="panel-title-group">
                <h3>🏆 Badges & Milestones</h3>
                <p>Earn badges and level up milestones by solving problems and building projects.</p>
              </div>
              <span className="tag-pill" style={{ color: "#34d399", borderColor: "rgba(16, 185, 129, 0.3)" }}>
                {unlockedBadgesCount} / {badgesList.length} Unlocked
              </span>
            </div>

            {/* Toggle between Badges and Milestones view */}
            <div className="badges-toggle-nav">
              <button
                type="button"
                className={`badges-toggle-btn ${badgeView === "badges" ? "active" : ""}`}
                onClick={() => setBadgeView("badges")}
              >
                🏅 Achievement Badges ({unlockedBadgesCount}/{badgesList.length})
              </button>
              <button
                type="button"
                className={`badges-toggle-btn ${badgeView === "milestones" ? "active" : ""}`}
                onClick={() => setBadgeView("milestones")}
              >
                🎯 Placement Milestones ({milestonesList.filter((m) => m.isComplete).length}/{milestonesList.length})
              </button>
            </div>

            {badgeView === "badges" ? (
              <div className="badges-grid">
                {badgesList.map((badge) => (
                  <div
                    key={badge.id}
                    className={`badge-card ${badge.isUnlocked ? "unlocked" : "locked"}`}
                  >
                    <div>
                      <div className="badge-card-icon">
                        <span>{badge.icon}</span>
                        {badge.isUnlocked ? (
                          <span className="badge-status-pill unlocked">✓ Unlocked</span>
                        ) : (
                          <span className="badge-status-pill locked">🔒 Locked</span>
                        )}
                      </div>
                      <div className="badge-card-title">{badge.name}</div>
                      <div className="badge-card-desc">{badge.description}</div>
                    </div>
                    <div style={{ fontSize: "11px", color: badge.isUnlocked ? "var(--cyan)" : "var(--text-subtle)", fontWeight: 600 }}>
                      {badge.progressText}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="milestones-list">
                {milestonesList.map((m) => (
                  <div
                    key={m.id}
                    className={`milestone-item-card ${m.isComplete ? "completed" : ""}`}
                  >
                    <div className="milestone-header-row">
                      <div>
                        <span className="badge-tag-purple" style={{ fontSize: "10px", padding: "2px 8px", marginBottom: "4px" }}>
                          {m.level}
                        </span>
                        <h4 style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-main)", marginTop: "2px" }}>
                          {m.title}
                        </h4>
                      </div>
                      <span
                        style={{
                          fontSize: "12px",
                          fontWeight: 700,
                          color: m.isComplete ? "#34d399" : "var(--cyan)"
                        }}
                      >
                        {m.isComplete ? "Completed ✓" : `${m.progress}%`}
                      </span>
                    </div>

                    <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
                      {m.description}
                    </p>

                    <div className="milestone-track">
                      <div
                        className="milestone-fill"
                        style={{
                          width: `${m.progress}%`,
                          background: m.isComplete
                            ? "linear-gradient(90deg, #10b981, #06b6d4)"
                            : "linear-gradient(90deg, #6366f1, #3b82f6)"
                        }}
                      />
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "var(--text-subtle)", marginTop: "4px" }}>
                      <span>Requirement: {m.metricText}</span>
                      <span>{m.isComplete ? "Target reached" : `${100 - m.progress}% remaining`}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* GitHub Live API Fetcher Widget */}
          <div className="dashboard-panel-card">
            <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "8px", color: "var(--text-main)" }}>
              GitHub Developer Verification (API Reference)
            </h3>
            <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
              Real-time asynchronous API integration querying GitHub REST API for developer verification and repository statistics.
            </p>

            <GitHubStatsFetcher
              githubUrl={profile.links?.github}
              onSyncWithProfile={handleSyncGitHubBio}
            />
          </div>
        </div>
      </div>

      {/* SECTION: SHIPPED PROJECTS (Requirement 1 & 4) */}
      <div className="dashboard-panel-card" style={{ marginBottom: "24px" }}>
        <div className="panel-header-row" style={{ flexWrap: "wrap", gap: 12 }}>
          <div className="panel-title-group">
            <h3>📁 Shipped Projects & Portfolio</h3>
            <p>Showcase the web applications, tools, and technical projects you have developed.</p>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <Link to="/projects" className="btn-primary-gradient" style={{ textDecoration: "none", fontSize: "12.5px", padding: "6px 14px" }}>
              + Add / Manage Projects
            </Link>
          </div>
        </div>

        {projects.length === 0 ? (
          <div
            style={{
              padding: "36px 20px",
              textAlign: "center",
              border: "1px dashed var(--border-main)",
              borderRadius: "var(--radius-md)",
              color: "var(--text-muted)",
              marginTop: "12px"
            }}
          >
            <span style={{ fontSize: "36px", display: "block", marginBottom: "8px" }}>💻</span>
            <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-main)" }}>
              No projects added to your profile yet
            </p>
            <p style={{ fontSize: "13px", marginTop: "4px", marginBottom: "16px" }}>
              Highlight your software development work, tech stack, and GitHub links to stand out to recruiters.
            </p>
            <Link to="/projects" className="btn-primary-gradient" style={{ textDecoration: "none" }}>
              + Add Your First Project
            </Link>
          </div>
        ) : (
          <div className="profile-projects-grid">
            {projects.map((p) => {
              const techList = (p.technologies || "")
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean);

              return (
                <div key={p.id} className="profile-project-card">
                  <div>
                    <h4 style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-main)", marginBottom: "6px", display: "flex", alignItems: "center", gap: "6px" }}>
                      <span>💻</span>
                      <span>{p.name}</span>
                    </h4>
                    <p style={{ fontSize: "12.5px", color: "var(--text-muted)", lineHeight: "1.5", marginBottom: "12px" }}>
                      {p.description}
                    </p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "12px" }}>
                      {techList.length > 0 ? (
                        techList.map((t, idx) => (
                          <span
                            key={idx}
                            className="tag-pill"
                            style={{ fontSize: "11px", background: "rgba(99, 102, 241, 0.1)", borderColor: "rgba(99, 102, 241, 0.25)", color: "#c7d2fe" }}
                          >
                            {t}
                          </span>
                        ))
                      ) : (
                        <span className="tag-pill">{p.technologies || "Web Tech"}</span>
                      )}
                    </div>
                  </div>

                  {(p.githubUrl || p.liveUrl) && (
                    <div style={{ paddingTop: "12px", borderTop: "1px solid var(--border-main)", display: "flex", gap: "10px", flexWrap: "wrap" }}>
                      {p.githubUrl && (
                        <a
                          href={p.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="view-code-btn"
                          style={{ textDecoration: "none", fontSize: "12px", display: "inline-flex", alignItems: "center", gap: "4px" }}
                        >
                          🐙 Code ↗
                        </a>
                      )}
                      {p.liveUrl && (
                        <a
                          href={p.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-primary-gradient"
                          style={{ textDecoration: "none", fontSize: "12px", padding: "5px 12px", display: "inline-flex", alignItems: "center", gap: "4px" }}
                        >
                          🌐 Demo ↗
                        </a>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SECTION: PRACTICE ACTIVITY & RECENT SUBMISSIONS (Requirement 4) */}
      <div className="dashboard-panel-card" style={{ marginBottom: "24px" }}>
        <div className="panel-header-row" style={{ flexWrap: "wrap", gap: 12 }}>
          <div className="panel-title-group">
            <h3>📝 Recent Practice Submissions</h3>
            <p>Your latest saved problem submissions and code attempts from the Practice Library.</p>
          </div>
          <Link to="/submissions" className="panel-link-text" style={{ fontSize: "13px" }}>
            View all submissions ({submissions.length}) →
          </Link>
        </div>

        {submissions.length === 0 ? (
          <div
            style={{
              padding: "28px 16px",
              textAlign: "center",
              border: "1px dashed var(--border-main)",
              borderRadius: "var(--radius-md)",
              color: "var(--text-muted)",
              marginTop: "12px"
            }}
          >
            <p style={{ fontSize: "13.5px" }}>No submissions recorded yet.</p>
            <p style={{ fontSize: "12.5px", marginTop: "4px" }}>
              Solve practice questions in the Practice Library to see your activity logged here.
            </p>
            <Link to="/topics" className="btn-primary-gradient" style={{ display: "inline-block", marginTop: "12px", textDecoration: "none" }}>
              Start Practicing →
            </Link>
          </div>
        ) : (
          <div className="profile-activity-list">
            {submissions.slice(-4).reverse().map((sub) => (
              <div key={sub.id} className="profile-activity-item">
                <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
                  <span style={{ fontSize: "16px" }}>⚡</span>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 700, color: "var(--text-main)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {sub.questionTitle}
                    </div>
                    <div style={{ fontSize: "11.5px", color: "var(--text-muted)", display: "flex", gap: "8px", marginTop: "2px" }}>
                      <span>{sub.topicTitle || "DSA"}</span>
                      <span>•</span>
                      <span>{sub.language || "JavaScript"}</span>
                      <span>•</span>
                      <span>
                        {sub.submittedAt && !Number.isNaN(Date.parse(sub.submittedAt))
                          ? new Date(sub.submittedAt).toLocaleDateString([], { month: "short", day: "numeric" })
                          : "Recently"}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                  <span className={sub.status === "Executed successfully" ? "status-badge-accepted" : "tag-pill"} style={{ fontSize: "11px" }}>
                    {sub.status || "Recorded"}
                  </span>
                  <Link to="/submissions" className="view-code-btn" style={{ fontSize: "11.5px", padding: "4px 8px", textDecoration: "none" }}>
                    View Code
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {topicStats.length > 0 && (
          <div style={{ marginTop: "16px", paddingTop: "14px", borderTop: "1px solid var(--border-main)", display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 600 }}>Solved by Topic:</span>
            {topicStats.map(([topic, count]) => (
              <span key={topic} className="tag-pill" style={{ fontSize: "11px" }}>
                {topic}: <strong>{count}</strong>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Edit Profile Modal Dialog with URL Validation */}
      {isEditOpen && (
        <div className="modal-backdrop">
          <div className="modal-dialog-card wide">
            <div className="modal-header-row">
              <div>
                <span className="badge-tag-purple">PROFILE CONFIGURATION</span>
                <h3 style={{ marginTop: "4px" }}>Edit Profile & Professional Links</h3>
              </div>
              <button
                type="button"
                className="close-modal-btn"
                onClick={() => setIsEditOpen(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="custom-form">
              {/* Row 1: Name and Email */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div className="form-field-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    required
                    className="custom-input"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                </div>

                <div className="form-field-group">
                  <label>
                    <span>Email Address *</span>
                    <span className="field-constraint-tag">Valid email only</span>
                  </label>
                  <StrictEmailInput
                    required
                    value={editEmail}
                    onChange={setEditEmail}
                  />
                </div>
              </div>

              {/* Row 2: Title and Phone */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div className="form-field-group">
                  <label>Headline / Target Role</label>
                  <input
                    type="text"
                    className="custom-input"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="e.g. Frontend Developer · Student Developer"
                  />
                </div>

                <div className="form-field-group">
                  <label>
                    <span>Phone Number</span>
                    <span className="field-constraint-tag">Digits only</span>
                  </label>
                  <StrictNumberInput
                    value={editPhone}
                    onChange={setEditPhone}
                    placeholder="e.g. 9876543210"
                    maxLength={15}
                  />
                </div>
              </div>

              {/* Row 3: Location and Skills */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div className="form-field-group">
                  <label>Location & Work Preference</label>
                  <input
                    type="text"
                    className="custom-input"
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    placeholder="e.g. India · Open to internships"
                  />
                </div>

                <div className="form-field-group">
                  <label>Technical Skills (Comma separated)</label>
                  <input
                    type="text"
                    className="custom-input"
                    value={editSkills}
                    onChange={(e) => setEditSkills(e.target.value)}
                    placeholder="JavaScript, React, Python, DSA, HTML5, CSS3"
                  />
                </div>
              </div>

              {/* Row 4: About Me Bio */}
              <div className="form-field-group">
                <label>About Me / Technical Bio</label>
                <textarea
                  className="custom-textarea"
                  rows={3}
                  value={editAbout}
                  onChange={(e) => setEditAbout(e.target.value)}
                  placeholder="Tell recruiters about your projects, favorite technologies, and career goals..."
                />
              </div>

              {/* SECTION: Professional Profile Links */}
              <div style={{ marginTop: "12px", borderTop: "1px solid var(--border-main)", paddingTop: "16px" }}>
                <h4 style={{ fontSize: "14px", fontWeight: 700, marginBottom: "4px", color: "var(--text-main)" }}>
                  Connect Professional Links
                </h4>
                <p style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "16px" }}>
                  Links are validated to match official platform URL formats (e.g. github.com/username, linkedin.com/in/username).
                </p>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                  <div className="form-field-group">
                    <label>
                      <span>🐙 GitHub Profile</span>
                      <span className="field-constraint-tag">github.com/*</span>
                    </label>
                    <StrictUrlInput
                      platform="github"
                      value={editGithub}
                      onChange={setEditGithub}
                    />
                  </div>

                  <div className="form-field-group">
                    <label>
                      <span>💼 LinkedIn Profile</span>
                      <span className="field-constraint-tag">linkedin.com/in/*</span>
                    </label>
                    <StrictUrlInput
                      platform="linkedin"
                      value={editLinkedin}
                      onChange={setEditLinkedin}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginTop: "12px" }}>
                  <div className="form-field-group">
                    <label>
                      <span>⚡ LeetCode Profile</span>
                      <span className="field-constraint-tag">leetcode.com/*</span>
                    </label>
                    <StrictUrlInput
                      platform="leetcode"
                      value={editLeetcode}
                      onChange={setEditLeetcode}
                    />
                  </div>

                  <div className="form-field-group">
                    <label>
                      <span>🟩 HackerRank Profile</span>
                      <span className="field-constraint-tag">hackerrank.com/*</span>
                    </label>
                    <StrictUrlInput
                      platform="hackerrank"
                      value={editHackerrank}
                      onChange={setEditHackerrank}
                    />
                  </div>
                </div>

                <div className="form-field-group" style={{ marginTop: "12px" }}>
                  <label>
                    <span>🌐 Personal Portfolio / Deployed Site</span>
                    <span className="field-constraint-tag">Valid https:// link</span>
                  </label>
                  <StrictUrlInput
                    platform="portfolio"
                    value={editPortfolio}
                    onChange={setEditPortfolio}
                  />
                </div>
              </div>

              {formError && (
                <div className="form-error-banner">
                  ⚠️ {formError}
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "16px" }}>
                <button
                  type="button"
                  className="btn-secondary-dark"
                  onClick={() => setIsEditOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary-gradient">
                  Save Changes ✓
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toastMessage && <div className="toast-popup">✓ {toastMessage}</div>}
    </section>
  );
}
