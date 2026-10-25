// Practice Library: Real-time Multi-Platform Coding Questions Explorer
// Powered by live APIs from LeetCode, Codeforces, and GeeksforGeeks
// Features: Difficulty filters, Favourites persistence, Topic filtering, Progress tracking, Pagination, and In-App Submissions

import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  fetchAllApiQuestions,
  TOPIC_FILTERS,
  PLATFORM_FILTERS,
  DIFFICULTY_FILTERS
} from "./data/apiQuestionsData";
import { saveSubmission } from "./submissionUtils";
import { getTodayDateString } from "./hooks";

const PAGE_SIZE = 12;

const STARTER_CODE_TEMPLATES = {
  JavaScript: (q) =>
    `// Problem: ${q.name} (${q.platform})\n// Topic: ${q.primaryTopic} • Difficulty: ${q.difficulty}\n\nfunction solve(input) {\n  // Write your optimal JavaScript solution here\n  return input;\n}\n\nconsole.log(solve("test"));\n`,
  Python: (q) =>
    `# Problem: ${q.name} (${q.platform})\n# Topic: ${q.primaryTopic} • Difficulty: ${q.difficulty}\n\ndef solve():\n    # Write your optimal Python solution here\n    pass\n\nif __name__ == "__main__":\n    solve()\n`,
  Java: (q) =>
    `// Problem: ${q.name} (${q.platform})\n// Topic: ${q.primaryTopic} • Difficulty: ${q.difficulty}\nimport java.util.*;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Write your optimal Java solution here\n    }\n}\n`,
  "C++": (q) =>
    `// Problem: ${q.name} (${q.platform})\n// Topic: ${q.primaryTopic} • Difficulty: ${q.difficulty}\n#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    // Write your optimal C++ solution here\n    return 0;\n}\n`
};

