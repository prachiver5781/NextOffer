// Daily Placement Advice & Tech Insight Widget - NextOffer
// Designed for B.Tech CSE Project Evaluation II
// Demonstrates:
// 1. Asynchronous state management (loading, error, data)
// 2. useEffect lifecycle hook for automated data loading on mount
// 3. User-triggered manual refresh handling

import React, { useState, useEffect, useCallback } from "react";

// Curated placement tips used as resilient fallbacks or tech additions
const FALLBACK_TIPS = [
  "When solving DSA problems, first articulate the brute force O(N^2) solution before optimizing to O(N) or O(N log N).",
  "In React technical rounds, be ready to explain why keys are needed in lists and how the Virtual DOM reconciliation algorithm works.",
  "Write clean code with meaningful variable names during technical interviews—interviewers value readability just as much as correctness.",
  "Always clarify input constraints (e.g. Can array have negative values? Is input sorted?) before writing code in live interviews.",
  "Master Git fundamentals: understand commit history, branch merging, rebasing, and how to write descriptive commit messages."
];

export default function DailyAdviceWidget() {
  const [advice, setAdvice] = useState("");
  const [author, setAuthor] = useState("Placement Cell Mentor");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Asynchronously fetch advice from public API
  const fetchAdvice = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch from public AdviceSlip REST API with cache-busting timestamp
      const response = await fetch(`https://api.adviceslip.com/advice?t=${Date.now()}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch advice (Status: ${response.status})`);
      }
      const data = await response.json();
      if (data && data.slip && data.slip.advice) {
        setAdvice(data.slip.advice);
        setAuthor("Industry Insight API");
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.warn("API Advice fetch notice, switching to curated engineering tip:", err.message);
      // Graceful fallback while also exposing an error state for evaluation.
      const randomTip = FALLBACK_TIPS[Math.floor(Math.random() * FALLBACK_TIPS.length)];
      setAdvice(randomTip);
      setAuthor("Senior Placement Advisory (offline fallback)");
      setError("Live advice could not be loaded. Showing a saved tip instead.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch advice once when component mounts
  useEffect(() => {
    fetchAdvice();
  }, [fetchAdvice]);

  return (
    <div
      style={{
        background: "linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(6, 182, 212, 0.08) 100%)",
        border: "1px solid rgba(99, 102, 241, 0.25)",
        borderRadius: "var(--radius-lg)",
        padding: "20px 24px",
        marginBottom: "24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "16px",
        flexWrap: "wrap"
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: "14px", flex: 1, minWidth: "260px" }}>
        <span style={{ fontSize: "28px", lineHeight: "1" }}>💡</span>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <span className="badge-tag-purple" style={{ marginBottom: 0, padding: "2px 8px", fontSize: "10px" }}>
              API FETCH • PLACEMENT TIP
            </span>
            <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>Source: {author}</span>
          </div>

          {loading ? (
            <p role="status" style={{ fontSize: "13.5px", color: "var(--text-muted)", fontStyle: "italic" }}>
              Fetching latest technical interview advice via API...
            </p>
          ) : (
            <>
              {error && <p role="status" style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "5px" }}>{error}</p>}
              <p style={{ fontSize: "14px", color: "var(--text-main)", fontWeight: 500, lineHeight: "1.5" }}>
                "{advice}"
              </p>
            </>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={fetchAdvice}
        disabled={loading}
        className="btn-secondary-dark"
        style={{ fontSize: "12px", padding: "8px 14px" }}
        title="Trigger asynchronous API fetch"
      >
        {loading ? "Fetching..." : "Next Tip ↺"}
      </button>
    </div>
  );
}
