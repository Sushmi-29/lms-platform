"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

interface CourseCardProps {
  id: number;
  title: string;
  description?: string | null;
  thumbnail?: string | null;
  youtube_url?: string | null;
  rating?: number | null;
  price?: number | null;
  instructor?: string | null;
}

const FALLBACK_THUMBNAIL =
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=338&fit=crop";

export default function CourseCard({
  id,
  title,
  thumbnail,
  youtube_url,
  rating,
  price,
  instructor,
}: CourseCardProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { token } = useAuthStore();
  
  const numericRating = rating ?? null;
  const ratingValue = Number(numericRating);
  const displayPrice =
    price != null ? (price === 0 ? "Free" : `₹${price}`) : "—";
  const displayInstructor = instructor || "Instructor";
  const fullStars = numericRating != null ? Math.floor(numericRating) : 0;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleCardClick = async () => {
    if (!token) {
      // Redirect to login if not authenticated
      router.push("/auth/login");
      return;
    }

    setLoading(true);
    try {
      const subscribed = JSON.parse(
        localStorage.getItem("subscribed_courses") || "[]"
      ) as Array<string | number>;

      const isSubscribedNow =
        Array.isArray(subscribed) &&
        subscribed.map(String).includes(String(id));

      if (isSubscribedNow) {
        router.push(`/subjects/${id}`);
      } else {
        router.push(`/subjects/${id}/subscribe`);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isMounted) return null;

  return (
    <button
      onClick={handleCardClick}
      disabled={loading}
      className="block group w-full text-left bg-white rounded-md shadow-sm hover:shadow-md transition duration-300 h-full flex flex-col disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1 border border-gray-200"
    >
      <div className="relative bg-gray-100 overflow-hidden aspect-video rounded-t-md">
        <img
          src={thumbnail || FALLBACK_THUMBNAIL}
          alt={title}
          className="w-full h-full object-cover rounded-t-md"
        />
        {loading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        )}
      </div>

      <div className="p-3 flex-1 flex flex-col">
        <h2 className="text-sm font-semibold text-gray-900 line-clamp-2">
          {title}
        </h2>

        <p className="text-xs text-gray-500 mt-1">{displayInstructor}</p>

        <div className="flex items-center mt-2">
          <span className="text-yellow-500 text-sm leading-none">
            {[...Array(5)].map((_, i) => (
              <span key={i}>{i < fullStars ? "⭐" : "☆"}</span>
            ))}
          </span>
          <span className="ml-1 text-gray-600 text-xs">
            {!isNaN(ratingValue) ? ratingValue.toFixed(1) : "--"}
          </span>
        </div>

        <p className="mt-auto pt-2 text-sm font-semibold text-gray-900">
          {displayPrice}
        </p>
      </div>
    </button>
  );
}
