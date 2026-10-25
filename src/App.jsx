// Main Application Component - NextOffer
// Designed for B.Tech CSE Project Evaluation II
// Demonstrates:
// 1. Multi-Page SPA Navigation Architecture with React Router v6
// 2. Global State Architecture using React Context API (<AuthProvider>)
// 3. Protected Route access control and session management

import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Global Context Provider
import { AuthProvider, useAuth } from "./context/AuthContext";

// Page & Layout Components
import Layout from "./Layout";
import Login from "./Login";
import ProtectedRoute from "./ProtectedRoute";
import Dashboard from "./Dashboard";
import Library from "./Library";
import Practice from "./Practice";
import Roadmap from "./Roadmap";
import CareerDetails from "./CareerDetails";
import MockInterview from "./MockInterview";
import Submissions from "./Submissions";
import Profile from "./Profile";
import Resume from "./Resume";
import Settings from "./Settings";
import QuickNotes from "./QuickNotes";

// Inner router component that consumes the AuthContext
function AppRoutes() {
  const {
    currentUser,
    updateUser,
    login,
    signup,
    logout,
    theme,
    toggleTheme
  } = useAuth();

  return (
    <Routes>
      {/* Login / Auth Route */}
      <Route
        path="/login"
        element={
          currentUser ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Login
              onLoginSuccess={(user) => {
                // Handled via context session
              }}
            />
          )
        }
      />

      {/* Main Workspace Layout Routes */}
      <Route
        element={
          <Layout
            currentUser={currentUser}
            onLogout={logout}
          />
        }
      >
        {/* Index route: redirect to dashboard if logged in, otherwise login */}
        <Route
          index
          element={<Navigate to={currentUser ? "/dashboard" : "/login"} replace />}
        />

        {/* Protected Routes (Require Student Authentication) */}
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
            path="mock-interview"
            element={<MockInterview currentUser={currentUser} />}
          />
          {/* Keep the previous URL working for saved links. */}
          <Route path="mock" element={<Navigate to="/mock-interview" replace />} />
          <Route path="notes" element={<QuickNotes currentUser={currentUser} />} />
          <Route path="quick-notes" element={<Navigate to="/notes" replace />} />
          <Route path="careers/:title" element={<CareerDetails />} />
          <Route
            path="profile"
            element={<Profile currentUser={currentUser} updateUser={updateUser} />}
          />
          <Route path="settings" element={<Settings theme={theme} toggleTheme={toggleTheme} />} />
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

// Root export wrapping AppRoutes in AuthProvider Context
export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

// Re-export common inputs & validation for backward compatibility
export * from "./ValidationInputs";
export * from "./context/AuthContext";