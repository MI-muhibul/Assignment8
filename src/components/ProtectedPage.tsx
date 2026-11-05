"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/components/AppProviders";

export function ProtectedPage({ children }: { children: React.ReactNode }) {
  const { user, loading } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  if (loading) return <div className="page-wrap"><div className="skeleton skeleton-title" /><div className="skeleton skeleton-panel" /></div>;
  if (!user) return <div className="page-wrap"><p>Taking you to sign in… <Link href="/login">Continue</Link></p></div>;
  return <>{children}</>;
}
