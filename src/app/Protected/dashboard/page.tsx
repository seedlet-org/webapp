"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Rocket, ClipboardList, Bell } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-white text-[#333] px-6 py-8 font-manrope">
      <h1 className="text-[36px] font-bold mb-6">Welcome back 👋</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        {/* Seedlets */}
        <Card className="rounded-2xl shadow-md hover:shadow-lg transition">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-[20px] font-semibold text-[#42B883]">
              Your Seedlets
            </CardTitle>
            <Rocket className="text-[#42B883]" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[#4F4F4F]">You’ve posted 2 ideas this week. Keep growing 🌱</p>
            <Button className="cursor-pointer mt-4 w-full" onClick={() => router.push("/seedlets/new")}>
              <PlusCircle className="mr-2 h-4 w-4" /> Post a New Idea
            </Button>
          </CardContent>
        </Card>

        {/* Labs */}
        <Card className="rounded-2xl shadow-md hover:shadow-lg transition">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-[20px] font-semibold text-[#42B883]">
              Your Labs
            </CardTitle>
            <ClipboardList className="text-[#42B883]" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[#4F4F4F]">You&apos;re collaborating on 3 Labs. Stay active and sync with your team.</p>
            <Button variant="outline" className="cursor-pointer mt-4 w-full" onClick={() => router.push("/labs")}>
              View All Labs
            </Button>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="rounded-2xl shadow-md hover:shadow-lg transition">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-[20px] font-semibold text-[#42B883]">
              Notifications
            </CardTitle>
            <Bell className="text-[#42B883]" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[#4F4F4F]">You have 2 new comments and 1 lab invite.</p>
            <Button variant="outline" className=" cursor-pointer mt-4 w-full" onClick={() => router.push("/notifications")}>
              Check Now
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* CTA section */}
      <div className="bg-[#C9F4E5] p-6 rounded-2xl shadow-inner flex flex-col md:flex-row items-center justify-between">
        <div className="mb-4 md:mb-0">
          <h2 className="text-[28px] font-semibold text-[#333]">Ready to build something new?</h2>
          <p className="text-sm text-[#4F4F4F]">Start a fresh Seedlet or continue your ongoing Lab.</p>
        </div>
        <div className="flex gap-4">
          <Button className="cursor-pointer" onClick={() => router.push("/seedlets/new")}>New Seedlet</Button>
          <Button className="cursor-pointer" variant="outline" onClick={() => router.push("/labs")}>View Labs</Button>
        </div>
      </div>
    </div>
  );
}
