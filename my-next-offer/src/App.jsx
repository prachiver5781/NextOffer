// Main Application Component - NextOffer
// Manages overall routing, theme state, and active student user session

import React, { useState, useMemo, useCallback } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Custom Hooks for localStorage and Theme switching
import { useLocalStorage, useTheme } from "./hooks";

// Page & Layout Components
import Layout from "./Layout";
import Login, {
  loadUsersFromStorage,
  saveUsersToStorage,
  SESSION_STORAGE_KEY
} from "./pages/Login";
import ProtectedRoute from "./ProtectedRoute";
import Dashboard from "./Dashboard";
import Library from "./Library";
import Practice from "./Practice";
import Roadmap from "./Roadmap";
import MockInterview from "./MockInterview";
import Submissions from "./Submissions";
import Profile from "./Profile";
import Resume from "./Resume";

export default function App() {
  // Theme state: 'dark' or 'light'
  const [theme, toggleTheme] = useTheme();

  // Active student user session email (defaults to null so login page opens first)
  const [currentEmail, setCurrentEmail] = useLocalStorage(
    SESSION_STORAGE_KEY,
    null
  );

  // Load all registered users list from localStorage
  const [users, setUsers] = useState(() => loadUsersFromStorage());

  // Find the currently logged in student object
  const currentUser = useMemo(() => {
    if (!currentEmail) return null;
    return users.find((u) => u.email.toLowerCase() === currentEmail.toLowerCase()) || null;
  }, [users, currentEmail]);

  // Update student profile/submissions in user list and localStorage
  const updateUser = useCallback((updatedUser) => {
    const updatedList = users.map((u) =>
      u.email.toLowerCase() === updatedUser.email.toLowerCase() ? updatedUser : u
    );
    setUsers(updatedList);
    saveUsersToStorage(updatedList);
  }, [users]);

  // Callback when student logs in or creates an account
  const handleLoginSuccess = (user) => {
    const existing = users.find((u) => u.email.toLowerCase() === user.email.toLowerCase());
    let updatedList;
    if (existing) {
      updatedList = users.map((u) =>
        u.email.toLowerCase() === user.email.toLowerCase() ? user : u
      );
    } else {
      updatedList = [...users, user];
    }
    setUsers(updatedList);
    saveUsersToStorage(updatedList);
    setCurrentEmail(user.email);
  };

  // Logout handler
  const handleLogout = () => {
    setCurrentEmail(null);
  };

  return (
    <Routes>
      {/* Login Route */}
      <Route
        path="/login"
        element={
          currentUser ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Login onLoginSuccess={handleLoginSuccess} />
          )
        }
      />

      {/* Main Workspace Layout Routes */}
      <Route
        element={
          <Layout
            currentUser={currentUser}
            onLogout={handleLogout}
            theme={theme}
            toggleTheme={toggleTheme}
          />
        }
      >
        {/* Index route: redirect to dashboard if logged in, otherwise login */}
        <Route
          index
          element={<Navigate to={currentUser ? "/dashboard" : "/login"} replace />}
        />

        {/* Protected Routes (require login) */}
        <Route element={<ProtectedRoute currentUser={currentUser} />}>
          <Route
            path="dashboard"
            element={<Dashboard currentUser={currentUser} updateUser={updateUser} />}
          />
          <Route
            path="topics"
            element={<Library currentUser={currentUser} updateUser={updateUser} />}
          />
          <Route
            path="topics/:topicId"
            element={<Practice currentUser={currentUser} updateUser={updateUser} />}
          />
          <Route
            path="submissions"
            element={<Submissions currentUser={currentUser} />}
          />
          <Route path="roadmap" element={<Roadmap />} />
          <Route
            path="mock"
            element={<MockInterview currentUser={currentUser} />}
          />
          <Route
            path="profile"
            element={<Profile currentUser={currentUser} updateUser={updateUser} />}
          />
          <Route
            path="projects"
            element={<Resume currentUser={currentUser} updateUser={updateUser} />}
          />
          <Route
            path="resume"
            element={<Resume currentUser={currentUser} updateUser={updateUser} />}
          />
        </Route>

        {/* Fallback Catch-All Route */}
        <Route
          path="*"
          element={<Navigate to={currentUser ? "/dashboard" : "/login"} replace />}
        />
      </Route>
    </Routes>
  );
}

// Re-export common inputs & validation for backward compatibility
export * from "./ValidationInputs";