"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import apiClient from "@/lib/apiClient";
import CourseCard from "@/components/common/CourseCard";
import HeroSlider from "@/components/HeroSlider";
import Navbar from "@/components/Navbar";
import { useAuthStore } from "@/store/authStore";

interface Subject {
  id: number;
  title: string;
  description?: string | null;
  thumbnail?: string | null;
  rating?: number | null;
  price?: number | null;
  instructor?: string | null;
}

export default function LandingPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();
  const [subscribedCourses, setSubscribedCourses] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/auth/login");
    }
  }, [isMounted, router]);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await apiClient.get("/subjects");
        setSubjects(res.data?.data ?? []);
      } catch (error) {
        console.error("Error fetching subjects:", error);
        setSubjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const updateCourses = () => {
      const stored = JSON.parse(
        localStorage.getItem("subscribed_courses") || "[]"
      ) as Array<string | number>;
      setSubscribedCourses(Array.isArray(stored) ? stored.map(String) : []);
    };

    updateCourses();

    window.addEventListener("storage", updateCourses);
    return () => {
      window.removeEventListener("storage", updateCourses);
    };
  }, [isMounted]);

  const myCourses = useMemo(() => {
    return subjects.filter((course) =>
      subscribedCourses.includes(course.id.toString())
    );
  }, [subjects, subscribedCourses]);

  const availableCourses = useMemo(() => {
    return subjects.filter(
      (course) => !subscribedCourses.includes(course.id.toString())
    );
  }, [subjects, subscribedCourses]);

  const filteredMyCourses = useMemo(() => {
    return myCourses;
  }, [myCourses]);

  const filteredCourses = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return q === ""
      ? availableCourses
      : availableCourses.filter((course) =>
          course.title.toLowerCase().includes(q)
        );
  }, [availableCourses, searchQuery]);

  if (!isMounted) return null;

  return (
    <div className="space-y-10 py-6 bg-white text-gray-900">

      {/* Navbar */}
      <Navbar courses={availableCourses} setSearchQuery={setSearchQuery} />

      {/* 🔥 NEW PREMIUM WELCOME SECTION */}
      <section className="w-full px-6 md:px-10 py-4">

<div className="flex flex-col gap-1">

  <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
    Welcome to{" "}
    <span className="text-indigo-600 font-bold">
      EduNova
    </span>
  </h1>

  <p className="text-gray-500 text-sm md:text-base">
    Build your future with industry-ready skills 🚀
  </p>

</div>

</section>

      {/* Hero */}
      <HeroSlider />

      {/* Courses */}
      <section>
        <h2 id="my-courses" className="text-lg md:text-xl font-semibold mb-4 text-gray-900 pl-2 md:pl-4">
          My Courses
        </h2>

        {loading ? (
          <div className="text-gray-600 mb-10">Loading...</div>
        ) : filteredMyCourses.length === 0 ? (
          <div className="text-gray-600 mb-10">
            You haven&apos;t subscribed to any courses yet.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-10">
            {filteredMyCourses.map((subject) => (
              <CourseCard key={subject.id} {...subject} />
            ))}
          </div>
        )}

        <h2 id="available-courses" className="text-xl md:text-2xl font-semibold text-gray-900 mb-4 pl-2 md:pl-4">
          Available Courses
        </h2>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white border rounded-md animate-pulse"
              >
                <div className="aspect-video bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-16 border rounded-md shadow-sm">
            <p className="text-gray-600 text-lg">No courses found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredCourses.map((subject) => (
              <CourseCard key={subject.id} {...subject} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}