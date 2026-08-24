// Custom hook for dark mode and light mode switching
// Sets the data-theme attribute on document root element

import { useState, useEffect } from "react";

export function useTheme() {
  // Check if user previously selected a theme
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("nextoffer_theme");
    return savedTheme || "dark";
  });

  useEffect(() => {
    // Apply theme to html root tag
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("nextoffer_theme", theme);
  }, [theme]);

  // Toggle function for the button in sidebar
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  return [theme, toggleTheme];
}
