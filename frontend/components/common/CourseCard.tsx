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
      className="group w-full text-left rounded-xl overflow-hidden 
      bg-white 
      border border-gray-200
      shadow-sm hover:shadow-xl 
      transition-all duration-300 
      transform hover:-translate-y-1 
      disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {/* Image */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={thumbnail || FALLBACK_THUMBNAIL}
          alt={title}
          className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
        />

        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        )}

        {/* Gradient overlay (premium feel) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition" />
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-2">

        {/* Title */}
        <h2 className="text-sm md:text-base font-semibold text-gray-900 line-clamp-2">
          {title}
        </h2>

        {/* Instructor */}
        <p className="text-xs text-gray-500">
          {displayInstructor}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1 text-xs">
          <span className="text-yellow-500">
            {[...Array(5)].map((_, i) => (
              <span key={i}>{i < fullStars ? "⭐" : "☆"}</span>
            ))}
          </span>
          <span className="text-gray-500">
            {!isNaN(ratingValue) ? ratingValue.toFixed(1) : "--"}
          </span>
        </div>

        {/* Price */}
        <div className="mt-auto pt-2">
          <span className="text-base font-bold text-gray-900">
            {displayPrice}
          </span>
        </div>
      </div>
    </button>
  );
}