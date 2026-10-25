// Custom hook to track active student practice time on NextOffer
import { useState, useEffect, useRef } from "react";
import { getTodayDateString } from "./useStreak";

export function formatDuration(seconds) {
  if (!seconds || seconds <= 0) return "0s";
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  if (hrs > 0) {
    return `${hrs}h ${mins}m ${secs}s`;
  }
  if (mins > 0) {
    return `${mins}m ${secs}s`;
  }
  return `${secs}s`;
}

export function formatDurationShort(seconds) {
  if (!seconds || seconds <= 0) return "0 mins";
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  if (hrs > 0) {
    return `${hrs} hr ${mins} min${mins === 1 ? "" : "s"}`;
  }
  return `${mins} min${mins === 1 ? "" : "s"}`;
}

export function useTimeTracker(userKey = "guest") {
  const storageKey = `nextoffer_time_spent_${userKey}`;
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [trackerData, setTrackerData] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || "null");
      const today = getTodayDateString();
      if (saved && typeof saved === "object") {
        return {
          totalSeconds: Number(saved.totalSeconds) || 0,
          todaySeconds: saved.lastDate === today ? (Number(saved.todaySeconds) || 0) : 0,
          lastDate: today
        };
      }
    } catch {}
    return {
      totalSeconds: 0,
      todaySeconds: 0,
      lastDate: getTodayDateString()
    };
  });

  useEffect(() => {
    const today = getTodayDateString();
    const interval = setInterval(() => {
      // Only count active time when document is visible
      if (typeof document !== "undefined" && document.visibilityState === "visible") {
        setSessionSeconds((s) => s + 1);
        setTrackerData((prev) => {
          const isSameDay = prev.lastDate === today;
          return {
            totalSeconds: prev.totalSeconds + 1,
            todaySeconds: (isSameDay ? prev.todaySeconds : 0) + 1,
            lastDate: today
          };
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [userKey]);

  // Persist periodically
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(trackerData));
    } catch {}
  }, [trackerData, storageKey]);

  const resetSession = () => {
    setSessionSeconds(0);
  };

  return {
    totalSeconds: trackerData.totalSeconds,
    todaySeconds: trackerData.todaySeconds,
    sessionSeconds,
    totalFormatted: formatDuration(trackerData.totalSeconds),
    todayFormatted: formatDuration(trackerData.todaySeconds),
    sessionFormatted: formatDuration(sessionSeconds),
    totalFormattedShort: formatDurationShort(trackerData.totalSeconds),
    todayFormattedShort: formatDurationShort(trackerData.todaySeconds),
    resetSession
  };
}
