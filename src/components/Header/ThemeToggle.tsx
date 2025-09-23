"use client";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

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
