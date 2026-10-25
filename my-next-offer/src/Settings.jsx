import React, { useEffect, useState } from "react";
import { useAuth } from "./context/AuthContext";
import { useTimeTracker } from "./hooks";

export default function Settings({ theme, toggleTheme }) {
  const { currentUser } = useAuth();
  const userKey = currentUser?.id || currentUser?.email || "guest";
  const { totalFormatted, todayFormatted, sessionFormatted, resetSession } = useTimeTracker(userKey);

  const reminderKey = `nextoffer_goal_reminders_${userKey}`;
  const [remindersEnabled, setRemindersEnabled] = useState(() => {
    try { return localStorage.getItem(reminderKey) !== "false"; }
    catch { return true; }
  });

  useEffect(() => {
    try { localStorage.setItem(reminderKey, String(remindersEnabled)); } catch { /* storage may be unavailable */ }
  }, [reminderKey, remindersEnabled]);

  return (
    <section className="settings-page" style={{ maxWidth: 900, margin: "0 auto" }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ color: "var(--text-main)", fontSize: 26, fontWeight: 800, marginBottom: 8 }}>Settings</h2>
        <p style={{ color: "var(--text-muted)" }}>Manage your appearance, active learning time, and practice reminders.</p>
      </div>

      {/* Time Spent by User Section */}
      <div className="dashboard-panel-card" style={{ marginBottom: 18 }}>
        <div className="panel-header-row">
          <div className="panel-title-group">
            <h3>⏱️ Time Spent Learning & Practicing</h3>
            <p>Track your active learning duration, daily focus time, and current session.</p>
          </div>
          <span className="tag-pill" style={{ color: "var(--cyan)", borderColor: "rgba(6, 182, 212, 0.3)" }}>
            Live Tracker
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, margin: "16px 0" }}>
          <div style={{ background: "var(--bg-app)", padding: "16px", borderRadius: "10px", border: "1px solid var(--border-main)" }}>
            <span style={{ fontSize: "12px", color: "var(--text-muted)", display: "block", marginBottom: 4 }}>Total Time Spent</span>
            <strong style={{ fontSize: "22px", color: "var(--text-main)", fontWeight: 800 }}>{totalFormatted}</strong>
            <small style={{ display: "block", color: "var(--text-subtle)", fontSize: "11px", marginTop: 4 }}>Cumulative lifetime</small>
          </div>

          <div style={{ background: "var(--bg-app)", padding: "16px", borderRadius: "10px", border: "1px solid var(--border-main)" }}>
            <span style={{ fontSize: "12px", color: "var(--text-muted)", display: "block", marginBottom: 4 }}>Today's Focus Time</span>
            <strong style={{ fontSize: "22px", color: "#34d399", fontWeight: 800 }}>{todayFormatted}</strong>
            <small style={{ display: "block", color: "var(--text-subtle)", fontSize: "11px", marginTop: 4 }}>Active today</small>
          </div>

          <div style={{ background: "var(--bg-app)", padding: "16px", borderRadius: "10px", border: "1px solid var(--border-main)" }}>
            <span style={{ fontSize: "12px", color: "var(--text-muted)", display: "block", marginBottom: 4 }}>Current Session</span>
            <strong style={{ fontSize: "22px", color: "#c084fc", fontWeight: 800 }}>{sessionFormatted}</strong>
            <small style={{ display: "block", color: "var(--text-subtle)", fontSize: "11px", marginTop: 4 }}>This tab session</small>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, paddingTop: 12, borderTop: "1px solid var(--border-main)" }}>
          <p style={{ color: "var(--text-muted)", fontSize: "12px", margin: 0 }}>
            Active time is automatically measured while you browse and practice on NextOffer.
          </p>
          <button
            type="button"
            className="view-code-btn"
            style={{ fontSize: "12px" }}
            onClick={resetSession}
          >
            Reset Session Ticker
          </button>
        </div>
      </div>

      {/* Appearance Section */}
      <div className="dashboard-panel-card" style={{ marginBottom: 18 }}>
        <div className="panel-header-row">
          <div className="panel-title-group"><h3>🎨 Appearance</h3><p>Choose the theme used throughout the app.</p></div>
          <span className="tag-pill">{theme === "dark" ? "Dark mode" : "Light mode"}</span>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <button type="button" className="btn-primary-gradient" onClick={toggleTheme}>
            {theme === "dark" ? "☀️ Switch to Light Mode" : "🌙 Switch to Dark Mode"}
          </button>
          <span style={{ color: "var(--text-muted)", fontSize: 13 }}>Your theme preference is saved automatically.</span>
        </div>
      </div>

      {/* Reminders Section */}
      <div className="dashboard-panel-card" style={{ marginBottom: 18 }}>
        <div className="panel-header-row">
          <div className="panel-title-group"><h3>🔔 Daily goals and reminders</h3><p>Get an in-app reminder when today's goal is unfinished.</p></div>
          <span className="tag-pill">{remindersEnabled ? "Enabled" : "Paused"}</span>
        </div>
        <label style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer", color: "var(--text-main)" }}>
          <input type="checkbox" checked={remindersEnabled} onChange={(event) => setRemindersEnabled(event.target.checked)} style={{ width: 18, height: 18, accentColor: "var(--primary)" }} />
          Show daily learning goal reminders on the dashboard
        </label>
        <p style={{ color: "var(--text-muted)", fontSize: 12, marginTop: 12 }}>This setting is stored separately for your account in local storage.</p>
      </div>
    </section>
  );
}