export default function Library({ currentUser, updateUser }) {
  const userKey = currentUser?.id || currentUser?.email || "guest";
  const favouritesStorageKey = `nextoffer_favourites_${userKey}`;

  // Data fetching state
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters state
  const [platform, setPlatform] = useState("All Platforms");
  const [topic, setTopic] = useState("All Topics");
  const [difficulty, setDifficulty] = useState("All Difficulties");
  const [progress, setProgress] = useState("All Progress");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // Favourites state (synced with localStorage)
  const [favourites, setFavourites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(favouritesStorageKey) || "[]");
    } catch {
      return [];
    }
  });

  // Modal submission state
  const [activeModalQuestion, setActiveModalQuestion] = useState(null);
  const [solutionLanguage, setSolutionLanguage] = useState("JavaScript");
  const [solutionCode, setSolutionCode] = useState("");
  const [solutionNotes, setSolutionNotes] = useState("");
  const [submitSuccessMsg, setSubmitSuccessMsg] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  // Fetch questions on mount
  useEffect(() => {
    let cancelled = false;
    async function loadQuestions() {
      setLoading(true);
      setError("");
      try {
        const data = await fetchAllApiQuestions();
        if (!cancelled) {
          setQuestions(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError("Failed to load questions. Please check your internet connection.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }
    loadQuestions();
    return () => {
      cancelled = true;
    };
  }, []);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim().toLowerCase());
      setPage(1);
    }, 250);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Persist favourites
  useEffect(() => {
    try {
      localStorage.setItem(favouritesStorageKey, JSON.stringify(favourites));
    } catch {
      /* storage might be restricted */
    }
  }, [favourites, favouritesStorageKey]);

  // Compute solved question IDs / titles from user submissions
  const solvedSet = useMemo(() => {
    const set = new Set();
    const subs = currentUser?.submissions || [];
    for (const s of subs) {
      if (s.questionId) set.add(s.questionId);
      if (s.questionTitle) set.add(s.questionTitle.toLowerCase());
    }
    return set;
  }, [currentUser?.submissions]);

  // Toggle favourite
  const toggleFavourite = (id) => {
    setFavourites((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Reset all filters
  const resetFilters = () => {
    setPlatform("All Platforms");
    setTopic("All Topics");
    setDifficulty("All Difficulties");
    setProgress("All Progress");
    setSearchInput("");
    setSearch("");
    setPage(1);
  };

  // Filtered questions
  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      // Platform filter
      if (platform !== "All Platforms" && q.platform !== platform) return false;

      // Topic filter
      if (topic !== "All Topics" && q.primaryTopic !== topic) return false;

      // Difficulty filter
      if (difficulty !== "All Difficulties" && q.difficulty !== difficulty) return false;

      // Progress filter
      const isSolved = solvedSet.has(q.id) || solvedSet.has(q.name.toLowerCase());
      const isFavourited = favourites.includes(q.id);

      if (progress === "Solved" && !isSolved) return false;
      if (progress === "Unsolved" && isSolved) return false;
      if (progress === "Saved Favourites" && !isFavourited) return false;

      // Search filter
      if (search) {
        const text = `${q.name} ${q.platform} ${q.primaryTopic} ${(q.tags || []).join(" ")} ${q.prompt || ""}`.toLowerCase();
        if (!text.includes(search)) return false;
      }

      return true;
    });
  }, [questions, platform, topic, difficulty, progress, search, solvedSet, favourites]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredQuestions.length / PAGE_SIZE));
  const currentSafePage = Math.min(page, totalPages);
  const startIndex = (currentSafePage - 1) * PAGE_SIZE;
  const visibleQuestions = filteredQuestions.slice(startIndex, startIndex + PAGE_SIZE);

  // Overall statistics
  const totalSolvedCount = useMemo(() => {
    let count = 0;
    for (const q of questions) {
      if (solvedSet.has(q.id) || solvedSet.has(q.name.toLowerCase())) count++;
    }
    return count;
  }, [questions, solvedSet]);

  // Open submission modal
  const handleOpenSubmit = (question) => {
    setActiveModalQuestion(question);
    setSolutionLanguage("JavaScript");
    setSolutionCode(STARTER_CODE_TEMPLATES.JavaScript(question));
    setSolutionNotes("");
    setSubmitSuccessMsg("");
  };

  // Switch modal code language
  const handleLanguageChange = (lang) => {
    setSolutionLanguage(lang);
    if (activeModalQuestion && STARTER_CODE_TEMPLATES[lang]) {
      setSolutionCode(STARTER_CODE_TEMPLATES[lang](activeModalQuestion));
    }
  };

  // Submit solution
  const handleConfirmSubmit = (e) => {
    e.preventDefault();
    if (!activeModalQuestion || !solutionCode.trim()) return;

    const q = activeModalQuestion;
    const submittedAt = new Date().toISOString();
    const submissionId = `sub_${Date.now()}`;

    const newSubmission = {
      id: submissionId,
      topicId: `topic-${q.primaryTopic.toLowerCase().replace(/\s+/g, "-")}`,
      topicTitle: q.primaryTopic,
      questionId: q.id,
      questionTitle: q.name,
      platform: q.platform,
      language: solutionLanguage,
      code: solutionCode.trim(),
      status: "Executed successfully",
      submittedAt,
      output: `${q.platform} • Topic: ${q.primaryTopic} • Difficulty: ${q.difficulty} • Tags: ${(q.tags || []).join(", ")}${solutionNotes ? `\nApproach: ${solutionNotes}` : ""}`,
      executionMode: `Submitted via Practice Library (${solutionLanguage})`,
      score: "100%",
      problemUrl: q.url
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

    setSubmitSuccessMsg(
      `✓ Solution for "${q.name}" submitted successfully! Your submission has been recorded in your Submissions log.`
    );
    setToastMessage(`✓ Submitted "${q.name}"!`);
    setTimeout(() => setToastMessage(""), 3500);
  };

  // Helper for platform badge
  const renderPlatformBadge = (plat) => {
    switch (plat) {
      case "LeetCode":
        return <span className="platform-badge platform-badge-leetcode">🟠 LeetCode</span>;
      case "Codeforces":
        return <span className="platform-badge platform-badge-codeforces">🔵 Codeforces</span>;
      case "GeeksforGeeks":
        return <span className="platform-badge platform-badge-gfg">🟢 GeeksforGeeks</span>;
      default:
        return <span className="tag-pill">{plat}</span>;
    }
  };

  // Helper for difficulty badge
  const renderDifficultyBadge = (diff) => {
    switch (diff) {
      case "Easy":
        return <span className="difficulty-badge-easy">Easy</span>;
      case "Medium":
        return <span className="difficulty-badge-medium">Medium</span>;
      case "Hard":
        return <span className="difficulty-badge-hard">Hard</span>;
      default:
        return <span className="tag-pill">{diff}</span>;
    }
  };

  return (
    <section>
      {/* Page Header */}
      <div style={{ marginBottom: 24 }}>
        <div className="badge-tag-purple">📚 PRACTICE LIBRARY</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 14 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: "var(--text-main)", marginBottom: 6 }}>
              Challenges & Practice Library
            </h1>
            <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
              Explore real-time questions from LeetCode, Codeforces, and GeeksforGeeks. Filter by topic, difficulty, or favourites, and record your solutions.
            </p>
          </div>

          {/* Quick Metrics */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <div
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border-main)",
                padding: "8px 16px",
                borderRadius: "10px",
                textAlign: "center"
              }}
            >
              <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600 }}>TOTAL AVAILABLE</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "var(--text-main)" }}>{questions.length}</div>
            </div>
            <div
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border-main)",
                padding: "8px 16px",
                borderRadius: "10px",
                textAlign: "center"
              }}
            >
              <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600 }}>SOLVED BY YOU</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#34d399" }}>{totalSolvedCount}</div>
            </div>
            <div
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border-main)",
                padding: "8px 16px",
                borderRadius: "10px",
                textAlign: "center"
              }}
            >
              <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600 }}>SAVED FAVOURITES</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#f59e0b" }}>{favourites.length}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Filter Tabs */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
        {PLATFORM_FILTERS.map((p) => {
          const isActive = platform === p;
          const icon = p === "LeetCode" ? "🟠 " : p === "Codeforces" ? "🔵 " : p === "GeeksforGeeks" ? "🟢 " : "🌐 ";
          return (
            <button
              key={p}
              type="button"
              className={`topic-category-pill ${isActive ? "active" : ""}`}
              onClick={() => {
                setPlatform(p);
                setPage(1);
              }}
              style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
            >
              <span>{icon}</span>
              <span>{p}</span>
            </button>
          );
        })}
      </div>

      {/* Main Filter Bar */}
      <div className="topic-filters-bar" style={{ alignItems: "center", gap: 10 }}>
        {/* Search Input */}
        <input
          type="search"
          className="filter-search-input"
          placeholder="Search questions by name, tags, or topic…"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          aria-label="Search questions"
        />

        {/* Difficulty Filter */}
        <select
          className="filter-search-input"
          style={{ maxWidth: 160 }}
          value={difficulty}
          onChange={(e) => {
            setDifficulty(e.target.value);
            setPage(1);
          }}
          aria-label="Filter difficulty"
        >
          {DIFFICULTY_FILTERS.map((d) => (
            <option key={d} value={d}>
              {d === "All Difficulties" ? "All difficulties" : d}
            </option>
          ))}
        </select>

        {/* Progress Filter */}
        <select
          className="filter-search-input"
          style={{ maxWidth: 170 }}
          value={progress}
          onChange={(e) => {
            setProgress(e.target.value);
            setPage(1);
          }}
          aria-label="Filter progress"
        >
          <option value="All Progress">All progress</option>
          <option value="Solved">✓ Solved</option>
          <option value="Unsolved">Unsolved</option>
          <option value="Saved Favourites">★ Saved favourites</option>
        </select>

        {/* Clear Filters */}
        {(platform !== "All Platforms" ||
          topic !== "All Topics" ||
          difficulty !== "All Difficulties" ||
          progress !== "All Progress" ||
          search) && (
          <button type="button" className="view-code-btn" onClick={resetFilters}>
            Clear filters
          </button>
        )}
      </div>

      {/* Topic Filter Pills Bar */}
      <div className="topic-pills-container">
        <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", marginRight: 4 }}>
          TOPICS:
        </span>
        {TOPIC_FILTERS.map((t) => {
          const isActive = topic === t;
          return (
            <button
              key={t}
              type="button"
              className={`topic-category-pill ${isActive ? "active" : ""}`}
              onClick={() => {
                setTopic(t);
                setPage(1);
              }}
              style={{ fontSize: 12, padding: "4px 12px" }}
            >
              {t}
            </button>
          );
        })}
      </div>

      {/* Result Status Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "14px 0", flexWrap: "wrap", gap: 10 }}>
        <p style={{ color: "var(--text-muted)", fontSize: 13, margin: 0 }}>
          {filteredQuestions.length} {filteredQuestions.length === 1 ? "question" : "questions"} found
          {platform !== "All Platforms" && ` on ${platform}`}
          {topic !== "All Topics" && ` in ${topic}`}
          {difficulty !== "All Difficulties" && ` (${difficulty})`}
          {progress !== "All Progress" && ` • ${progress}`}
        </p>

        {filteredQuestions.length > PAGE_SIZE && (
          <span style={{ color: "var(--text-subtle)", fontSize: 12.5 }}>
            Showing {startIndex + 1}–{Math.min(startIndex + PAGE_SIZE, filteredQuestions.length)} of {filteredQuestions.length}
          </span>
        )}
      </div>

      {/* Loading & Error States */}
      {loading && (
        <div className="dashboard-panel-card" style={{ padding: 40, textAlign: "center" }}>
          <div style={{ fontSize: 28, marginBottom: 12 }}>⚡</div>
          <h3 style={{ color: "var(--text-main)", marginBottom: 6 }}>Loading Practice Questions…</h3>
          <p style={{ color: "var(--text-muted)", fontSize: 13 }}>
            Fetching live coding questions from LeetCode, Codeforces, and GeeksforGeeks APIs.
          </p>
        </div>
      )}

      {error && !loading && (
        <div className="dashboard-panel-card" style={{ padding: 30, textAlign: "center", border: "1px solid rgba(239, 68, 68, 0.4)" }}>
          <p style={{ color: "#f87171", fontSize: 14 }}>{error}</p>
          <button type="button" className="btn-primary-gradient" onClick={resetFilters} style={{ marginTop: 12 }}>
            Retry Loading Questions
          </button>
        </div>
      )}

      {/* Questions Grid */}
      {!loading && !error && visibleQuestions.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: 16
          }}
        >
          {visibleQuestions.map((q) => {
            const isFavourited = favourites.includes(q.id);
            const isSolved = solvedSet.has(q.id) || solvedSet.has(q.name.toLowerCase());

            return (
              <article key={q.id} className="question-card-api">
                <div>
                  {/* Card Header: Platform, Difficulty, and Favourites Button */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 8,
                      marginBottom: 10
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                      {renderPlatformBadge(q.platform)}
                      {renderDifficultyBadge(q.difficulty)}
                      <span className="tag-pill" style={{ fontSize: 10.5 }}>
                        {q.primaryTopic}
                      </span>
                    </div>

                    <button
                      type="button"
                      className="favourite-star-btn"
                      onClick={() => toggleFavourite(q.id)}
                      title={isFavourited ? "Remove from favourites" : "Save to favourites"}
                      aria-label={isFavourited ? "Remove favourite" : "Save favourite"}
                      style={{ color: isFavourited ? "#f59e0b" : "var(--text-muted)" }}
                    >
                      {isFavourited ? "★" : "☆"}
                    </button>
                  </div>

                  {/* Question Title */}
                  <h3
                    style={{
                      fontSize: 16,
                      fontWeight: 700,
                      color: "var(--text-main)",
                      marginBottom: 6,
                      lineHeight: 1.35
                    }}
                  >
                    {q.name}
                  </h3>

                  {/* Prompt Preview */}
                  <p
                    style={{
                      fontSize: 12.5,
                      color: "var(--text-muted)",
                      lineHeight: 1.5,
                      marginBottom: 12,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden"
                    }}
                  >
                    {q.prompt || "Solve this algorithmic challenge to sharpen your problem solving skills."}
                  </p>

                  {/* Tags and Acceptance / Rating */}
                  <div
                    style={{
                      display: "flex",
                      gap: 6,
                      flexWrap: "wrap",
                      marginBottom: 12,
                      alignItems: "center"
                    }}
                  >
                    {q.acceptance && (
                      <span
                        style={{
                          fontSize: 11,
                          color: "var(--text-subtle)",
                          background: "var(--bg-surface)",
                          padding: "2px 6px",
                          borderRadius: 4,
                          border: "1px solid var(--border-main)"
                        }}
                      >
                        {q.acceptance}
                      </span>
                    )}
                    {(q.tags || []).slice(0, 2).map((tag, idx) => (
                      <span key={idx} style={{ fontSize: 11, color: "var(--text-muted)" }}>
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Footer: Solved status & action buttons */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 8,
                    paddingTop: 12,
                    borderTop: "1px solid var(--border-subtle)",
                    flexWrap: "wrap"
                  }}
                >
                  <div>
                    {isSolved ? (
                      <span
                        style={{
                          color: "#34d399",
                          fontSize: 12,
                          fontWeight: 700,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4
                        }}
                      >
                        ✓ Solved
                      </span>
                    ) : (
                      <span style={{ color: "var(--text-subtle)", fontSize: 11.5 }}>
                        Unsolved
                      </span>
                    )}
                  </div>

                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <a
                      href={q.url}
                      target="_blank"
                      rel="noreferrer"
                      className="view-code-btn"
                      style={{ fontSize: 12, textDecoration: "none", padding: "5px 10px" }}
                    >
                      Details ↗
                    </a>
                    <button
                      type="button"
                      className="btn-primary-gradient"
                      style={{ fontSize: 12, padding: "5px 12px", borderRadius: "6px" }}
                      onClick={() => handleOpenSubmit(q)}
                    >
                      Submit Solution ✓
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && visibleQuestions.length === 0 && (
        <div className="dashboard-panel-card" style={{ padding: 36, textAlign: "center" }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🔍</div>
          <h3 style={{ color: "var(--text-main)", marginBottom: 6 }}>No matching questions found</h3>
          <p style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 18 }}>
            Try clearing your search query, switching topics, or resetting difficulty and progress filters.
          </p>
          <button type="button" className="btn-primary-gradient" onClick={resetFilters}>
            Reset all filters
          </button>
        </div>
      )}

      {/* Pagination Controls */}
      {!loading && !error && filteredQuestions.length > PAGE_SIZE && (
        <div className="pagination-controls">
          <button
            type="button"
            className="pagination-btn"
            disabled={currentSafePage <= 1}
            onClick={() => {
              setPage((p) => Math.max(1, p - 1));
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            ← Previous
          </button>

          {/* Page Number Buttons */}
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((p) => {
              // Always show first, last, and window around current
              return p === 1 || p === totalPages || Math.abs(p - currentSafePage) <= 2;
            })
            .map((p, idx, arr) => {
              const prev = arr[idx - 1];
              const showEllipsis = prev && p - prev > 1;

              return (
                <React.Fragment key={p}>
                  {showEllipsis && (
                    <span style={{ color: "var(--text-muted)", padding: "0 4px" }}>…</span>
                  )}
                  <button
                    type="button"
                    className={`pagination-page-btn ${currentSafePage === p ? "active" : ""}`}
                    onClick={() => {
                      setPage(p);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    {p}
                  </button>
                </React.Fragment>
              );
            })}

          <button
            type="button"
            className="pagination-btn"
            disabled={currentSafePage >= totalPages}
            onClick={() => {
              setPage((p) => Math.min(totalPages, p + 1));
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            Next →
          </button>
        </div>
      )}

      {/* SUBMISSION MODAL DIALOG */}
      {activeModalQuestion && (
        <div
          className="modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label={`Submit solution for ${activeModalQuestion.name}`}
        >
          <div className="modal-dialog-card wide">
            <div className="modal-header-row">
              <div>
                <span className="badge-tag-purple">📝 PRACTICE PROBLEM SUBMISSION</span>
                <h3 style={{ marginTop: 4 }}>{activeModalQuestion.name}</h3>
                <p style={{ fontSize: 12.5, color: "var(--text-muted)", marginTop: 2 }}>
                  {activeModalQuestion.platform} · {activeModalQuestion.primaryTopic} · {activeModalQuestion.difficulty}
                </p>
              </div>
              <button
                type="button"
                className="close-modal-btn"
                onClick={() => {
                  setActiveModalQuestion(null);
                  setSubmitSuccessMsg("");
                }}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            {submitSuccessMsg ? (
              <div style={{ padding: "24px", textAlign: "center" }}>
                <div style={{ fontSize: "38px", marginBottom: "12px" }}>🎉</div>
                <h3 style={{ color: "#34d399", fontSize: "19px", fontWeight: 700, marginBottom: "8px" }}>
                  Solution Submitted Successfully!
                </h3>
                <p style={{ color: "var(--text-muted)", fontSize: "13.5px", marginBottom: "20px" }}>
                  {submitSuccessMsg}
                </p>
                <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                  <Link
                    to="/submissions"
                    className="btn-primary-gradient"
                    style={{ textDecoration: "none" }}
                  >
                    View in Submissions →
                  </Link>
                  <button
                    type="button"
                    className="btn-secondary-dark"
                    onClick={() => {
                      setActiveModalQuestion(null);
                      setSubmitSuccessMsg("");
                    }}
                  >
                    Solve Another Problem
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleConfirmSubmit} className="custom-form">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 12,
                    flexWrap: "wrap"
                  }}
                >
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
                    href={activeModalQuestion.url}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: "var(--cyan)", fontSize: 12.5 }}
                  >
                    Read Full Problem on {activeModalQuestion.platform} ↗
                  </a>
                </div>

                <div className="form-field-group">
                  <label style={{ fontSize: 12.5, fontWeight: 600, display: "flex", justifyContent: "space-between" }}>
                    <span>Your Solution Code *</span>
                    <span style={{ color: "var(--text-subtle)", fontSize: 11 }}>
                      Code will be recorded in Submissions and update your profile
                    </span>
                  </label>
                  <textarea
                    required
                    rows={11}
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
                    placeholder="e.g. Solved in O(N) time and O(1) space using sliding window technique."
                  />
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 12 }}>
                  <button
                    type="button"
                    className="btn-secondary-dark"
                    onClick={() => setActiveModalQuestion(null)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary-gradient">
                    Confirm & Submit Solution ✓
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && <div className="toast-popup">{toastMessage}</div>}
    </section>
  );
}
