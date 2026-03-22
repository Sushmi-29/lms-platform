"use client";

import { useEffect, useState } from "react";

export default function HeroSlider() {
  const slides = [
    {
      title: "Build Your Future with Tech",
      subtitle: "Master in-demand skills with EduNova 🚀",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
    },
    {
      title: "Learn Anytime, Anywhere",
      subtitle: "Access courses on any device",
      image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8",
    },
    {
      title: "Become Industry Ready",
      subtitle: "Work on real-world projects",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
    },
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const active = slides[current];

  return (
    <section className="w-full px-1 md:px-2 mb-10">
      <div className="relative h-[360px] md:h-[420px] lg:h-[460px] rounded-none overflow-hidden shadow-xl">

        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center scale-105 transition-all duration-700"
          style={{ backgroundImage: `url(${active.image})` }}
        />

        {/* Premium Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

        {/* Content */}
        <div className="relative h-full flex items-center px-6 md:px-12">
          <div className="max-w-xl text-white">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              {active.title}
            </h1>

            <p className="mt-4 text-lg text-gray-200">
              {active.subtitle}
            </p>

            <a
              href="#available-courses"
              className="inline-block mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:scale-105 transition px-6 py-3 rounded-xl font-semibold shadow-lg"
            >
              Explore Courses
            </a>
          </div>
        </div>

        {/* Dots */}
        <div className="absolute bottom-5 left-8 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-3 h-3 rounded-full ${
                i === current ? "bg-white" : "bg-gray-400/60"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}