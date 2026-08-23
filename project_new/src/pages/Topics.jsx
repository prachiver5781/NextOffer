import { useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { topics } from "../data";

const CATEGORIES = ["All", "DSA", "JavaScript", "React", "Frontend"];

export default function Topics({ completed, setCompleted, showToast }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [difficulty, setDifficulty] = useState("All");

  const filteredTopics = useMemo(() => {
    return topics.filter((topic) => {
      const searchMatch =
        topic.title.toLowerCase().includes(search.toLowerCase()) ||
        topic.description.toLowerCase().includes(search.toLowerCase());

      const typeMatch = filter === "All" || topic.type === filter;
      const levelMatch = difficulty === "All" || topic.level === difficulty;

      return searchMatch && typeMatch && levelMatch;
    });
  }, [search, filter, difficulty]);

  const toggleComplete = useCallback(
    (id) => {
      const alreadyDone = completed.includes(id);

      setCompleted((old) =>
        alreadyDone ? old.filter((item) => item !== id) : [...old, id]
      );

      showToast(
        alreadyDone ? "Topic marked incomplete" : "Topic completed! 🎉"
      );
    },
    [completed, setCompleted, showToast]
  );

  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">PRACTICE LIBRARY</p>
          <h2>Learn something new today.</h2>
          <p>Choose a topic, practice the questions and track your progress.</p>
        </div>

        <div className="topic-count">
          <strong>{completed.length}</strong>
          <span>/ {topics.length} completed</span>
        </div>
      </div>

      <div className="filter-container">
        <div className="search-box">
          <span>⌕</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search topics..."
            aria-label="Search topics"
          />
          {search && (
            <button onClick={() => setSearch("")} aria-label="Clear search">
              ×
            </button>
          )}
        </div>

        <div className="filter-group">
          {CATEGORIES.map((item) => (
            <button
              key={item}
              className={filter === item ? "filter active" : "filter"}
              onClick={() => setFilter(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="difficulty-select"
          aria-label="Filter by difficulty"
        >
          <option value="All">All levels</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
        </select>
      </div>

      <div className="topic-grid">
        {filteredTopics.map((topic) => {
          const isDone = completed.includes(topic.id);

          return (
            <article
              className={isDone ? "topic-card completed-card" : "topic-card"}
              key={topic.id}
            >
              <div className="topic-top">
                <div className="topic-icon">{topic.icon}</div>
                {isDone && <span className="completed-badge">✓ Completed</span>}
              </div>

              <div className="topic-meta">
                <span className="topic-type">{topic.type}</span>
                <span>{topic.level}</span>
              </div>

              <h3>{topic.title}</h3>
              <p>{topic.description}</p>

              <div className="question-count">
                📝 {topic.questions.length} practice questions
              </div>

              <div className="topic-actions">
                <Link className="secondary-button" to={`/topics/${topic.id}`}>
                  Open topic
                </Link>
                <button
                  className={isDone ? "complete-button done" : "complete-button"}
                  onClick={() => toggleComplete(topic.id)}
                >
                  {isDone ? "✓ Done" : "Mark complete"}
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {filteredTopics.length === 0 && (
        <div className="empty">
          <span>🔎</span>
          <h3>No topics found</h3>
          <p>Try changing your search or filters.</p>
        </div>
      )}
    </section>
  );
}
