"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ChatShell } from "@/components/layout/chat-shell";
import { useAuth } from "@/hooks/use-auth";

export default function Home() {
  const router = useRouter();
  const { loading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, loading, router]);

  if (loading || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-100">
        Loading...
      </div>
    );
  }

  return <ChatShell />;
}
