"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import apiClient from "@/lib/apiClient";
import { useAuthStore } from "@/store/authStore";

function getYouTubeId(url: string): string {
  if (!url) return "";
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname.includes("youtube.com")) {
      return urlObj.searchParams.get("v") || "";
    }
    if (urlObj.hostname.includes("youtu.be")) {
      return urlObj.pathname.replace("/", "");
    }
    return "";
  } catch {
    return "";
  }
}

function getEmbedUrl(videoId: string, startSeconds: number) {
  if (!videoId) return "";
  const s = Number.isFinite(startSeconds) && startSeconds > 0 ? Math.floor(startSeconds) : 0;
  return s > 0
    ? `https://www.youtube.com/embed/${videoId}?start=${s}`
    : `https://www.youtube.com/embed/${videoId}`;
}

type ContentItem = { title: string; time: number };

function buildContentItems(subject: any): ContentItem[] {
  const sections = subject?.sections;
  if (Array.isArray(sections) && sections.length > 0) {
    let cursorSeconds = 0;
    const items: ContentItem[] = [];
    for (const section of sections) {
      const videos = Array.isArray(section?.videos) ? section.videos : [];
      for (const v of videos) {
        items.push({
          title: String(v?.title ?? "Lesson"),
          time: cursorSeconds,
        });
        const dur = Number(v?.duration_seconds ?? 0);
        cursorSeconds += Number.isFinite(dur) ? dur : 0;
      }
    }
    if (items.length > 0) return items;
  }

  const content = subject?.contents || subject?.content || subject?.modules;
  if (Array.isArray(content) && content.length > 0) {
    return content.map((c: any, idx: number) => ({
      title: String(c?.title ?? `Lesson ${idx + 1}`),
      time: Number(c?.time ?? 0) || 0,
    }));
  }
  return [];
}

function ensureContentLength(items: ContentItem[], subjectTitle: string) {
  if (items.length >= 6) return items;
  const base = items.length > 0 ? items.slice() : [];
  let cursor = base.length > 0 ? base[base.length - 1].time : 0;
  while (base.length < 7) {
    cursor += 300;
    base.push({
      title: `${subjectTitle || "Course"} - Lesson ${base.length + 1}`,
      time: cursor,
    });
  }
  return base;
}

function SubjectContent() {
  const router = useRouter();
  const { token } = useAuthStore();

  const params = useParams();
  const searchParams = useSearchParams();

  const subjectId = params?.subjectId?.toString();
  const startParam = searchParams.get("start");

  const [subject, setSubject] = useState<any>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [subscriptionChecked, setSubscriptionChecked] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    if (!token) {
      router.replace("/auth/login");
    }
  }, [token, isMounted, router]);

  useEffect(() => {
    if (!isMounted || !token || !subjectId) return;
    try {
      const raw = localStorage.getItem("subscribed_courses");
      const list = raw ? (JSON.parse(raw) as Array<string | number>) : [];
      const subscribed =
        Array.isArray(list) && list.map(String).includes(String(subjectId));
      setIsSubscribed(Boolean(subscribed));
    } catch {
      setIsSubscribed(false);
    } finally {
      setSubscriptionChecked(true);
    }
  }, [isMounted, token, subjectId, router]);

  // Hard guard: no direct video access without subscription
  useEffect(() => {
    if (!isMounted || !token || !subjectId) return;
    if (!subscriptionChecked) return;
    if (!isSubscribed) {
      router.replace(`/subjects/${subjectId}/subscribe`);
    }
  }, [isMounted, token, subjectId, subscriptionChecked, isSubscribed, router]);

  // Resume learning
  useEffect(() => {
    if (!isMounted || !subjectId) return;
    const fromUrl = startParam ? Number(startParam) : NaN;
    if (Number.isFinite(fromUrl) && fromUrl > 0) {
      setCurrentTime(Math.floor(fromUrl));
      return;
    }
    const saved = localStorage.getItem(`progress_${subjectId}`);
    if (saved) {
      const n = Number(saved);
      if (Number.isFinite(n) && n >= 0) setCurrentTime(Math.floor(n));
    }
  }, [isMounted, subjectId, startParam]);

  useEffect(() => {
    if (!isMounted || !subjectId) return;
    localStorage.setItem(`progress_${subjectId}`, String(Math.floor(currentTime)));
  }, [isMounted, subjectId, currentTime]);

  useEffect(() => {
    if (!isMounted) return;
    const el = document.getElementById(`lesson-${activeIndex}`);
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, isMounted]);

  useEffect(() => {
    if (!isMounted || !token || !subjectId) return;

    const fetchSubject = async () => {
      try {
        const res = await apiClient.get(`/subjects/${subjectId}`);
        setSubject(res.data?.data || null);
      } catch (error) {
        console.error(error);
      }
    };

    fetchSubject();
  }, [subjectId, token, isMounted]);

  if (!isMounted) return null;

  if (!subject) {
    return <div className="p-8 text-gray-500">Loading course...</div>;
  }

  const contentItems = ensureContentLength(
    buildContentItems(subject),
    String(subject?.title || "Course")
  );
  const videoId = getYouTubeId(subject.youtube_url);
  const embedUrl = getEmbedUrl(videoId, currentTime);

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Left sidebar - course content */}
      <aside className="w-80 border-r border-gray-200 bg-white overflow-y-auto">
        <div className="p-4">
          <h2 className="font-bold text-gray-900 mb-3">Course content</h2>
          <ul className="space-y-2">
            {contentItems.map((item, idx) => (
              <li
                key={idx}
                id={`lesson-${idx}`}
                onClick={() => {
                  setActiveIndex(idx);
                  setCurrentTime(item.time);
                }}
                className={`flex items-start justify-between gap-3 rounded-md px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                  idx === activeIndex ? "bg-blue-100" : ""
                }`}
              >
                <span className="text-sm text-gray-800">{item.title}</span>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Right content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2 text-gray-900">
            {subject.title}
          </h1>

          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
            <span className="font-medium text-gray-800">
              Instructor: {subject.instructor}
            </span>

            <span className="text-amber-600 font-medium">
              ⭐ {subject.rating}
            </span>

            <span className="text-green-700 font-bold">
              ₹ {subject.price}
            </span>
          </div>

          <p
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
            className="text-gray-700 text-base leading-relaxed max-w-3xl"
          >
            {subject.description}
          </p>
        </div>

        {isSubscribed ? (
          <div className="mt-6 w-full max-w-2xl mx-auto">
            {currentTime > 0 && (
              <div className="mb-3 text-sm text-gray-700">
                Continue where you left off
              </div>
            )}
            <div className="rounded-xl overflow-hidden shadow-lg border border-gray-200 bg-black aspect-video">
              <iframe
                key={embedUrl}
                className="w-full h-full"
                src={embedUrl}
                allowFullScreen
              />
            </div>
          </div>
        ) : (
          <div className="mt-6 w-full max-w-2xl rounded-xl overflow-hidden shadow-lg border border-gray-200 bg-white mx-auto p-6">
            <p className="text-gray-800 font-semibold mb-3">
              Please subscribe to watch this course
            </p>
            <button
              onClick={() => router.push(`/subjects/${subjectId}/subscribe`)}
              className="bg-purple-600 text-white px-5 py-2 rounded-md font-medium hover:bg-purple-700 transition"
            >
              Take Subscription
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SubjectPage() {
  return (
    <Suspense fallback={<div className="p-8 text-gray-500">Loading course...</div>}>
      <SubjectContent />
    </Suspense>
  );
}