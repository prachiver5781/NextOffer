// Reusable NoteCard Component - NextOffer
// Demonstrates:
// 1. Reusable component design with Props (note, onEdit, onDelete)
// 2. Dynamic classNames based on category
// 3. Human-readable date formatting
// 4. Accessible button actions with icons

import React from "react";

// Category icon mapper helper
const CATEGORY_ICONS = {
  DSA: "🧩",
  JavaScript: "⚡",
  React: "⚛️",
  SQL: "🗄️",
  "Interview Tips": "💡",
  Other: "📌"
};

// Formats ISO date string into human-friendly format
function formatDate(isoString) {
  if (!isoString) return "N/A";
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  } catch {
    return isoString;
  }
}

export default function NoteCard({ note, onEdit, onDelete }) {
  if (!note) return null;

  const categorySlug = (note.category || "other")
    .toLowerCase()
    .replace(/\s+/g, "-");
  const categoryIcon = CATEGORY_ICONS[note.category] || "📌";

  return (
    <article className="qn-note-card">
      <div>
        {/* Card Top: Category Badge */}
        <div className="qn-note-top">
          <span className={`qn-badge qn-badge-${categorySlug}`}>
            <span>{categoryIcon}</span>
            <span>{note.category}</span>
          </span>
        </div>

        {/* Note Title */}
        <h3 className="qn-note-title">{note.title}</h3>

        {/* Note Content */}
        <div className="qn-note-content">{note.content}</div>
      </div>

      <div>
        {/* Timestamps: Created & Last Updated */}
        <div className="qn-note-meta">
          <span>📅 Created: {formatDate(note.createdAt)}</span>
          {note.updatedAt && note.updatedAt !== note.createdAt && (
            <span>🕒 Updated: {formatDate(note.updatedAt)}</span>
          )}
        </div>

        {/* Action Buttons: Edit and Delete */}
        <div className="qn-note-actions">
          <button
            type="button"
            className="qn-action-btn edit-btn"
            onClick={() => onEdit(note)}
            title="Edit this note"
          >
            <span>✏️</span>
            <span>Edit</span>
          </button>
          <button
            type="button"
            className="qn-action-btn delete-btn"
            onClick={() => onDelete(note)}
            title="Delete this note"
          >
            <span>🗑️</span>
            <span>Delete</span>
          </button>
        </div>
      </div>
    </article>
  );
}
