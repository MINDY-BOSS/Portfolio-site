"use client";

import { Moon } from "lucide-react";
import { useEffect, useState } from "react";

type ToggleSize = "sm" | "md" | "lg";

interface ThemeToggleProps {
  className?: string;
  size?: ToggleSize;
}

const sizeConfig = {
  sm: {
    track: "h-6 w-11",
    knob: "h-4 w-4",
    knobOffset: "left-[calc(100%-1.125rem)]",
    knobStart: "left-0.5",
    icon: 12,
  },
  md: {
    track: "h-8 w-14",
    knob: "h-6 w-6",
    knobOffset: "left-[calc(100%-1.625rem)]",
    knobStart: "left-0.5",
    icon: 16,
  },
  lg: {
    track: "h-10 w-[4.5rem]",
    knob: "h-8 w-8",
    knobOffset: "left-[calc(100%-2.125rem)]",
    knobStart: "left-0.5",
    icon: 20,
  },
} satisfies Record<ToggleSize, {
  track: string;
  knob: string;
  knobOffset: string;
  knobStart: string;
  icon: number;
}>;

function SunIcon({ className, size }: { className?: string; size: number }) {
  return (
    <svg
      aria-hidden="true"
      className={`block shrink-0 ${className ?? ""}`}
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" fill="currentColor" r="3.25" />
      <g stroke="currentColor" strokeLinecap="round" strokeWidth="2">
        <path d="M12 2.5v2.5" />
        <path d="M12 19v2.5" />
        <path d="m4.22 4.22 1.77 1.77" />
        <path d="m18.01 18.01 1.77 1.77" />
        <path d="M2.5 12H5" />
        <path d="M19 12h2.5" />
        <path d="m4.22 19.78 1.77-1.77" />
        <path d="m18.01 5.99 1.77-1.77" />
      </g>
    </svg>
  );
}

const THEME_STORAGE_KEY = "portfolio-theme";

export function ThemeToggle({ className = "", size = "md" }: ThemeToggleProps) {
  const [isDark, setIsDark] = useState(true);
  const config = sizeConfig[size];

  useEffect(() => {
    let theme = "dark";
    try {
      theme = window.localStorage.getItem(THEME_STORAGE_KEY) ?? "dark";
    } catch {
      // Keep the default dark theme when storage is unavailable.
    }

    const dark = theme !== "light";
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    setIsDark(dark);
  }, []);

  const toggle = () => {
    const nextIsDark = !isDark;
    document.documentElement.dataset.theme = nextIsDark ? "dark" : "light";
    try {
      window.localStorage.setItem(
        THEME_STORAGE_KEY,
        nextIsDark ? "dark" : "light"
      );
    } catch {
      // The current page still changes theme when storage is unavailable.
    }
    setIsDark(nextIsDark);
  };

  return (
    <button
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      aria-checked={isDark}
      className={`relative inline-flex shrink-0 cursor-pointer items-center rounded-full border transition-colors duration-300 ${config.track} ${isDark ? "border-line bg-foreground/10" : "border-foreground/20 bg-accent/20"} ${className}`}
      onClick={toggle}
      role="switch"
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
      type="button"
    >
      <span
        className={`absolute top-1/2 grid -translate-y-1/2 place-items-center rounded-full transition-[left,background-color,color] duration-300 ${config.knob} ${isDark ? config.knobOffset : config.knobStart} bg-accent text-background`}
      >
        <SunIcon
          className={`col-start-1 row-start-1 origin-center transition-all duration-300 ${
            isDark ? "rotate-90 scale-50 opacity-0" : "rotate-0 scale-100 opacity-100"
          }`}
          size={config.icon}
        />
        <Moon
          aria-hidden="true"
          className={`col-start-1 row-start-1 origin-center transition-all duration-300 ${
            isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-50 opacity-0"
          }`}
          size={config.icon}
          strokeWidth={2}
        />
      </span>
    </button>
  );
}
