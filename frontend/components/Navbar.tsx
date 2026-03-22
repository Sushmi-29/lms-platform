"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

type Course = { id: number; title: string };

export default function Navbar({
  courses,
  setSearchQuery,
}: {
  courses: Course[];
  setSearchQuery: (query: string) => void;
}) {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const [theme, setTheme] = useState("light");
  const [open, setOpen] = useState(false);
  const [language, setLanguage] = useState("English");
  const [languageOpen, setLanguageOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const lang = localStorage.getItem("language");
    if (lang) setLanguage(lang);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) {
        setOpen(false);
        setLanguageOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Theme load
  useEffect(() => {
    const saved = localStorage.getItem("theme") || "light";
    setTheme(saved);

    if (saved === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    if (theme === "dark") {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setTheme("light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setTheme("dark");
    }
  };

  const onLogout = () => {
    localStorage.removeItem("subscribed_courses");
    logout();
    router.push("/auth/login");
  };

  const initials = (user?.name?.charAt(0) || "U").toUpperCase();
  const languages = ["English", "Hindi", "Kannada"] as const;

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200 transition-colors duration-300">
      
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 md:px-10 py-3 text-gray-900">

        {/* Logo */}
        <button
          className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
          onClick={() => router.push("/landing")}
        >
          EduNova
        </button>

        {/* Search */}
        <div className="flex-1 max-w-xl mx-6">
          <input
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search courses..."
            className="w-full rounded-full px-4 py-2 
            bg-gray-50 
            border border-gray-300 
            text-gray-900 
            placeholder-gray-500
            focus:outline-none focus:ring-2 focus:ring-indigo-500 
            transition"
          />
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">

          {/* Language */}
          <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
            🌐 {language}
          </div>


          {/* Avatar */}
          <div className="relative" ref={ref}>
            <div
              className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full flex items-center justify-center cursor-pointer shadow-md"
              onClick={() => {
                setOpen((v) => !v);
                if (open) setLanguageOpen(false);
              }}
            >
              {initials}
            </div>

            {/* Dropdown */}
            <div
              className={`absolute right-0 mt-2 bg-white shadow-xl rounded-xl w-56 border border-gray-200 overflow-hidden transition ${
                open
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-95 pointer-events-none"
              }`}
            >
              <div className="p-3">
                <div className="font-semibold text-gray-900">
                  {user?.name}
                </div>
                <div className="text-xs text-gray-500">
                  {user?.email}
                </div>
              </div>

              <button
                className="w-full px-3 py-2 text-left hover:bg-gray-50"
                onClick={() => router.push("/landing#my-courses")}
              >
                My Courses
              </button>

              <button
                className="w-full px-3 py-2 text-left hover:bg-gray-50"
                onClick={() => router.push("/profile")}
              >
                Profile
              </button>

              <button
                className="w-full px-3 py-2 text-left hover:bg-gray-50 flex justify-between"
                onClick={() => setLanguageOpen((v) => !v)}
              >
                Language <span>{language}</span>
              </button>

              {languageOpen && (
                <div className="px-2 pb-2">
                  {languages.map((lang) => (
                    <button
                      key={lang}
                      className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm"
                      onClick={() => {
                        setLanguage(lang);
                        localStorage.setItem("language", lang);
                        setLanguageOpen(false);
                      }}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              )}

              <button
                className="w-full px-3 py-2 text-left text-red-600 hover:bg-red-50"
                onClick={onLogout}
              >
                Logout
              </button>
            </div>
          </div>

        </div>
      </div>
    </nav>
  );
}