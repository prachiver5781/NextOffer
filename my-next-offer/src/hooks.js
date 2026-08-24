import { useState, useEffect } from "react";

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved !== null ? JSON.parse(saved) : initialValue;
    } catch (err) {
      console.warn(`Error reading localStorage key "${key}":`, err);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error(`Error writing localStorage key "${key}":`, err);
    }
  }, [key, value]);

  return [value, setValue];
}

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("nextoffer_theme");
    if (saved) return saved;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("nextoffer_theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return [theme, toggleTheme];
}

export function getTodayDateString() {
  const now = new Date();
  return now.toISOString().split("T")[0];
}

export function calculateStreak(activeDates = []) {
  if (!activeDates || activeDates.length === 0) return 0;

  const dateSet = new Set(activeDates);
  const today = new Date();
  let streak = 0;

  const todayStr = getTodayDateString();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  let checkDate = dateSet.has(todayStr) ? today : (dateSet.has(yesterdayStr) ? yesterday : null);

  if (!checkDate) return 0;

  let curr = new Date(checkDate);
  while (true) {
    const str = curr.toISOString().split("T")[0];
    if (dateSet.has(str)) {
      streak++;
      curr.setDate(curr.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}