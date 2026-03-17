"use client";

import { useEffect, useMemo, useState } from "react";
import apiClient from "@/lib/apiClient";
import CourseCard from "@/components/common/CourseCard";
import { useSearchStore } from "@/store/searchStore";

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { query } = useSearchStore();

  useEffect(() => {
    let cancelled = false;

    const go = async () => {
      try {
        const res = await apiClient.get("/subjects");
        if (cancelled) return;
        setSubjects(res.data?.data ?? []);
      } catch (e) {
        if (cancelled) return;
        setSubjects([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    go();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredSubjects = useMemo(() => {
    if (!query.trim()) return subjects;
    const q = query.trim().toLowerCase();
    return subjects.filter(
      (s) =>
        s.title?.toLowerCase().includes(q) ||
        s.description?.toLowerCase().includes(q) ||
        s.instructor?.toLowerCase().includes(q)
    );
  }, [subjects, query]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Subjects</h1>

      {loading ? (
        <div className="text-gray-600">Loading subjects...</div>
      ) : filteredSubjects.length === 0 ? (
        <div className="text-gray-600">
          {query.trim()
            ? `No subjects match \"${query}\".`
            : "No subjects available yet."}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredSubjects.map((subject) => (
            <CourseCard
              key={subject.id}
              id={subject.id}
              title={subject.title}
              description={subject.description}
              thumbnail={subject.thumbnail}
              rating={subject.rating}
              price={subject.price}
              instructor={subject.instructor}
            />
          ))}
        </div>
      )}
    </div>
  );
}
