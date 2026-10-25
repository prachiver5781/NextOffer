git add src/Dashboard.jsx src/components/DailyAdviceWidget.jsx src/components/ProfessionalLinksBar.jsx
// Designed for B.Tech CSE Project Evaluation II
// Implements Image 1 Requirements:
// 1. Clickable icons on the profile and resume
// 2. Direct external links to GitHub, LinkedIn, LeetCode, HackerRank, and Portfolio

import React from "react";

export default function ProfessionalLinksBar({ links = {}, onEditClick, className = "" }) {
  const platforms = [
    { key: "github", label: "GitHub", icon: "🐙", color: "#f8fafc" },
    { key: "linkedin", label: "LinkedIn", icon: "💼", color: "#38bdf8" },
    { key: "leetcode", label: "LeetCode", icon: "⚡", color: "#f59e0b" },
    { key: "hackerrank", label: "HackerRank", icon: "🟩", color: "#10b981" },
    { key: "portfolio", label: "Portfolio", icon: "🌐", color: "#c084fc" }
  ];

  // Helper to ensure URL starts with http(s)://
  const formatUrl = (platformKey, url) => {
    if (!url) return "";
    const rule = PLATFORM_RULES[platformKey];
    return rule ? rule.normalize(url) : (url.startsWith("http") ? url : `https://${url}`);
  };

  const activeLinks = platforms.filter((p) => Boolean(links[p.key] && links[p.key].trim()));

  if (activeLinks.length === 0) {
    return (
      <div
        className={`professional-links-empty ${className}`}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          background: "rgba(255, 255, 255, 0.04)",
          border: "1px dashed var(--border-main)",
          padding: "6px 14px",
          borderRadius: "var(--radius-full)",
          fontSize: "12px",
          color: "var(--text-muted)"
        }}
      >
        <span>🔗 No professional links added yet.</span>
        {onEditClick && (
          <button
            type="button"
            onClick={onEditClick}
            style={{
              background: "none",
              border: "none",
              color: "var(--cyan)",
              fontWeight: 600,
              cursor: "pointer",
              padding: 0
            }}
          >
            + Add Links
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      className={`professional-links-container ${className}`}
      style={{
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "10px"
      }}
    >
      {activeLinks.map((p) => {
        const url = formatUrl(p.key, links[p.key]);
        return (
          <a
            key={p.key}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="professional-link-pill"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: "var(--bg-surface-elevated)",
              border: "1px solid var(--border-main)",
              color: "var(--text-main)",
              fontSize: "12px",
              fontWeight: 600,
              padding: "5px 12px",
              borderRadius: "var(--radius-full)",
              textDecoration: "none",
              transition: "var(--transition)",
              cursor: "pointer"
            }}
            title={`Open ${p.label} profile (${url})`}
          >
            <span style={{ fontSize: "14px" }}>{p.icon}</span>
            <span>{p.label}</span>
            <span style={{ fontSize: "10px", color: "var(--text-muted)" }}>↗</span>
          </a>
        );
      })}
    </div>
  );
}
