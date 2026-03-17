"use client";

import { useEffect, useState } from "react";

export default function HeroSlider() {
  const slides = [
    {
      title: "Master In-Demand Skills",
      subtitle: "Learn JavaScript, React, Node & more",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
    },
    {
      title: "Learn Anytime, Anywhere",
      subtitle: "Access courses on any device",
      image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8",
    },
    {
      title: "Build Real Projects",
      subtitle: "Get hands-on experience",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
    },
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const active = slides[current];

  return (
    <section className="w-full mb-10">
      <div className="relative h-[320px] md:h-[380px] lg:h-[420px] rounded-md overflow-hidden shadow-sm border border-gray-200 bg-white">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-in-out scale-105"
          style={{ backgroundImage: `url(${active.image})` }}
        />

        {/* Clean overlay (subtle, not harsh) */}
        <div className="absolute inset-0 bg-black/20" />

        {/* Content */}
        <div className="relative h-full flex items-center">
          <div className="px-6 md:px-12 max-w-xl">
            <h1 className="text-3xl md:text-4xl font-semibold text-white leading-tight">
              {active.title}
            </h1>
            <p className="text-sm md:text-base text-gray-100 mt-4">
              {active.subtitle}
            </p>

            <a
              href="#available-courses"
              className="inline-block mt-6 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 md:px-6 md:py-3 rounded-md font-semibold transition duration-300 shadow-sm"
            >
              Explore Courses
            </a>
          </div>
        </div>

        {/* Dot indicators */}
        <div className="absolute bottom-5 left-6 md:left-10 flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`w-3 h-3 rounded-full transition ${
                i === current ? "bg-white" : "bg-gray-200/70"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}