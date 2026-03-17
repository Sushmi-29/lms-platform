"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import apiClient from "@/lib/apiClient";

/* --------- YOUTUBE EMBED URL --------- */

function getEmbedUrl(url: string, startParam: string | null) {
  if (!url) return "";

  let videoId = "";

  if (url.includes("youtube.com/watch")) {
    videoId = url.split("v=")[1]?.split("&")[0];
  } else if (url.includes("youtu.be")) {
    videoId = url.split("youtu.be/")[1]?.split("?")[0];
  }

  let embedUrl = `https://www.youtube.com/embed/${videoId}`;

  if (startParam) {
    const seconds = parseInt(startParam);
    if (!isNaN(seconds)) {
      embedUrl += `?start=${seconds}`;
    }
  }

  return embedUrl;
}

/* --------- SUBJECT CONTENT --------- */

function SubjectContent() {
  const params = useParams();
  const searchParams = useSearchParams();

  const subjectId = params.subjectId;
  const startParam = searchParams.get("start");

  const [subject, setSubject] = useState<any>(null);

  useEffect(() => {
    const fetchSubject = async () => {
      try {
        const res = await apiClient.get(`/subjects/${subjectId}`);
        setSubject(res.data?.data || null);
      } catch (error) {
        console.error(error);
      }
    };

    if (subjectId) fetchSubject();
  }, [subjectId]);

  if (!subject)
    return <div className="p-8 text-gray-500">Loading course...</div>;

  const embedUrl = getEmbedUrl(subject.youtube_url, startParam);

  return (
    <div className="flex-1 p-8 max-w-5xl mx-auto">

      {/* COURSE HEADER */}

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

        {/* DESCRIPTION */}

        <p
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden"
          }}
          className="text-gray-600 leading-relaxed max-w-3xl"
        >
          {subject.description}
        </p>

      </div>

      {/* VIDEO PLAYER */}

      <div className="mt-6 w-full rounded-xl overflow-hidden shadow-lg border border-gray-200 bg-black aspect-video">

        <iframe
          key={embedUrl}
          className="w-full h-full"
          src={embedUrl}
          allowFullScreen
        />

      </div>

    </div>
  );
}

/* --------- PAGE WRAPPER --------- */

export default function SubjectPage() {
  return (
    <Suspense fallback={<div className="p-8 text-gray-500">Loading course...</div>}>
      <SubjectContent />
    </Suspense>
  );
}