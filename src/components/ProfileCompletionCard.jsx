// Profile Completion Indicator Component - NextOffer
// Designed for B.Tech CSE Project Evaluation II
// Implements Image 1 Requirements:
// 1. Calculate and display profile completion percentage based on filled fields
// 2. Suggest missing sections (e.g. GitHub, LinkedIn, skills, projects) with quick action buttons

import React, { useMemo } from "react";
import { Link } from "react-router-dom";

export default function ProfileCompletionCard({ currentUser, onOpenEdit }) {
  const profile = currentUser?.profile || {};
  const links = profile.links || {};
  const projects = currentUser?.projects || [];
  const skills = profile.skills || [];
  const education = profile.education || [];

  // Compute completion items and total percentage
  const { percentage, completedCount, totalCount, missingSuggestions } = useMemo(() => {
    const checklist = [
      {
        id: "name",
        label: "Full Name",
        isComplete: Boolean(profile.name || currentUser?.name),
        weight: 10,
        tip: "Add your full name"
      },
      {
        id: "title",
        label: "Headline / Role",
        isComplete: Boolean(profile.title && profile.title.trim().length > 3),
        weight: 10,
        tip: "Set your target role or student headline"
      },
      {
        id: "email",
        label: "Email Address",
        isComplete: Boolean(profile.email || currentUser?.email),
        weight: 10,
        tip: "Add a verified email address"
      },
      {
        id: "phone",
        label: "Phone Number",
        isComplete: Boolean(profile.phone && profile.phone.trim().length >= 10),
        weight: 10,
        tip: "Add your contact phone number for recruiters"
      },
      {
        id: "about",
        label: "About Me Bio",
        isComplete: Boolean(profile.about && profile.about.trim().length >= 20),
        weight: 10,
        tip: "Write a short 2-3 sentence technical bio"
      },
      {
        id: "skills",
        label: "Technical Skills (3+)",
        isComplete: skills.length >= 3,
        weight: 15,
        tip: "Add at least 3 core technical skills (e.g. React, DSA, JS)"
      },
      {
        id: "github",
        label: "GitHub Profile Link",
        isComplete: Boolean(links.github && links.github.trim().length > 0),
        weight: 10,
        tip: "Link your GitHub profile to showcase code repositories"
      },
      {
        id: "linkedin",
        label: "LinkedIn Profile Link",
        isComplete: Boolean(links.linkedin && links.linkedin.trim().length > 0),
        weight: 10,
        tip: "Link your LinkedIn profile for networking"
      },
      {
        id: "coding_links",
        label: "LeetCode / HackerRank",
        isComplete: Boolean(links.leetcode || links.hackerrank || links.portfolio),
        weight: 5,
        tip: "Add LeetCode, HackerRank, or portfolio link"
      },
      {
        id: "projects",
        label: "Shipped Projects",
        isComplete: projects.length >= 1,
        weight: 10,
        tip: "Add at least 1 project to your portfolio / resume"
      }
    ];

    let totalScore = 0;
    let completedItems = 0;
    const missing = [];

    checklist.forEach((item) => {
      if (item.isComplete) {
        totalScore += item.weight;
        completedItems += 1;
      } else {
        missing.push(item);
      }
    });

    return {
      percentage: Math.min(100, Math.round(totalScore)),
      completedCount: completedItems,
      totalCount: checklist.length,
      missingSuggestions: missing
    };
  }, [profile, links, projects, skills, education, currentUser]);

  // Visual color scheme based on completion level
  const getProgressColor = (pct) => {
    if (pct >= 80) return "linear-gradient(90deg, #10b981, #06b6d4)";
    if (pct >= 50) return "linear-gradient(90deg, #6366f1, #3b82f6)";
    return "linear-gradient(90deg, #f59e0b, #ef4444)";
  };

  const getStatusBadge = (pct) => {
    if (pct === 100) return { text: "100% Placement Ready 🚀", color: "#34d399", bg: "rgba(16, 185, 129, 0.15)" };
    if (pct >= 80) return { text: "Strong Candidate Profile ✨", color: "#38bdf8", bg: "rgba(6, 182, 212, 0.15)" };
    if (pct >= 50) return { text: "Good Progress • Keep Going 📈", color: "#a5b4fc", bg: "rgba(99, 102, 241, 0.15)" };
    return { text: "Needs Attention ⚠️", color: "#fca5a5", bg: "rgba(239, 68, 68, 0.15)" };
  };

  const status = getStatusBadge(percentage);

  return (
    <div
      className="dashboard-panel-card"
      style={{
        marginBottom: "24px",
        background: "var(--bg-surface)",
        border: "1px solid var(--border-main)",
        position: "relative",
        overflow: "hidden"
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-main)" }}>
              Profile Completion Indicator
            </h3>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 700,
                color: status.color,
                background: status.bg,
                padding: "3px 10px",
                borderRadius: "var(--radius-full)"
              }}
            >
              {status.text}
            </span>
          </div>
          <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
            Complete all sections to create an ATS-ready candidate profile for placement drives.
          </p>
        </div>

        {/* Percentage Badge */}
        <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
          <span style={{ fontSize: "32px", fontWeight: 800, color: percentage >= 80 ? "#34d399" : "var(--cyan)" }}>
            {percentage}%
          </span>
          <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>completed</span>
        </div>
      </div>

      {/* Animated Progress Bar */}
      <div
        style={{
          width: "100%",
          height: "8px",
          background: "var(--bg-surface-elevated)",
          borderRadius: "4px",
          overflow: "hidden",
          marginBottom: "16px"
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            height: "100%",
            background: getProgressColor(percentage),
            transition: "width 0.4s ease-in-out"
          }}
        />
      </div>

      {/* Missing Recommendations Checklist */}
      {missingSuggestions.length > 0 ? (
        <div style={{ marginTop: "12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
              Suggested improvements ({missingSuggestions.length} missing):
            </span>
            <button
              type="button"
              onClick={onOpenEdit}
              style={{
                background: "none",
                border: "none",
                color: "var(--cyan)",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer"
              }}
            >
              Edit Profile to Complete →
            </button>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              gap: "8px"
            }}
          >
            {missingSuggestions.slice(0, 4).map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  if (item.id === "projects") {
                    // Navigate to projects
                    window.location.hash = "";
                  } else {
                    onOpenEdit();
                  }
                }}
                style={{
                  background: "var(--bg-surface-elevated)",
                  border: "1px solid var(--border-main)",
                  borderRadius: "var(--radius-sm)",
                  padding: "8px 12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  transition: "var(--transition)"
                }}
                title="Click to complete this section"
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ color: "#f87171", fontSize: "12px" }}>+</span>
                  <span style={{ fontSize: "12.5px", color: "var(--text-main)" }}>{item.label}</span>
                </div>
                <span style={{ fontSize: "11px", color: "var(--cyan)", fontWeight: 600 }}>
                  +{item.weight}%
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div
          style={{
            padding: "10px 14px",
            background: "rgba(16, 185, 129, 0.1)",
            border: "1px solid rgba(16, 185, 129, 0.25)",
            borderRadius: "var(--radius-sm)",
            color: "#34d399",
            fontSize: "13px",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}
        >
          <span>✓</span>
          <span>Outstanding! All core profile fields and professional links are fully populated.</span>
        </div>
      )}
    </div>
  );
}
