// Practice Library Page Component
// Displays all curriculum topics with search and category filtering

import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { topics } from "./data";

export default function Library({ currentUser }) {
  // Filter by category: All, DSA, JavaScript, React, Frontend
  const [filter, setFilter] = useState("All");
  // Search query text
  const [search, setSearch] = useState("");

  const completed = currentUser?.completed || [];

  // Filter topics list based on category pill and search query
  const filteredTopics = useMemo(() => {
    return topics.filter((t) => {
      const matchesSearch =
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.type.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filter === "All" || t.type === filter;
      return matchesSearch && matchesFilter;
    });
  }, [search, filter]);

  return (
    <section>
      <div style={{ marginBottom: "24px" }}>
        <div className="badge-tag-purple">📚 PRACTICE LIBRARY</div>
        <h1 style={{ fontSize: "28px", fontWeight: 800, color: "var(--text-main)", marginBottom: "6px" }}>
          Curriculum & Practice Questions
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
          Practice essential DSA algorithms, JavaScript concepts, and placement interview questions.
        </p>
      </div>

      {/* Search and Category Filter Bar */}
      <div className="topic-filters-bar">
        <input
          type="text"
          className="filter-search-input"
          placeholder="Search problems (e.g. Arrays, Palindrome, ES6)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {["All", "DSA", "JavaScript", "React", "Frontend"].map((cat) => (
          <button
            key={cat}
            className={`topic-category-pill ${filter === cat ? "active" : ""}`}
            onClick={() => setFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Topics Grid */}
      <div className="topics-list-grid">
        {filteredTopics.map((topic) => {
          const isCompleted = completed.includes(topic.id);
          return (
            <div className="topic-item-card" key={topic.id}>
              <div className="topic-item-header">
                <span className="difficulty-badge-easy">{topic.type}</span>
                <span style={{ fontSize: "12px", color: "var(--text-subtle)", fontWeight: 600 }}>
                  {topic.questions?.length || 0} Questions
                </span>
              </div>
              <h3>{topic.title}</h3>
              <p>{topic.description}</p>
              <div className="topic-item-footer">
                <Link
                  to={`/topics/${topic.id}`}
                  className="btn-primary-gradient"
                  style={{ fontSize: "12.5px", padding: "6px 14px" }}
                >
                  Practice Now →
                </Link>
                {isCompleted && (
                  <span style={{ color: "#34d399", fontSize: "12px", fontWeight: 700 }}>
                    ✓ Completed
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
