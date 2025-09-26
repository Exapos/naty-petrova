"use client";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check for saved theme or default to dark
    const savedTheme = localStorage.getItem('theme');
    const isDark = savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setDark(isDark);
  }, []);

  useEffect(() => {
    if (mounted) {
      if (dark) {
        document.documentElement.classList.add("dark");
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem('theme', 'light');
      }
    }
  }, [dark, mounted]);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <button
        aria-label="Přepnout dark/light mode"
        className="ml-4 flex items-center relative w-14 h-8 bg-zinc-200 dark:bg-zinc-800 rounded-full p-1 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        disabled
      >
        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-yellow-400">
          <Sun size={18} />
        </span>
        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-400">
          <Moon size={18} />
        </span>
        <span className="absolute top-1/2 -translate-y-1/2 left-1 transition-all duration-300 w-6 h-6 rounded-full shadow-md bg-white dark:bg-zinc-700" />
      </button>
    );
  }

  return (
    <button
      aria-label="Přepnout dark/light mode"
      className="ml-4 flex items-center relative w-14 h-8 bg-zinc-200 dark:bg-zinc-800 rounded-full p-1 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
      onClick={() => setDark((d) => !d)}
    >
      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-yellow-400">
        <Sun size={18} />
      </span>
      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-400">
        <Moon size={18} />
      </span>
      <span
        className={`absolute top-1/2 -translate-y-1/2 left-1 transition-all duration-300 w-6 h-6 rounded-full shadow-md bg-white dark:bg-zinc-700 ${dark ? 'translate-x-6' : ''}`}
      />
    </button>
  );
}
