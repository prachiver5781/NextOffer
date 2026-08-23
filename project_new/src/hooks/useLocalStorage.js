import { useState, useEffect } from "react";

/**
 * Custom hook to manage persistent state in localStorage.
 * 
 * @param {string} key - The localStorage key name.
 * @param {*} initialValue - The fallback initial value if no stored value exists.
 * @returns {[*, Function]} State value and setter function.
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved !== null ? JSON.parse(saved) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving to localStorage key "${key}":`, error);
    }
  }, [key, value]);

  return [value, setValue];
}
