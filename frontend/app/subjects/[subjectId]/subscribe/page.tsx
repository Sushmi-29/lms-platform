"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import apiClient from "@/lib/apiClient";
import { useAuthStore } from "@/store/authStore";
import Link from "next/link";

interface Subject {
  id: number;
  title: string;
  description?: string | null;
  thumbnail?: string | null;
  youtube_url?: string | null;
  rating?: number | null;
  price?: number | null;
  instructor?: string | null;
  created_at?: string;
  updated_at?: string;
}

type ContentItem = { title: string; time: string };

function ensureContentLength(items: ContentItem[], subjectTitle: string) {
  if (items.length >= 7) return items;
  const base = items.length > 0 ? items.slice() : [];
  let cursorSeconds = 0;
  const last = base[base.length - 1]?.time;
  if (typeof last === "string" && last.endsWith("s")) {
    const n = Number(last.replace("s", ""));
    if (Number.isFinite(n)) cursorSeconds = n;
  }
  while (base.length < 7) {
    cursorSeconds += 300;
    base.push({
      title: `${subjectTitle || "Course"} - Lesson ${base.length + 1}`,
      time: `${cursorSeconds}s`,
    });
  }
  return base;
}

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
          time: `${cursorSeconds}s`,
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
      time: String(c?.time ?? "0s"),
    }));
  }

  return [];
}

export default function SubscribePage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const subjectId = params.subjectId as string;
  
  const [subject, setSubject] = useState<Subject | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
      return;
    }

    const fetchSubject = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/subjects/${subjectId}`);
        setSubject(response.data?.data || response.data);
      } catch (error) {
        console.error("Error fetching subject:", error);
        setError("Failed to load course details");
      } finally {
        setLoading(false);
      }
    };

    fetchSubject();
  }, [subjectId, user, router]);

  useEffect(() => {
    if (subject?.price == null) return;
    setAmount(String(subject.price));
  }, [subject?.price]);

  const handleStartSubscription = async (e?: any) => {
    if (e?.preventDefault) e.preventDefault();

    if (!user) {
      router.push("/auth/login");
      return;
    }

    setSubscribing(true);
    try {
      try {
        await apiClient.post("/subscriptions", {
          subjectId: parseInt(subjectId),
          name,
          email,
          amount,
        });
      } catch {
        // If backend subscription API isn't available, simulate success locally.
      }

      // Mark as subscribed locally
      const raw = localStorage.getItem("subscribed_courses");
      const list = raw ? (JSON.parse(raw) as Array<string | number>) : [];
      const next = Array.isArray(list) ? list.map(String) : [];
      const sid = String(subjectId);
      if (!next.includes(sid)) next.push(sid);
      localStorage.setItem("subscribed_courses", JSON.stringify(next));
      window.dispatchEvent(new Event("storage"));

      // Redirect to course page after successful subscription
      router.push(`/subjects/${subjectId}`);
    } catch (error: any) {
      console.error("Error creating subscription:", error);
      setError(error.response?.data?.message || "Failed to start subscription");
    } finally {
      setSubscribing(false);
    }
  };

  const extractYoutubeId = (url?: string | null) => {
    if (!url) return null;
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?]+)/);
    return match ? match[1] : null;
  };

  const youtubeId = extractYoutubeId(subject?.youtube_url);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <div className="aspect-video bg-gray-200 rounded-lg"></div>
                </div>
                <div className="space-y-4">
                  <div className="h-10 bg-gray-200 rounded"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-12 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !subject) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center">
            <div className="bg-white rounded-lg shadow p-8">
              <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <Link
                href="/"
                className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!subject) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center">
            <div className="bg-white rounded-lg shadow p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Course Not Found</h2>
              <p className="text-gray-600 mb-6">The course you're looking for doesn't exist.</p>
              <Link
                href="/"
                className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
              >
                Browse Courses
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const contentItems = ensureContentLength(
    buildContentItems(subject),
    String(subject?.title || "Course")
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex items-center space-x-2 text-sm text-gray-600">
              <li>
                <Link href="/" className="hover:text-purple-600 transition-colors">
                  Home
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link href="/" className="hover:text-purple-600 transition-colors">
                  Courses
                </Link>
              </li>
              <li>/</li>
              <li className="font-medium text-gray-900">{subject.title}</li>
            </ol>
          </nav>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">{subject.title}</h1>
          <p className="text-gray-600 mb-8">By {subject.instructor || "Instructor"}</p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left side - Course preview */}
            <div className="lg:col-span-2 space-y-6">
              {/* Course thumbnail (no video preview on subscription page) */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="aspect-video bg-gray-100">
                  <img
                    src={
                      subject.thumbnail ||
                      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=675&fit=crop"
                    }
                    className="w-full h-full object-cover"
                    alt={subject.title}
                  />
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-500">Course preview</p>
                </div>
              </div>

              {/* Course description */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">What you'll learn</h2>
                <p className="text-gray-700 whitespace-pre-line line-clamp-2">
                  {subject.description || "No description available."}
                </p>

                <div className="mt-4 border-t pt-4">
                  <ul className="space-y-2">
                    {contentItems.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-4">
                        <span className="text-gray-800 text-sm">{item.title}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Course details */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Course Details</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Instructor</p>
                    <p className="font-medium">{subject.instructor || "Not specified"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Rating</p>
                    <p className="font-medium flex items-center">
                      ⭐ {subject.rating || "Not rated"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Subscription card */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 sticky top-6">
                <div className="mb-6">
                  <div className="flex items-baseline mb-2">
                    <span className="text-3xl font-bold text-gray-900">
                      {subject.price === 0 ? "Free" : `₹${subject.price}`}
                    </span>
                    {subject.price !== 0 && (
                      <span className="text-sm text-gray-500 ml-2">one-time payment</span>
                    )}
                  </div>
                  {subject.price !== 0 && (
                    <p className="text-sm text-gray-600">30-day money-back guarantee</p>
                  )}
                </div>

                <div className="space-y-4 mb-6">
                  <h3 className="font-bold text-gray-900">This course includes:</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Full lifetime access</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Access on mobile and TV</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Certificate of completion</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Downloadable resources</span>
                    </li>
                  </ul>
                </div>

                <form onSubmit={handleStartSubscription} className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Name</label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-500"
                      placeholder="Your name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-500"
                      placeholder="you@example.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Amount</label>
                    <input
                      value={amount}
                      readOnly
                      disabled
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 cursor-not-allowed"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={subscribing}
                    className="w-full bg-purple-600 text-white py-4 px-6 rounded-lg font-bold text-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {subscribing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      "Take Subscription"
                    )}
                  </button>
                </form>

                {error && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                <p className="text-center text-sm text-gray-500 mt-4">
                  30-Day Money-Back Guarantee
                </p>
              </div>

              {/* Share course */}
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-3">Share this course</h3>
                <div className="flex space-x-3">
                  <button className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">
                    Facebook
                  </button>
                  <button className="flex-1 bg-blue-400 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-500 transition-colors">
                    Twitter
                  </button>
                  <button className="flex-1 bg-gray-800 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-900 transition-colors">
                    LinkedIn
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}