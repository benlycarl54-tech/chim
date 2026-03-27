import { useEffect } from "react";

export default function ThemeProvider({ children }) {
  useEffect(() => {
    const savedTheme = localStorage.getItem("appTheme") || "blue";
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (theme) => {
    const root = document.documentElement;
    
    const themes = {
      blue: {
        primary: "#003087",
        primaryDark: "#002266",
        accent: "#E87722",
        background: "#f0f2f5"
      },
      dark: {
        primary: "#1a1a1a",
        primaryDark: "#000000",
        accent: "#4CAF50",
        background: "#121212"
      },
      green: {
        primary: "#2E7D32",
        primaryDark: "#1B5E20",
        accent: "#FF9800",
        background: "#f1f8f4"
      },
      purple: {
        primary: "#6A1B9A",
        primaryDark: "#4A148C",
        accent: "#FFD700",
        background: "#f3f0f8"
      }
    };

    const selectedTheme = themes[theme] || themes.blue;

    root.style.setProperty("--theme-primary", selectedTheme.primary);
    root.style.setProperty("--theme-primary-dark", selectedTheme.primaryDark);
    root.style.setProperty("--theme-accent", selectedTheme.accent);
    root.style.setProperty("--theme-background", selectedTheme.background);
  };

  return <>{children}</>;
}