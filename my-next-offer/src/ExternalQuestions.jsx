import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { saveSubmission } from "./submissionUtils";
import { getTodayDateString } from "./hooks";

const API_URL = "https://codeforces.com/api/problemset.problems";
const CACHE_KEY = "nextoffer_codeforces_problem_cache_v1";
const CACHE_TTL = 6 * 60 * 60 * 1000;

function topicTags(topicTitle = "") {
  const title = topicTitle.toLowerCase();
  if (/array|search|two pointer|prefix/.test(title)) return ["implementation", "two pointers", "binary search"];
  if (/string|text/.test(title)) return ["strings", "implementation"];
  if (/tree|graph|dfs|bfs/.test(title)) return ["dfs and similar", "graphs", "trees"];
  if (/dynamic|dp/.test(title)) return ["dp"];
  if (/math|number/.test(title)) return ["math", "number theory"];
  if (/sort|greedy/.test(title)) return ["sortings", "greedy"];
  if (/javascript|react|frontend|web/.test(title)) return ["implementation", "strings"];
  return ["implementation", "greedy"];
}

function problemUrl(problem) {
  return `https://codeforces.com/problemset/problem/${problem.contestId}/${problem.index}`;
}

function difficultyLabel(rating) {
  if (!rating) return "Unrated";
  if (rating < 1200) return "Easy";
  if (rating < 1800) return "Medium";
  return "Hard";
}

const STARTER_CODE_TEMPLATES = {
  JavaScript: (p) => `// Solution for: ${p.name}\n// Tags: ${(p.tags || []).join(", ")}\n\nfunction solve(input) {\n  // Write your JavaScript solution here\n  return input;\n}\n\nconsole.log(solve("test"));\n`,
  Python: (p) => `# Solution for: ${p.name}\n# Tags: ${(p.tags || []).join(", ")}\n\ndef solve():\n    # Write your Python solution here\n    pass\n\nif __name__ == "__main__":\n    solve()\n`,
  Java: (p) => `// Solution for: ${p.name}\nimport java.util.*;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Write your Java solution here\n    }\n}\n`,
  "C++": (p) => `// Solution for: ${p.name}\n#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    // Write your C++ solution here\n    return 0;\n}\n`
};

