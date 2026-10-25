// Login & Registration Component - NextOffer
// Designed for B.Tech CSE Project Evaluation II
// Demonstrates:
// 1. Reusable StrictEmailInput and StrictNumberInput validation components
// 2. Global State management via useAuth() context hook

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { isValidEmail, StrictEmailInput, StrictNumberInput } from "./ValidationInputs";
import {
  useAuth,
  loadUsersFromStorage,
  saveUsersToStorage,
  USERS_STORAGE_KEY,
  SESSION_STORAGE_KEY
} from "./context/AuthContext";

export { USERS_STORAGE_KEY, SESSION_STORAGE_KEY, loadUsersFromStorage, saveUsersToStorage };

export default function Login({ onLoginSuccess }) {
  const navigate = useNavigate();
  const { login, signup } = useAuth();

  // Mode can be either 'login' or 'create'
  const [mode, setMode] = useState("login");

  // Form input states (Local Component State)
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Handle form submission for both login and signup
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Basic email format check using reusable validation function
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

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

      const res = signup({
        name: name.trim(),
        email: email.trim(),
        password,
        phone: phone.trim()
      });

      if (!res.success) {
        setError(res.error);
        return;
      }

      if (onLoginSuccess) onLoginSuccess(res.user);
      navigate("/dashboard");
      return;
    }

    // Login flow
    const res = login(email, password);
    if (!res.success) {
      setError(res.error);
      return;
    }

    if (onLoginSuccess) onLoginSuccess(res.user);
    navigate("/dashboard");
  };

  return (
    <div className="login-screen-wrapper">
      <div className="auth-form-card">
        {/* Project Branding Header */}
        <div className="auth-brand-header">
          <div className="brand-icon-box">⚡</div>
          <div>
            <h2 style={{ fontSize: "20px", fontWeight: 800 }}>Next<span>Offer</span></h2>
            <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>Student Placement Prep Portal</p>
          </div>
        </div>

        <div style={{ textAlign: "center", margin: "14px 0 20px", color: "var(--text-subtle)", fontSize: "11px", fontWeight: 600, letterSpacing: "1px" }}>
          SIGN IN WITH YOUR ACCOUNT
        </div>

        <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "6px" }}>
          {mode === "login" ? "Welcome back" : "Create Student Account"}
        </h3>
        <p style={{ color: "var(--text-muted)", fontSize: "13.5px", marginBottom: "20px" }}>
          {mode === "login"
            ? "Log in to track your streak, solve coding challenges, and build your resume."
            : "Sign up to start practicing coding and prepare for tech placements."}
        </p>

        <form onSubmit={handleSubmit} className="custom-form">
          {mode === "create" && (
            <div className="form-field-group">
              <label>Full Name *</label>
              <input
                required
                className="custom-input"
                placeholder="e.g. Ruhani"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}

          <div className="form-field-group">
            <label>
              <span>Email Address *</span>
              <span className="field-constraint-tag">Valid email format</span>
            </label>
            <StrictEmailInput
              required
              value={email}
              onChange={setEmail}
              placeholder="e.g. ruhani@student.edu"
            />
          </div>

          {mode === "create" && (
            <div className="form-field-group">
              <label>
                <span>Phone Number</span>
                <span className="field-constraint-tag">Digits only</span>
              </label>
              <StrictNumberInput
                value={phone}
                onChange={setPhone}
                placeholder="e.g. 9876543210"
                maxLength={15}
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
                padding: "8px 12px",
                background: "rgba(239, 68, 68, 0.1)",
                borderRadius: "6px"
              }}
            >
              ⚠ {error}
            </div>
          )}

          <button
            type="submit"
            className="btn-primary-gradient"
            style={{ width: "100%", justifyContent: "center", padding: "12px", marginTop: "4px" }}
          >
            {mode === "login" ? "Sign In →" : "Create Account →"}
          </button>

          {/* Toggle between login and sign up */}
          <div style={{ textAlign: "center", marginTop: "14px", fontSize: "13px", color: "var(--text-muted)" }}>
            {mode === "login" ? (
              <>
                Don't have an account?{" "}
                <button
                  type="button"
                  style={{ background: "none", border: "none", color: "#818cf8", fontWeight: 700, cursor: "pointer" }}
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
                  style={{ background: "none", border: "none", color: "#818cf8", fontWeight: 700, cursor: "pointer" }}
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
