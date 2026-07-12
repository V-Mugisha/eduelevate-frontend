import { useState, useEffect } from "react";

export default function useDarkMode() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const storedPreference = localStorage.getItem("eduelevate-dark-mode");
    if (storedPreference !== null) {
      return storedPreference === "dark";
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("eduelevate-dark-mode", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  function toggleDarkMode() {
    setIsDarkMode((previousMode) => !previousMode);
  }

  return { isDarkMode, toggleDarkMode };
}
