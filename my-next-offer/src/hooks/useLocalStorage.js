// Custom hook to save and read data from browser localStorage
// This prevents data loss when the user refreshes the page

import { useState, useEffect } from "react";

export function useLocalStorage(key, initialValue) {
  // Read value from localStorage when the component first mounts
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      if (item !== null) {
        return JSON.parse(item);
      }
      return initialValue;
    } catch (error) {
      console.log("Error reading from localStorage:", error);
      return initialValue;
    }
  });

  // Whenever storedValue changes, update localStorage
  useEffect(() => {
    try {
      if (storedValue === null || storedValue === undefined) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, JSON.stringify(storedValue));
      }
    } catch (error) {
      console.log("Error saving to localStorage:", error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
