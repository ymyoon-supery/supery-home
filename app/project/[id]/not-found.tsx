"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProjectNotFound() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/project");
  }, [router]);
  return null;
}
