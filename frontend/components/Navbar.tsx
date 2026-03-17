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

  void courses;

  const onLogout = () => {
    localStorage.removeItem("subscribed_courses");
    logout();
    router.push("/auth/login");
  };

  const initials = (user?.name?.charAt(0) || "U").toUpperCase();
  const languages = ["English", "Hindi", "Kannada"] as const;
  const selectLanguage = (selected: (typeof languages)[number]) => {
    setLanguage(selected);
    localStorage.setItem("language", selected);
    setLanguageOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 md:px-10 py-3">
        <button
          className="text-xl font-extrabold text-gray-900 tracking-tight"
          onClick={() => router.push("/landing")}
        >
          SkillForge
        </button>

        <div className="flex-1 max-w-xl mx-6">
          <input
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search courses..."
            className="w-full border border-gray-300 rounded-full px-4 py-2 bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900 placeholder:text-gray-500"
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
            <span aria-hidden>🌐</span>
            <span>{language}</span>
          </div>

          <div className="relative" ref={ref}>
          <div
            className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center cursor-pointer select-none shadow-sm"
            onClick={() => {
              setOpen((v) => !v);
              if (open) setLanguageOpen(false);
            }}
          >
            {initials}
          </div>

          <div
            className={`absolute right-0 mt-2 bg-white shadow-lg rounded-md w-56 divide-y border border-gray-200 overflow-hidden origin-top-right transform transition-all duration-150 ease-out ${
              open
                ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                : "opacity-0 scale-95 -translate-y-1 pointer-events-none"
            }`}
          >
              <div className="p-3">
                <div className="text-sm font-semibold text-gray-900">
                  {user?.name || "User"}
                </div>
                <div className="text-xs text-gray-600 truncate">
                  {user?.email || "user@example.com"}
                </div>
              </div>

              <div className="py-1">
                <button
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                  onClick={() => {
                    setOpen(false);
                    setLanguageOpen(false);
                    router.push("/landing#my-courses");
                  }}
                >
                  My Courses
                </button>
                <button
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                  onClick={() => {
                    setOpen(false);
                    setLanguageOpen(false);
                    router.push("/profile");
                  }}
                >
                  Edit Profile
                </button>
                <button
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center justify-between"
                  onClick={() => setLanguageOpen((v) => !v)}
                >
                  <span>Language</span>
                  <span className="text-xs text-gray-500">{language}</span>
                </button>

                {languageOpen && (
                  <div className="px-2 pb-2">
                    <div className="rounded-md border border-gray-200 overflow-hidden">
                      {languages.map((lang) => (
                        <button
                          key={lang}
                          className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center justify-between ${
                            lang === language ? "bg-gray-50" : ""
                          }`}
                          onClick={() => selectLanguage(lang)}
                        >
                          <span>{lang}</span>
                          {lang === language && (
                            <span className="text-xs text-blue-600">Selected</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="py-1">
                <button
                  className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                  onClick={onLogout}
                >
                  Logout
                </button>
              </div>
          </div>
        </div>
        </div>
      </div>
    </nav>
  );
}

