// Roadmap Page Component
// 6-Week semester curriculum roadmap for technical placement preparation

import React from "react";
import { roadmap } from "./data";

export default function Roadmap() {
  return (
    <section>
      {/* Header */}
      <div style={{ marginBottom: "28px" }}>
        <div className="badge-tag-purple">🗺️ CURRICULUM TIMELINE</div>
        <h1 style={{ fontSize: "28px", fontWeight: 800, color: "var(--text-main)", marginBottom: "6px" }}>
          Full-Stack & Placement Roadmap
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
          Structured 6-week curriculum covering Web Fundamentals, Modern JavaScript ES6+, React Hooks, and Deployment.
        </p>
      </div>

      {/* Week by week cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {roadmap.map((item) => (
          <div className="dashboard-panel-card" key={item.week}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <span className="badge-tag-purple">{item.week}</span>
              <span className="difficulty-badge-easy">{item.tag}</span>
            </div>
            <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "8px" }}>{item.title}</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {item.items.map((i) => (
                <span className="tag-pill" key={i}>{i}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
