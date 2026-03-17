"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Force logout every time app loads
    localStorage.removeItem("token");

    // Redirect to login page
    router.replace("/auth/login");
  }, [router]);

  return null;
}