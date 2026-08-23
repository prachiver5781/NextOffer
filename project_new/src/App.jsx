import { useState, useEffect, useCallback } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useLocalStorage } from "./hooks";

// Layout & Common Components
import Toast from "./components/common/Toast";
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Pages
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Topics from "./pages/Topics";
import TopicDetails from "./pages/TopicDetails";
import Roadmap from "./pages/Roadmap";
import MockInterview from "./pages/MockInterview";
import Resume from "./pages/Resume";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(
    () => localStorage.getItem("nextoffer-logged-in") === "true"
  );
  const [profile, setProfile] = useLocalStorage("nextoffer-profile", null);
  const [completed, setCompleted] = useLocalStorage("nextoffer-completed", []);
  const [roadmapProgress, setRoadmapProgress] = useLocalStorage("nextoffer-roadmap", {});
  const [darkMode, setDarkMode] = useLocalStorage("nextoffer-dark-mode", false);
  const [streak] = useLocalStorage("nextoffer-streak", 7);
  const [toast, setToast] = useState("");

  useEffect(() => {
    localStorage.setItem("nextoffer-logged-in", String(loggedIn));
  }, [loggedIn]);

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
  }, [darkMode]);

  const showToast = useCallback((message) => {
    setToast(message);
  }, []);

  return (
    <>
      <Toast message={toast} onClose={() => setToast("")} />

      <Routes>
        <Route
          path="/login"
          element={
            loggedIn ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Login
                setLoggedIn={setLoggedIn}
                setProfile={setProfile}
                showToast={showToast}
              />
            )
          }
        />

        <Route
          element={
            <Layout
              loggedIn={loggedIn}
              setLoggedIn={setLoggedIn}
              profile={profile}
              darkMode={darkMode}
              setDarkMode={setDarkMode}
            />
          }
        >
          <Route index element={<Home loggedIn={loggedIn} />} />

          <Route element={<ProtectedRoute loggedIn={loggedIn} />}>
            <Route
              path="dashboard"
              element={
                <Dashboard
                  completed={completed}
                  profile={profile}
                  streak={streak}
                />
              }
            />
            <Route
              path="topics"
              element={
                <Topics
                  completed={completed}
                  setCompleted={setCompleted}
                  showToast={showToast}
                />
              }
            />
            <Route
              path="topics/:topicId"
              element={
                <TopicDetails
                  completed={completed}
                  setCompleted={setCompleted}
                  showToast={showToast}
                />
              }
            />
            <Route
              path="roadmap"
              element={
                <Roadmap
                  roadmapProgress={roadmapProgress}
                  setRoadmapProgress={setRoadmapProgress}
                />
              }
            />
            <Route path="mock-interview" element={<MockInterview />} />
            <Route
              path="resume"
              element={<Resume profile={profile} showToast={showToast} />}
            />
            <Route
              path="profile"
              element={
                <Profile
                  profile={profile}
                  setProfile={setProfile}
                  showToast={showToast}
                />
              }
            />
            <Route
              path="settings"
              element={
                <Settings
                  darkMode={darkMode}
                  setDarkMode={setDarkMode}
                  setCompleted={setCompleted}
                  setRoadmapProgress={setRoadmapProgress}
                  showToast={showToast}
                />
              }
            />
          </Route>

          <Route path="404" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}