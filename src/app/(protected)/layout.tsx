"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ClientAppLayout from "@/components/layouts/ClientAppLayout";
import SeedletLoader from "@/components/SeedletLoader";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/auth/login");
    } else {
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) return <SeedletLoader />;

  return <ClientAppLayout>{children}</ClientAppLayout>;
}
