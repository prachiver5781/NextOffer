// Dashboard Page Component - NextOffer
// Designed for B.Tech CSE Project Evaluation II
// Demonstrates:
// 1. Asynchronous API fetch reference (DailyAdviceWidget)
// 2. State visualization (Streak counter, daily challenge, submissions)
// 3. Profile completion status nudge

import React, { useMemo, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { dailyChallenge, continueLearningList } from "./data";
import { calculateStreak, getTodayDateString } from "./hooks";
import DailyAdviceWidget from "./components/DailyAdviceWidget";
import ProfessionalLinksBar from "./components/ProfessionalLinksBar";

export default function Dashboard({ currentUser }) {
  const navigate = useNavigate();
  const todayKey = new Date().toISOString().slice(0, 10);
  const userKey = currentUser?.id || currentUser?.email || "guest";
  const goalStorageKey = `nextoffer_daily_goal_${userKey}`;
  const reminderStorageKey = `nextoffer_goal_reminders_${userKey}`;
  const [remindersEnabled, setRemindersEnabled] = useState(() => {
    try { return localStorage.getItem(reminderStorageKey) !== "false"; } catch { return true; }
  });
  useEffect(() => {
    const syncReminderPreference = () => {
      try { setRemindersEnabled(localStorage.getItem(reminderStorageKey) !== "false"); } catch { setRemindersEnabled(true); }
    };
    window.addEventListener("storage", syncReminderPreference);
    syncReminderPreference();
    return () => window.removeEventListener("storage", syncReminderPreference);
  }, [reminderStorageKey]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  useEffect(() => {
    const storageKey = `nextoffer_recently_viewed_${currentUser?.id || currentUser?.email || "guest"}`;
    try { setRecentlyViewed(JSON.parse(localStorage.getItem(storageKey) || "[]")); }
    catch { setRecentlyViewed([]); }
  }, [currentUser?.id, currentUser?.email]);

  const [dailyGoal, setDailyGoal] = useState(() => {
    try { return JSON.parse(localStorage.getItem(goalStorageKey)) || { target: 2, done: 0, date: todayKey }; }
    catch { return { target: 2, done: 0, date: todayKey }; }
  });
  useEffect(() => {
    setDailyGoal((previous) => previous.date === todayKey ? previous : { ...previous, done: 0, date: todayKey });
  }, [todayKey]);
  useEffect(() => {
    localStorage.setItem(goalStorageKey, JSON.stringify(dailyGoal));
  }, [dailyGoal, goalStorageKey]);
  const goalPercent = Math.min(100, Math.round((dailyGoal.done / Math.max(1, dailyGoal.target)) * 100));
  const weekDays = useMemo(() => {
    const dates = currentUser?.activeDates || [];
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - index));
      const key = date.toISOString().slice(0, 10);
      return { label: date.toLocaleDateString("en-US", { weekday: "short" }), active: dates.includes(key), key };
    });
  }, [currentUser?.activeDates]);

  // Calculate current streak count from active practice dates
  const streak = calculateStreak(currentUser?.activeDates || []);

  // Extract user's first name for greeting
  const userName = currentUser?.profile?.name || currentUser?.name || "Student";
  const firstName = userName.split(" ")[0];

  const submissions = currentUser?.submissions || [];
  const profile = currentUser?.profile || {};
  const links = profile.links || {};

  // Compute brief completion status for dashboard nudge
  const completionPercentage = useMemo(() => {
    let score = 0;
    if (profile.name || currentUser?.name) score += 15;
    if (profile.email || currentUser?.email) score += 15;
    if (profile.phone) score += 10;
    if (profile.about) score += 10;
    if ((profile.skills || []).length >= 3) score += 15;
    if (links.github) score += 15;
    if (links.linkedin) score += 10;
    if ((currentUser?.projects || []).length >= 1) score += 10;
    return Math.min(100, score);
  }, [profile, links, currentUser]);

  return (
    <section>
      {/* Welcome header with user's name and quick links */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h2 style={{ fontSize: "22px", fontWeight: 700, color: "var(--text-main)" }}>
            Welcome back, {firstName} 👋
          </h2>
          <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
            Track your coding streak, placement milestones, and resume progress.
          </p>
        </div>

        {/* Clickable links pills */}
        <ProfessionalLinksBar links={links} />
      </div>

      {/* Hero card showing project mission and animated streak widget */}
      <div className="dashboard-hero-card">
        <div className="hero-left-content">
          <div className="badge-tag-purple">
            <span>✨</span> PLACEMENT PREPARATION
          </div>
          <h1>Build skills that<br />compound over time.</h1>
          <p>
            Practice coding every day, ship impactful projects, and turn your technical consistency into job offers.
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

        {/* Orbit animation showing active learning streak */}
        <div className="hero-radar-wrapper">
          <div className="orbit-circle orbit-1">
            <div className="orbit-particle particle-1">💻</div>
          </div>
          <div className="orbit-circle orbit-2">
            <div className="orbit-particle particle-2">🚀</div>
          </div>
          <div className="orbit-circle orbit-3">
            <div className="orbit-particle particle-3">💎</div>
          </div>
          <div className="radar-center-badge">
            <span className="streak-num">{streak}</span>
            <span className="streak-lbl">{streak === 1 ? "Day Streak" : "Days Streak"}</span>
          </div>
        </div>
      </div>

      {/* Personalized daily goals and weekly activity: local state + persistent storage */}
      <div className="dashboard-horizontal-grid goal-activity-grid">
        <div className="dashboard-panel-card daily-goal-card">
          <div className="panel-header-row">
            <div className="panel-title-group"><h3>🎯 Daily learning goal</h3><p>Small steps, consistent progress</p></div>
            <span className="goal-percent-label">{goalPercent}%</span>
          </div>
          <div className="goal-setting-row">
            <label htmlFor="daily-goal-target">Questions per day</label>
            <select id="daily-goal-target" value={dailyGoal.target} onChange={(event) => setDailyGoal((g) => ({ ...g, target: Number(event.target.value) }))}>
              {[1, 2, 3, 5, 10].map((n) => <option key={n} value={n}>{n} {n === 1 ? "question" : "questions"}</option>)}
            </select>
          </div>
          <div className="goal-progress-track"><div className="goal-progress-fill" style={{ width: `${goalPercent}%` }} /></div>
          <div className="goal-progress-caption"><span>{Math.min(dailyGoal.done, dailyGoal.target)} of {dailyGoal.target} completed</span><span>{Math.max(0, dailyGoal.target - dailyGoal.done)} left</span></div>
          <button className="btn-primary-gradient goal-complete-btn" onClick={() => {
            setDailyGoal((g) => ({ ...g, done: Math.min(g.target, g.done + 1) }));
            if (currentUser) {
              const today = getTodayDateString();
              const activeDates = Array.from(new Set([...(currentUser.activeDates || []), today]));
              updateUser?.({ ...currentUser, activeDates });
            }
          }} disabled={dailyGoal.done >= dailyGoal.target}>
            {dailyGoal.done >= dailyGoal.target ? "✓ Daily goal completed" : "+ Mark a question complete"}
          </button>
          {remindersEnabled && dailyGoal.done < dailyGoal.target && <p className="goal-reminder">💡 Reminder: finish your goal today to keep your learning routine on track.</p>}
        </div>
        <div className="dashboard-panel-card activity-card">
          <div className="panel-header-row"><div className="panel-title-group"><h3>📈 Weekly activity</h3><p>Your last 7 days of learning</p></div><span className="activity-streak">🔥 {streak} day streak</span></div>
          <div className="weekly-activity-chart" role="img" aria-label="Weekly activity chart">
            {weekDays.map((day) => <div className="activity-day" key={day.key}><div className={`activity-bar ${day.active ? "is-active" : ""}`} style={{ height: day.active ? "76px" : "22px" }} title={day.active ? "Learning activity recorded" : "No activity recorded"} /><span>{day.label}</span></div>)}
          </div>
          <div className="activity-legend"><span className="legend-dot" /> Active day <span className="legend-dot legend-dot-muted" /> Rest day</div>
        </div>
      </div>


      {/* Profile completion mini-nudge banner if < 100% */}
      {completionPercentage < 100 && (
        <div
          style={{
            background: "var(--bg-surface)",
            border: "1px solid var(--border-main)",
            borderRadius: "var(--radius-md)",
            padding: "12px 18px",
            marginBottom: "20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "18px" }}>📈</span>
            <div>
              <span style={{ fontSize: "13.5px", fontWeight: 700, color: "var(--text-main)" }}>
                Profile Completion: {completionPercentage}%
              </span>
              <span style={{ fontSize: "12px", color: "var(--text-muted)", marginLeft: "8px" }}>
                Add your professional links & projects to reach 100%
              </span>
            </div>
          </div>
          <button
            type="button"
            className="btn-secondary-dark"
            style={{ fontSize: "12px", padding: "6px 14px" }}
            onClick={() => navigate("/profile")}
          >
            Complete Profile →
          </button>
        </div>
      )}


      {/* 2-column section: Daily Coding Challenge & Continue Learning */}
      <div className="dashboard-horizontal-grid">
        {/* Daily Challenge Box */}
        <div className="dashboard-panel-card">
          <div className="panel-header-row">
            <div className="panel-title-group">
              <h3>Daily challenge</h3>
              <p>Keep your streak alive</p>
            </div>
            <Link to="/topics" className="panel-link-text">
              View all →
            </Link>
          </div>

          <div className="daily-challenge-box" style={{ flex: 1 }}>
            <span className="challenge-number-watermark">01</span>
            <div className="challenge-details">
              <div className="challenge-tags-top">
                <span className="difficulty-badge-easy">EASY</span>
                <span style={{ fontSize: "11px", color: "var(--text-subtle)" }}>{dailyChallenge.acceptance}</span>
              </div>
              <h4>{dailyChallenge.title}</h4>
              <p>{dailyChallenge.description}</p>
              <div className="tag-pills-row">
                {dailyChallenge.tags.slice(0, 3).map((tag) => (
                  <span className="tag-pill" key={tag}>{tag}</span>
                ))}
              </div>
            </div>
            <button
              className="challenge-action-circle"
              onClick={() => navigate("/topics/arrays")}
              title="Solve Problem"
            >
              ➔
            </button>
          </div>
        </div>

        {/* Continue Learning Course Progress */}
        <div className="dashboard-panel-card">
          <div className="panel-header-row">
            <div className="panel-title-group">
              <h3>Continue learning</h3>
              <p>Pick up where you left off</p>
            </div>
            <Link to="/topics" className="panel-link-text">
              Library →
            </Link>
          </div>

          <div className="continue-learning-list">
            {continueLearningList.map((item) => (
              <div
                className="continue-learning-item"
                key={item.id}
                onClick={() => navigate(`/topics`)}
              >
                <span className="cl-icon">{item.icon}</span>
                <div className="cl-progress-info">
                  <div className="cl-title-row">
                    <strong>{item.title}</strong>
                    <span>{item.progress}%</span>
                  </div>
                  <div className="progress-bar-track">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                </div>
                <span className="cl-arrow">➔</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recently viewed / resumed learning shortcuts */}
      <div className="dashboard-panel-card recent-learning-card">
        <div className="panel-header-row">
          <div className="panel-title-group"><h3>Recently viewed &amp; continue learning</h3><p>Jump back into a question or your roadmap</p></div>
          <Link to="/roadmap" className="panel-link-text">Open roadmap →</Link>
        </div>
        <div className="recent-learning-grid">
          {recentlyViewed.map((item, index) => (
            <button className="recent-learning-item" key={`${item.type || "topic"}-${item.id || item.title}-${index}`} onClick={() => navigate(item.to || "/topics")}>
              <span className="recent-learning-icon">{item.type === "question" ? "🧩" : item.type === "roadmap" ? "🗺️" : "📘"}</span><span className="recent-learning-copy"><strong>{item.title}</strong><small>{item.subtitle}</small></span><span className="recent-learning-arrow">↗</span>
            </button>
          ))}
          {!recentlyViewed.length && <p style={{ color: "var(--text-muted)", fontSize: 13, padding: 12 }}>Your recently viewed questions and roadmaps will appear here as you explore NextOffer.</p>}
          {submissions.slice(-2).reverse().map((item, index) => (
            <button className="recent-learning-item" key={item.id || item.questionTitle} onClick={() => navigate(`/topics/${item.topicId || "arrays"}`)}>
              <span className="recent-learning-icon">🧩</span><span className="recent-learning-copy"><strong>{item.questionTitle}</strong><small>{item.topicTitle || "Practice question"} · Submitted</small></span><span className="recent-learning-arrow">↗</span>
            </button>
          ))}
          <button className="recent-learning-item" onClick={() => navigate("/roadmap")}>
            <span className="recent-learning-icon">🗺️</span><span className="recent-learning-copy"><strong>Placement roadmap</strong><small>Review your next milestones</small></span><span className="recent-learning-arrow">↗</span>
          </button>
        </div>
      </div>

      {/* Recent submissions section */}
      <div className="dashboard-panel-card">
        <div className="panel-header-row">
          <div className="panel-title-group">
            <h3>Recent Submissions</h3>
            <p>Your recorded code solutions and status</p>
          </div>
          <Link to="/submissions" className="panel-link-text">
            View all submissions ({submissions.length}) →
          </Link>
        </div>

        {submissions.length === 0 ? (
          <div style={{ padding: "20px 0", color: "var(--text-muted)", fontSize: "13.5px" }}>
            No submissions recorded yet. Go to the Practice Library to solve your first question!
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "14px" }}>
            {submissions.slice(-3).reverse().map((sub) => (
              <div
                key={sub.id}
                style={{
                  background: "var(--bg-surface-elevated)",
                  padding: "16px",
                  borderRadius: "10px",
                  border: "1px solid var(--border-main)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between"
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <span className="tag-pill">{sub.topicTitle || "DSA"}</span>
                    <span className="status-badge-accepted">✓ {sub.status}</span>
                  </div>
                  <h4 style={{ fontSize: "14.5px", fontWeight: 700, color: "var(--text-main)", marginBottom: "4px" }}>
                    {sub.questionTitle}
                  </h4>
                  <p style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>{sub.submittedAt}</p>
                </div>
                <Link
                  to="/submissions"
                  className="view-code-btn"
                  style={{ alignSelf: "flex-start", marginTop: "12px" }}
                >
                  View Code →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Asynchronous REST API Fetch Widget (kept lower on the dashboard) */}
      <DailyAdviceWidget />

    </section>
  );
}
