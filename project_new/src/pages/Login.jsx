// Login & Registration Component
// Handles student signup and signin, saving accounts to localStorage

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTodayDateString } from "./hooks";
import {
  isValidEmail,
  StrictEmailInput,
  StrictNumberInput,
} from "./ValidationInputs";

// Keys for storing user data in browser localStorage
export const USERS_STORAGE_KEY = "nextoffer_users_list";
export const SESSION_STORAGE_KEY = "nextoffer_active_session";

// Helper function to read users from localStorage
export function loadUsersFromStorage() {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.log("Could not load users list:", err);
    return [];
  }
}

// Helper function to save users back to localStorage
export function saveUsersToStorage(users) {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (err) {
    console.error("Failed to save users:", err);
  }
}

export default function Login({ onLoginSuccess }) {
  const navigate = useNavigate();

  // Mode can be either 'login' or 'create'
  const [mode, setMode] = useState("login");

  // Form input states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Handle form submission for both login and signup
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Basic email format check
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const users = loadUsersFromStorage();

    // Signup / Registration flow
    if (mode === "create") {
      if (!name.trim()) {
        setError("Please enter your name.");
        return;
      }

      if (password.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
      }

      // Check if this email is already registered
      const existing = users.find(
        (u) => u.email.toLowerCase() === normalizedEmail
      );

      if (existing) {
        setError(
          "An account with this email already exists. Please log in."
        );
        return;
      }

      // Create new student user object
      const newUser = {
        id: `user_${Date.now()}`,
        name: name.trim(),
        email: normalizedEmail,
        password: password,

        profile: {
          name: name.trim(),
          email: normalizedEmail,
          phone: phone.trim(),
          title: "Frontend Developer · Student Developer",
          location: "India · Open to internships",
          about:
            "Enthusiastic student developer learning web development and preparing for tech placements.",

          skills: [
            "JavaScript",
            "React",
            "Python",
            "DSA",
            "HTML5",
            "CSS3",
          ],

          stats: {
            problems: 0,
            projects: 0,
          },
        },

        completed: [],
        submissions: [],
        projects: [],
        activeDates: [getTodayDateString()],
      };

      const updated = [...users, newUser];

      saveUsersToStorage(updated);
      onLoginSuccess(newUser);
      navigate("/dashboard");
      return;
    }

    // Login flow
    const user = users.find(
      (u) => u.email.toLowerCase() === normalizedEmail
    );

    if (!user) {
      setError(
        "No account found with this email. Please click Sign up to create an account."
      );
      return;
    }

    if (user.password !== password) {
      setError("Incorrect password. Please try again.");
      return;
    }

    // Update active practice date for streak calculation
    const todayStr = getTodayDateString();
    const activeDates = new Set(user.activeDates || []);

    activeDates.add(todayStr);
    user.activeDates = Array.from(activeDates);

    saveUsersToStorage(users);

    onLoginSuccess(user);
    navigate("/dashboard");
  };

  return (
    <div className="login-screen-wrapper">
      <div className="auth-form-card">

        {/* Project Branding Header */}
        <div className="auth-brand-header">
          <div className="brand-icon-box">⚡</div>

          <div>
            <h2
              style={{
                fontSize: "20px",
                fontWeight: 800,
              }}
            >
              Next<span>Offer</span>
            </h2>

            <p
              style={{
                fontSize: "12px",
                color: "var(--text-muted)",
              }}
            >
              Student Placement Prep Portal
            </p>
          </div>
        </div>

        <h3
          style={{
            fontSize: "18px",
            fontWeight: 700,
            marginBottom: "6px",
          }}
        >
          {mode === "login"
            ? "Welcome back"
            : "Create Student Account"}
        </h3>

        <p
          style={{
            color: "var(--text-muted)",
            fontSize: "13.5px",
            marginBottom: "20px",
          }}
        >
          {mode === "login"
            ? "Log in to track your streak, solve coding challenges, and build your resume."
            : "Sign up to start practicing coding and prepare for tech placements."}
        </p>

        <form
          onSubmit={handleSubmit}
          className="custom-form"
        >
          {mode === "create" && (
            <div className="form-field-group">
              <label>Full Name *</label>

              <input
                required
                className="custom-input"
                placeholder="e.g. Alex Morgan"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}

          <div className="form-field-group">
            <label>
              <span>Email Address *</span>

              <span className="field-constraint-tag">
                Valid email format
              </span>
            </label>

            <StrictEmailInput
              required
              value={email}
              onChange={setEmail}
              placeholder="e.g. student@college.edu"
            />
          </div>

          {mode === "create" && (
            <div className="form-field-group">
              <label>
                <span>Phone Number</span>

                <span className="field-constraint-tag">
                  Digits only
                </span>
              </label>

              <StrictNumberInput
                value={phone}
                onChange={setPhone}
                placeholder="e.g. 9876543210"
                maxLength={12}
              />
            </div>
          )}

          <div className="form-field-group">
            <label>Password *</label>

            <input
              required
              type="password"
              className="custom-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div
              style={{
                color: "#f87171",
                fontSize: "13px",
                fontWeight: 600,
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn-primary-gradient"
            style={{
              width: "100%",
              justifyContent: "center",
              padding: "12px",
            }}
          >
            {mode === "login"
              ? "Sign In →"
              : "Create Account →"}
          </button>

          {/* Toggle between login and sign up */}
          <div
            style={{
              textAlign: "center",
              marginTop: "12px",
              fontSize: "13px",
              color: "var(--text-muted)",
            }}
          >
            {mode === "login" ? (
              <>
                Don't have an account?{" "}

                <button
                  type="button"
                  style={{
                    background: "none",
                    border: "none",
                    color: "#818cf8",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setMode("create");
                    setError("");
                  }}
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already registered?{" "}

                <button
                  type="button"
                  style={{
                    background: "none",
                    border: "none",
                    color: "#818cf8",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setMode("login");
                    setError("");
                  }}
                >
                  Sign in
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}