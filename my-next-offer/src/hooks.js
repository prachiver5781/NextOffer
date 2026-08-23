import { useState, useEffect } from "react";

// Hook to keep state in sync with localStorage
export function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (err) {
      console.error(`Error reading ${key} from storage:`, err);
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error(`Error saving ${key} to storage:`, err);
    }
  }, [key, value]);

  return [value, setValue];
}

// Hook to handle dark / light theme toggling
export function useTheme() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("nextoffer_theme") || "dark";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("nextoffer_theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) => (current === "light" ? "dark" : "light"));
  };

  return [theme, toggleTheme];
}

// Returns YYYY-MM-DD for today
export function getTodayDateString() {
  return new Date().toISOString().split("T")[0];
}

// Calculates consecutive active days from an array of date strings
export function calculateStreak(activeDates = []) {
  if (!activeDates || activeDates.length === 0) return 0;

  const dates = new Set(activeDates);
  const today = new Date();
  const todayStr = getTodayDateString();

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  // Start from today if active, otherwise check if active yesterday
  let current = dates.has(todayStr) ? today : (dates.has(yesterdayStr) ? yesterday : null);
  if (!current) return 0;

  let streakCount = 0;
  const cursor = new Date(current);

  while (true) {
    const dateKey = cursor.toISOString().split("T")[0];
    if (dates.has(dateKey)) {
      streakCount++;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }

  return streakCount;
}