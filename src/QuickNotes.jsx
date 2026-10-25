// Quick Notes Component - NextOffer
// Designed for B.Tech CSE Project Evaluation II
// Demonstrates key React concepts:
// 1. useState: Local state management for notes array, controlled inputs, editing state, filters & search
// 2. useEffect: Automatic synchronization and persistence with browser localStorage
// 3. Controlled Inputs: Two-way binding with strict form validation and dynamic error messages
// 4. Array Methods: Filtering (.filter) and list rendering (.map) with stable, unique keys
// 5. Component Reusability: NoteCard component with props and event callbacks
// 6. State Architecture: Clean separation of local component state vs global context state

import React, { useState, useEffect, useMemo, useRef } from "react";
import NoteCard from "./components/NoteCard";
import "./styles/QuickNotes.css";

// Available note categories
const CATEGORIES = [
  "DSA",
  "JavaScript",
  "React",
  "SQL",
  "Interview Tips",
  "Other"
];

// Starter revision notes for immediate presentation in evaluation viva
const INITIAL_STARTER_NOTES = [
  {
    id: "note_seed_1",
    title: "Binary Search Template & Invariants",
    category: "DSA",
    content:
      "Always maintain boundaries: low <= high.\nCalculate mid using: low + Math.floor((high - low) / 2) to prevent 32-bit integer overflow.\nTime Complexity: O(log N), Space: O(1).",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: "note_seed_2",
    title: "Event Loop: Microtasks vs Macrotasks",
    category: "JavaScript",
    content:
      "1. Call stack executes synchronous code first.\n2. Microtask queue (Promise.then, MutationObserver) runs immediately after call stack empties.\n3. Macrotask queue (setTimeout, setInterval, I/O) executes one task per tick.",
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString()
  },
  {
    id: "note_seed_3",
    title: "React useEffect Dependency Array Rules",
    category: "React",
    content:
      "• Empty array []: runs once on mount, cleans up on unmount.\n• Dependencies [a, b]: runs on mount and whenever 'a' or 'b' changes.\n• No array: runs on every single render (can trigger infinite loops).",
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    id: "note_seed_4",
    title: "STAR Technique for HR / Behavioral Rounds",
    category: "Interview Tips",
    content:
      "S - Situation: Set the scene and background.\nT - Task: Describe your responsibility.\nA - Action: Detail the specific steps YOU took.\nR - Result: Share quantifiable outcomes and learnings.",
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString()
  }
];