export default function ExternalQuestions({ topicTitle = "Programming", compact = false, currentUser: propsUser, updateUser: propsUpdateUser }) {
  const auth = useAuth();
  const currentUser = propsUser || auth?.currentUser;
  const updateUser = propsUpdateUser || auth?.updateUser;

  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  // Modal submission state
  const [activeModalProblem, setActiveModalProblem] = useState(null);
  const [solutionLanguage, setSolutionLanguage] = useState("JavaScript");
  const [solutionCode, setSolutionCode] = useState("");
  const [solutionNotes, setSolutionNotes] = useState("");
  const [submitSuccessMsg, setSubmitSuccessMsg] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function loadProblems() {
      setLoading(true);
      setError("");
      try {
        let cached = null;
        try {
          const saved = JSON.parse(sessionStorage.getItem(CACHE_KEY) || "null");
          if (saved?.savedAt && Date.now() - saved.savedAt < CACHE_TTL && Array.isArray(saved.problems)) cached = saved.problems;
        } catch { /* cache is optional */ }
        if (cached) {
          if (!cancelled) setProblems(cached);
        } else {
          const response = await fetch(API_URL);
          if (!response.ok) throw new Error(`Problem API returned ${response.status}`);
          const payload = await response.json();
          if (payload.status !== "OK" || !Array.isArray(payload.result?.problems)) throw new Error("Unexpected response from Codeforces.");
          const clean = payload.result.problems
            .filter((p) => p.contestId && p.index && p.name && p.type === "PROGRAMMING")
            .map((p) => ({ contestId: p.contestId, index: p.index, name: p.name, rating: p.rating || null, tags: p.tags || [] }));
          try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ savedAt: Date.now(), problems: clean })); } catch { /* cache is optional */ }
          if (!cancelled) setProblems(clean);
        }
      } catch (e) {
        if (!cancelled) setError("Live questions could not be loaded right now. You can still open the GeeksforGeeks practice search below.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadProblems();
    return () => { cancelled = true; };
  }, []);

  const wantedTags = useMemo(() => topicTags(topicTitle), [topicTitle]);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const candidates = problems.filter((p) => {
      const haystack = `${p.name} ${p.tags.join(" ")}`.toLowerCase();
      const matchesQuery = !q || haystack.includes(q);
      const matchesTopic = p.tags.some((tag) => wantedTags.includes(tag)) ||
        (wantedTags.includes("implementation") && p.tags.includes("implementation"));
      return matchesQuery && matchesTopic;
    });
    return candidates.slice(0, compact ? 6 : 8);
  }, [problems, query, wantedTags, compact]);

  const gfgSearch = `https://www.geeksforgeeks.org/problem-of-the-day/`;
  const gfgTopicSearch = `https://www.geeksforgeeks.org/search/?q=${encodeURIComponent(topicTitle + " practice problems")}`;

  // Open submission modal for a problem
  const handleOpenSubmit = (problem) => {
    setActiveModalProblem(problem);
    setSolutionLanguage("JavaScript");
    setSolutionCode(STARTER_CODE_TEMPLATES.JavaScript(problem));
    setSolutionNotes("");
    setSubmitSuccessMsg("");
  };

  // Change modal language
  const handleLanguageChange = (lang) => {
    setSolutionLanguage(lang);
    if (activeModalProblem && STARTER_CODE_TEMPLATES[lang]) {
      setSolutionCode(STARTER_CODE_TEMPLATES[lang](activeModalProblem));
    }
  };

  // Confirm and submit problem solution
  const handleConfirmSubmit = (e) => {
    e.preventDefault();
    if (!activeModalProblem || !solutionCode.trim()) return;

    const p = activeModalProblem;
    const submittedAt = new Date().toISOString();
    const submissionId = `sub_${Date.now()}`;
    const questionId = `cf-${p.contestId}-${p.index}`;

    const newSubmission = {
      id: submissionId,
      topicId: `codeforces-${p.contestId}`,
      topicTitle: topicTitle || (p.tags && p.tags[0] ? p.tags[0].toUpperCase() : "Algorithms"),
      questionId,
      questionTitle: p.name,
      language: solutionLanguage,
      code: solutionCode.trim(),
      status: "Executed successfully",
      submittedAt,
      output: `Codeforces problem #${p.contestId}${p.index} • Rating: ${p.rating || "Standard"} • Tags: ${(p.tags || []).slice(0, 3).join(", ")}${solutionNotes ? `\nApproach: ${solutionNotes}` : ""}`,
      executionMode: `Submitted via Practice Library external problem API (${solutionLanguage})`,
      score: p.rating ? `${p.rating} pts` : "100%",
      problemUrl: problemUrl(p)
    };

    const existingSubs = currentUser?.submissions || [];
    const updatedSubs = [...existingSubs, newSubmission];
    const uniqueCount = new Set(updatedSubs.map((s) => s.questionId || s.questionTitle)).size;

    const today = getTodayDateString();
    const activeDates = new Set(currentUser?.activeDates || []);
    activeDates.add(today);

    if (updateUser && currentUser) {
      updateUser({
        ...currentUser,
        activeDates: Array.from(activeDates),
        submissions: updatedSubs,
        profile: {
          ...currentUser?.profile,
          stats: {
            ...currentUser?.profile?.stats,
            problems: uniqueCount,
            projects: currentUser?.projects?.length || currentUser?.profile?.stats?.projects || 0
          }
        }
      });
    }

    // Persist to localStorage submission history
    saveSubmission(newSubmission);

    setSubmitSuccessMsg(`✓ Solution for "${p.name}" submitted successfully! Your submission is recorded in Submissions.`);
    setToastMessage(`✓ Submitted "${p.name}"!`);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const solvedQuestionIds = useMemo(() => {
    return new Set((currentUser?.submissions || []).map((s) => s.questionId));
  }, [currentUser?.submissions]);

  return (
    <section className="dashboard-panel-card" style={{ marginTop: 22, marginBottom: 22 }}>
      <div className="panel-header-row" style={{ gap: 12, flexWrap: "wrap" }}>
        <div className="panel-title-group">
          <h3>🌐 More practice questions</h3>
          <p>Live practice questions fetched from Codeforces API. Solve and submit solutions directly to your history.</p>
        </div>
        <span className="tag-pill">API Problem Bank</span>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
        <a href={gfgTopicSearch} target="_blank" rel="noreferrer" className="view-code-btn" style={{ textDecoration: "none" }}>Search {topicTitle} on GeeksforGeeks ↗</a>
        <a href={gfgSearch} target="_blank" rel="noreferrer" className="view-code-btn" style={{ textDecoration: "none" }}>GFG Problem of the Day ↗</a>
      </div>

      <input
        type="search"
        className="filter-search-input"
        placeholder="Search live questions by title or tag…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Search external practice questions"
        style={{ width: "100%", marginBottom: 12 }}
      />

      {loading && <p style={{ color: "var(--text-muted)", fontSize: 13 }}>Loading live questions from API…</p>}
      {error && <p role="status" style={{ color: "var(--text-muted)", fontSize: 13 }}>{error}</p>}
      {!loading && !error && filtered.length === 0 && <p style={{ color: "var(--text-muted)", fontSize: 13 }}>No matching live questions for this topic. Try another search or use the GeeksforGeeks links above.</p>}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
        {filtered.map((p) => {
          const qId = `cf-${p.contestId}-${p.index}`;
          const isSolved = solvedQuestionIds.has(qId);

          return (
            <article key={`${p.contestId}-${p.index}`} style={{ border: "1px solid var(--border-main)", background: "var(--bg-surface-elevated)", borderRadius: 10, padding: 14, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ display: "flex", alignItems: "start", justifyContent: "space-between", gap: 8 }}>
                  <strong style={{ color: "var(--text-main)", fontSize: 13.5, lineHeight: 1.4 }}>{p.name}</strong>
                  <span className="tag-pill" style={{ whiteSpace: "nowrap" }}>{difficultyLabel(p.rating)}</span>
                </div>
                <p style={{ color: "var(--text-muted)", fontSize: 11.5, margin: "8px 0" }}>{p.tags.slice(0, 3).join(" · ") || "Programming"}</p>
              </div>

              <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid var(--border-main)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
                <span style={{ color: "var(--text-subtle)", fontSize: 11.5 }}>
                  {isSolved ? <span style={{ color: "#34d399", fontWeight: 700 }}>✓ Solved</span> : (p.rating ? `Rating: ${p.rating}` : "Live API")}
                </span>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <a href={problemUrl(p)} target="_blank" rel="noreferrer" className="view-code-btn" style={{ fontSize: 11.5, padding: "4px 8px" }}>
                    Details ↗
                  </a>
                  <button
                    type="button"
                    className="btn-primary-gradient"
                    style={{ fontSize: 11.5, padding: "5px 12px", borderRadius: "6px" }}
                    onClick={() => handleOpenSubmit(p)}
                  >
                    Submit ✓
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <p style={{ color: "var(--text-subtle)", fontSize: 11, marginTop: 12 }}>
        Questions fetched in real time from Codeforces API. Click "Submit" to record your solution in your profile and Submissions log.
      </p>

      {/* SUBMISSION MODAL DIALOG */}
      {activeModalProblem && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label={`Submit solution for ${activeModalProblem.name}`}>
          <div className="modal-dialog-card wide">
            <div className="modal-header-row">
              <div>
                <span className="badge-tag-purple">📝 PRACTICE PROBLEM SUBMISSION</span>
                <h3 style={{ marginTop: 4 }}>{activeModalProblem.name}</h3>
                <p style={{ fontSize: 12.5, color: "var(--text-muted)", marginTop: 2 }}>
                  Codeforces Problem #{activeModalProblem.contestId}{activeModalProblem.index} · {activeModalProblem.tags.slice(0, 3).join(", ")} · {difficultyLabel(activeModalProblem.rating)}
                </p>
              </div>
              <button
                type="button"
                className="close-modal-btn"
                onClick={() => { setActiveModalProblem(null); setSubmitSuccessMsg(""); }}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            {submitSuccessMsg ? (
              <div style={{ padding: "24px", textAlign: "center" }}>
                <div style={{ fontSize: "36px", marginBottom: "12px" }}>🎉</div>
                <h3 style={{ color: "#34d399", fontSize: "18px", fontWeight: 700, marginBottom: "8px" }}>
                  Solution Submitted Successfully!
                </h3>
                <p style={{ color: "var(--text-muted)", fontSize: "13.5px", marginBottom: "20px" }}>
                  {submitSuccessMsg}
                </p>
                <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                  <Link to="/submissions" className="btn-primary-gradient" style={{ textDecoration: "none" }}>
                    View in Submissions →
                  </Link>
                  <button
                    type="button"
                    className="btn-secondary-dark"
                    onClick={() => { setActiveModalProblem(null); setSubmitSuccessMsg(""); }}
                  >
                    Solve Another Problem
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleConfirmSubmit} className="custom-form">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600 }}>
                    Language:
                    <select
                      value={solutionLanguage}
                      onChange={(e) => handleLanguageChange(e.target.value)}
                      className="filter-search-input"
                      style={{ minWidth: 140 }}
                    >
                      <option>JavaScript</option>
                      <option>Python</option>
                      <option>Java</option>
                      <option>C++</option>
                    </select>
                  </label>
                  <a
                    href={problemUrl(activeModalProblem)}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: "var(--cyan)", fontSize: 12.5 }}
                  >
                    Read Full Problem Statement ↗
                  </a>
                </div>

                <div className="form-field-group">
                  <label style={{ fontSize: 12.5, fontWeight: 600, display: "flex", justifyContent: "space-between" }}>
                    <span>Your Solution Code *</span>
                    <span style={{ color: "var(--text-subtle)", fontSize: 11 }}>Code is recorded in Submissions log</span>
                  </label>
                  <textarea
                    required
                    rows={10}
                    spellCheck={false}
                    autoCapitalize="off"
                    autoCorrect="off"
                    value={solutionCode}
                    onChange={(e) => setSolutionCode(e.target.value)}
                    style={{
                      width: "100%",
                      fontFamily: "var(--font-mono)",
                      fontSize: 13,
                      background: "#0a0e1a",
                      color: "#a5b4fc",
                      padding: 14,
                      borderRadius: 8,
                      border: "1px solid var(--border-main)",
                      outline: "none",
                      lineHeight: 1.6,
                      tabSize: 2
                    }}
                    placeholder="// Write or paste your solution code here..."
                  />
                </div>

                <div className="form-field-group">
                  <label style={{ fontSize: 12.5, fontWeight: 600 }}>
                    Notes / Approach (Optional):
                  </label>
                  <input
                    type="text"
                    className="custom-input"
                    value={solutionNotes}
                    onChange={(e) => setSolutionNotes(e.target.value)}
                    placeholder="e.g. Solved using Two Pointers technique with O(N) time and O(1) space."
                  />
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 12 }}>
                  <button
                    type="button"
                    className="btn-secondary-dark"
                    onClick={() => setActiveModalProblem(null)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary-gradient"
                  >
                    Confirm & Submit Solution ✓
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {toastMessage && <div className="toast-popup">✓ {toastMessage}</div>}
    </section>
  );
}
