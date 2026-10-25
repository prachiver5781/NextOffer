// Global Authentication & User State Context - NextOffer
// Designed for B.Tech CSE Project Evaluation II
// Demonstrates:
// 1. React Context API (createContext, useContext, Provider)
// 2. State Architecture: Global State (User Session, Theme) vs Local State (Form inputs, Modals)
// 3. Avoiding Prop Drilling across nested layout components

import React, { createContext, useContext, useState, useMemo, useCallback, useEffect } from "react";
import { useLocalStorage, useTheme, getTodayDateString } from "../hooks";

// Storage keys
export const USERS_STORAGE_KEY = "nextoffer_users_list";
export const SESSION_STORAGE_KEY = "nextoffer_active_session";

// Helper function to read registered users from localStorage
export function loadUsersFromStorage() {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([]));
      return [];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([]));
      return [];
    }
    return parsed;
  } catch (err) {
    console.error("Could not load users list from localStorage:", err);
    return [];
  }
}

// Helper function to save users back to localStorage
export function saveUsersToStorage(users) {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (err) {
    console.error("Failed to save users to localStorage:", err);
  }
}

// Create the Context object
export const AuthContext = createContext(null);

// Custom hook to consume the AuthContext cleanly
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Provider Component wrapping the app tree
export function AuthProvider({ children }) {
  // Theme state: 'dark' or 'light'
  const [theme, toggleTheme] = useTheme();

  // Active student session email in localStorage
  const [currentEmail, setCurrentEmail] = useLocalStorage(SESSION_STORAGE_KEY, null);

  // Registered students list in localStorage
  const [users, setUsers] = useState(() => loadUsersFromStorage());

  // Find active student user object
  const currentUser = useMemo(() => {
    if (!currentEmail) return null;
    return users.find((u) => u.email.toLowerCase() === currentEmail.toLowerCase()) || null;
  }, [users, currentEmail]);

  // Synchronize state and localStorage when user profile updates
  const updateUser = useCallback((updatedUser) => {
    setUsers((prevUsers) => {
      const updatedList = prevUsers.map((u) =>
        u.email.toLowerCase() === updatedUser.email.toLowerCase() ? updatedUser : u
      );
      saveUsersToStorage(updatedList);
      return updatedList;
    });
  }, []);

  // Login handler
  const login = useCallback((email, password) => {
    const normalized = email.trim().toLowerCase();
    const existing = users.find((u) => u.email.toLowerCase() === normalized);

    if (!existing) {
      return { success: false, error: "No account found with this email. Please sign up." };
    }

    if (existing.password !== password) {
      return { success: false, error: "Incorrect password. Please try again." };
    }

    // Update active practice date for streak tracking
    const today = getTodayDateString();
    const activeDates = new Set(existing.activeDates || []);
    activeDates.add(today);
    existing.activeDates = Array.from(activeDates);

    updateUser(existing);
    setCurrentEmail(existing.email);
    return { success: true, user: existing };
  }, [users, updateUser, setCurrentEmail]);

  // Signup / registration handler
  const signup = useCallback((newUserData) => {
    const normalized = newUserData.email.trim().toLowerCase();
    const existing = users.find((u) => u.email.toLowerCase() === normalized);

    if (existing) {
      return { success: false, error: "An account with this email already exists." };
    }

    const newUser = {
      id: `user_${Date.now()}`,
      name: newUserData.name.trim(),
      email: normalized,
      password: newUserData.password,
      profile: {
        name: newUserData.name.trim(),
        email: normalized,
        phone: (newUserData.phone || "").trim(),
        title: "Frontend Developer · Student Developer",
        location: "India · Open to internships",
        about: "Enthusiastic student developer learning web development and preparing for tech placements.",
        skills: ["JavaScript", "React", "Python", "DSA", "HTML5", "CSS3"],
        links: {
          github: "",
          linkedin: "",
          leetcode: "",
          hackerrank: "",
          portfolio: ""
        },
        education: [
          {
            id: `edu_${Date.now()}`,
            degree: "B.Tech in Computer Science",
            institution: "College of Engineering",
            year: "2024 - 2028",
            score: "Current Student"
          }
        ],
        experience: [],
        stats: {
          problems: 0,
          projects: 0
        }
      },
      completed: [],
      submissions: [],
      projects: [],
      activeDates: [getTodayDateString()]
    };

    const updated = [...users, newUser];
    setUsers(updated);
    saveUsersToStorage(updated);
    setCurrentEmail(newUser.email);
    return { success: true, user: newUser };
  }, [users, setCurrentEmail]);

  // Logout handler
  const logout = useCallback(() => {
    setCurrentEmail(null);
  }, [setCurrentEmail]);

  // Value object provided to consumer components
  const value = useMemo(
    () => ({
      currentUser,
      users,
      updateUser,
      login,
      signup,
      logout,
      theme,
      toggleTheme
    }),
    [currentUser, users, updateUser, login, signup, logout, theme, toggleTheme]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
