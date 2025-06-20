import { useEffect, useState } from "react";

type Theme = "dark" | "light";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const root = window.document.documentElement;
    const savedTheme = localStorage.getItem("theme") as Theme;
    
    if (savedTheme) {
      setTheme(savedTheme);
      root.classList.toggle("dark", savedTheme === "dark");
    } else {
      // Default to dark theme
      setTheme("dark");
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
  }, []);

  const toggleTheme = () => {
    const root = window.document.documentElement;
    const newTheme = theme === "dark" ? "light" : "dark";
    
    setTheme(newTheme);
    root.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };

  return { theme, toggleTheme };
}