export default function QuickNotes({ currentUser }) {
  // Compute unique storage key per student user
  const userKey = currentUser?.id || currentUser?.email || "guest";
  const storageKey = `nextoffer_quick_notes_${userKey}`;

  // Form reference for auto-scrolling on edit
  const formRef = useRef(null);

  // --- STATE 1: Notes List (Loaded from localStorage or initialized with starter notes) ---
  const [notes, setNotes] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      /* localStorage might be disabled */
    }
    return INITIAL_STARTER_NOTES;
  });

  // --- STATE 2: Controlled Form Inputs ---
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("DSA");
  const [content, setContent] = useState("");

  // --- STATE 3: Validation Errors ---
  const [errors, setErrors] = useState({});

  // --- STATE 4: Editing Mode State (null when adding, note.id when editing) ---
  const [editingId, setEditingId] = useState(null);

  // --- STATE 5: Search & Filter State ---
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // --- STATE 6: Delete Confirmation Modal State ---
  const [noteToDelete, setNoteToDelete] = useState(null);

  // --- STATE 7: Feedback Toast Message ---
  const [feedbackMessage, setFeedbackMessage] = useState("");

  // --- EFFECT: Synchronize Notes to localStorage on Every Change ---
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(notes));
    } catch (err) {
      console.warn("Could not save notes to localStorage:", err);
    }
  }, [notes, storageKey]);

  // Temporary feedback toast helper
  const showFeedback = (msg) => {
    setFeedbackMessage(msg);
    setTimeout(() => {
      setFeedbackMessage("");
    }, 3500);
  };

  // --- FORM VALIDATION ---
  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) {
      newErrors.title = "Note title is required.";
    } else if (title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters long.";
    }

    if (!content.trim()) {
      newErrors.content = "Note content cannot be empty.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // --- HANDLER: Add or Update Note ---
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const now = new Date().toISOString();

    if (editingId) {
      // UPDATE EXISTING NOTE
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.id === editingId
            ? {
                ...note,
                title: title.trim(),
                category,
                content: content.trim(),
                updatedAt: now
              }
            : note
        )
      );
      showFeedback(`✓ Note "${title.trim()}" updated successfully!`);
      setEditingId(null);
    } else {
      // ADD NEW NOTE
      const newNote = {
        id: `note_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        title: title.trim(),
        category,
        content: content.trim(),
        createdAt: now,
        updatedAt: now
      };
      setNotes((prevNotes) => [newNote, ...prevNotes]);
      showFeedback(`✓ Note "${newNote.title}" added to your revision desk!`);
    }

    // Reset form fields
    setTitle("");
    setCategory("DSA");
    setContent("");
    setErrors({});
  };

  // --- HANDLER: Start Editing a Note ---
  const handleStartEdit = (note) => {
    setEditingId(note.id);
    setTitle(note.title);
    setCategory(note.category);
    setContent(note.content);
    setErrors({});

    // Smooth scroll to form
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  // --- HANDLER: Cancel Editing ---
  const handleCancelEdit = () => {
    setEditingId(null);
    setTitle("");
    setCategory("DSA");
    setContent("");
    setErrors({});
  };

  // --- HANDLER: Open Delete Confirmation Modal ---
  const handlePromptDelete = (note) => {
    setNoteToDelete(note);
  };

  // --- HANDLER: Confirm Delete ---
  const handleConfirmDelete = () => {
    if (!noteToDelete) return;
    const noteTitle = noteToDelete.title;
    setNotes((prevNotes) => prevNotes.filter((n) => n.id !== noteToDelete.id));

    // If currently editing the note that is being deleted, reset form
    if (editingId === noteToDelete.id) {
      handleCancelEdit();
    }

    setNoteToDelete(null);
    showFeedback(`✓ Note "${noteTitle}" deleted successfully.`);
  };

  // --- FILTERING & SEARCHING (Demonstrating useMemo, .filter, case-insensitive match) ---
  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      // Category filter
      if (selectedCategory !== "All" && note.category !== selectedCategory) {
        return false;
      }
      // Search query (matches title or content)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = note.title.toLowerCase().includes(query);
        const matchesContent = note.content.toLowerCase().includes(query);
        if (!matchesTitle && !matchesContent) return false;
      }
      return true;
    });
  }, [notes, selectedCategory, searchQuery]);

  // Compute category counts for badge pills
  const categoryCounts = useMemo(() => {
    const counts = { All: notes.length };
    CATEGORIES.forEach((c) => (counts[c] = 0));
    notes.forEach((n) => {
      if (counts[n.category] !== undefined) {
        counts[n.category] += 1;
      }
    });
    return counts;
  }, [notes]);

  return (
    <section className="quick-notes-container">
      {/* Page Header */}
      <div className="qn-header-row">
        <div>
          <div className="badge-tag-purple">💡 REVISION & INTERVIEW PREP</div>
          <h1 className="qn-header-title">Quick Notes & Cheat Sheets</h1>
          <p className="qn-header-subtitle">
            Save essential algorithms, JavaScript patterns, React hooks, SQL syntax, and interview tips.
            Everything is automatically saved to your local storage.
          </p>
        </div>

        {/* Quick Stats Pill Group */}
        <div className="qn-stats-pill-group">
          <div className="qn-stat-badge">
            <div className="qn-stat-label">Total Notes</div>
            <div className="qn-stat-value">{notes.length}</div>
          </div>
          <div className="qn-stat-badge">
            <div className="qn-stat-label">Active Filter</div>
            <div className="qn-stat-value" style={{ color: "var(--primary)" }}>
              {selectedCategory}
            </div>
          </div>
          <div className="qn-stat-badge">
            <div className="qn-stat-label">Displaying</div>
            <div className="qn-stat-value" style={{ color: "#34d399" }}>
              {filteredNotes.length}
            </div>
          </div>
        </div>
      </div>

      {/* Note Creation / Editing Form Card */}
      <div
        ref={formRef}
        className={`qn-form-card ${editingId ? "editing-mode" : ""}`}
      >
        <div className="qn-form-header">
          <h2 className="qn-form-title">
            <span>{editingId ? "✏️ Edit Quick Note" : "📝 Add New Quick Note"}</span>
          </h2>
          {editingId && (
            <button
              type="button"
              className="view-code-btn"
              onClick={handleCancelEdit}
              style={{ fontSize: "12px" }}
            >
              ✕ Cancel Editing
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="qn-form-grid">
            {/* Title Input */}
            <div className="qn-form-field">
              <label htmlFor="qn-title-input" className="qn-field-label">
                <span>
                  Note Title <span className="qn-required-star">*</span>
                </span>
                <span style={{ fontSize: "11px", color: "var(--text-subtle)" }}>
                  {title.length}/80 chars
                </span>
              </label>
              <input
                id="qn-title-input"
                type="text"
                maxLength={80}
                className={`qn-input ${errors.title ? "has-error" : ""}`}
                placeholder="e.g. Kadane's Algorithm or React Memo vs useMemo"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errors.title) setErrors((prev) => ({ ...prev, title: null }));
                }}
              />
              {errors.title && <span className="qn-error-text">{errors.title}</span>}
            </div>

            {/* Category Dropdown */}
            <div className="qn-form-field">
              <label htmlFor="qn-category-select" className="qn-field-label">
                <span>
                  Category <span className="qn-required-star">*</span>
                </span>
              </label>
              <select
                id="qn-category-select"
                className="qn-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Content Textarea */}
          <div className="qn-form-field">
            <label htmlFor="qn-content-textarea" className="qn-field-label">
              <span>
                Note Content & Formulas <span className="qn-required-star">*</span>
              </span>
              <span style={{ fontSize: "11px", color: "var(--text-subtle)" }}>
                Supports key points & code snippets
              </span>
            </label>
            <textarea
              id="qn-content-textarea"
              rows={4}
              className={`qn-textarea ${errors.content ? "has-error" : ""}`}
              placeholder="Write down the core logic, time complexity, common interview traps, or memory aids..."
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                if (errors.content) setErrors((prev) => ({ ...prev, content: null }));
              }}
            />
            {errors.content && <span className="qn-error-text">{errors.content}</span>}
          </div>

          {/* Form Actions */}
          <div className="qn-form-actions">
            {editingId && (
              <button
                type="button"
                className="btn-secondary-dark"
                onClick={handleCancelEdit}
              >
                Cancel
              </button>
            )}
            <button type="submit" className="btn-primary-gradient">
              {editingId ? "✓ Save Changes" : "+ Add Quick Note"}
            </button>
          </div>
        </form>
      </div>

      {/* Search & Category Filter Controls */}
      <div className="qn-controls-bar">
        {/* Search Input */}
        <div className="qn-search-input-wrapper">
          <span className="qn-search-icon">🔍</span>
          <input
            type="search"
            className="qn-search-input"
            placeholder="Search notes by title or keywords in content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search quick notes"
          />
        </div>

        {/* Category Pills Row */}
        <div className="qn-category-pills-row">
          <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-muted)", marginRight: 4 }}>
            CATEGORY:
          </span>
          <button
            type="button"
            className={`qn-category-pill ${selectedCategory === "All" ? "active" : ""}`}
            onClick={() => setSelectedCategory("All")}
          >
            <span>All Categories</span>
            <span className="qn-pill-count">{categoryCounts.All}</span>
          </button>

          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`qn-category-pill ${selectedCategory === cat ? "active" : ""}`}
              onClick={() => setSelectedCategory(cat)}
            >
              <span>{cat}</span>
              <span className="qn-pill-count">{categoryCounts[cat] || 0}</span>
            </button>
          ))}

          {(selectedCategory !== "All" || searchQuery) && (
            <button
              type="button"
              className="view-code-btn"
              style={{ fontSize: "11.5px", marginLeft: "auto" }}
              onClick={() => {
                setSelectedCategory("All");
                setSearchQuery("");
              }}
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Notes Grid (Demonstrating list rendering with unique, stable key) */}
      {filteredNotes.length > 0 ? (
        <div className="qn-notes-grid">
          {filteredNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onEdit={handleStartEdit}
              onDelete={handlePromptDelete}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="qn-empty-card">
          <div className="qn-empty-icon">📭</div>
          <h3 className="qn-empty-title">
            {notes.length === 0
              ? "No Quick Notes Yet"
              : "No matching notes found"}
          </h3>
          <p className="qn-empty-desc">
            {notes.length === 0
              ? "Start jotting down crucial interview formulas, edge cases, and code templates above."
              : `No notes matched your search "${searchQuery}" in category "${selectedCategory}". Try adjusting your keywords or clearing the filter.`}
          </p>
          {notes.length > 0 && (
            <button
              type="button"
              className="btn-primary-gradient"
              onClick={() => {
                setSelectedCategory("All");
                setSearchQuery("");
              }}
            >
              Reset Search & Filters
            </button>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {noteToDelete && (
        <div
          className="qn-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label="Confirm Note Deletion"
        >
          <div className="qn-modal-box">
            <div className="qn-modal-header">
              <div className="qn-modal-warning-icon">⚠️</div>
              <div>
                <h3 className="qn-modal-title">Delete Note?</h3>
                <span className="tag-pill" style={{ fontSize: "11px" }}>
                  {noteToDelete.category}
                </span>
              </div>
            </div>

            <p className="qn-modal-desc">
              Are you sure you want to delete <strong>"{noteToDelete.title}"</strong>?
              This action cannot be undone.
            </p>

            <div className="qn-modal-actions">
              <button
                type="button"
                className="btn-secondary-dark"
                onClick={() => setNoteToDelete(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="qn-btn-danger"
                onClick={handleConfirmDelete}
              >
                Confirm Delete 🗑️
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {feedbackMessage && <div className="toast-popup">{feedbackMessage}</div>}
    </section>
  );
}
