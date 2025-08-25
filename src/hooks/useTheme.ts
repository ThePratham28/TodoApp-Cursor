import { useEffect, useState } from "react";

export function useTheme() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    try {
      const themePref = localStorage.getItem("theme");
      if (themePref === "dark") setIsDark(true);
      else if (themePref === "light") setIsDark(false);
      else if (window.matchMedia)
        setIsDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
    } catch {}
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      try {
        localStorage.setItem("theme", "dark");
      } catch {}
    } else {
      root.classList.remove("dark");
      try {
        localStorage.setItem("theme", "light");
      } catch {}
    }
  }, [isDark]);

  return { isDark, setIsDark };
}
