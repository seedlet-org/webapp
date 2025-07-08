"use client";

import { useRouter } from "next/navigation";
import {
  BarChart3,
  ClipboardList,
  Flame,
  Heart,
  MessageCircle,
  MessageSquare,
  UserPlus,
  Sprout,
  Star,
  UploadCloud,
  FlaskConical,
  CheckCircle,
  Hourglass,
  Users,
  Activity,
  Tag,
  Clock,
} from "lucide-react";
import { useCurrentUser } from "@/features/user/hooks/useUser";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  const router = useRouter();
  const { data: user } = useCurrentUser();

  return (
    <div className="min-h-screen max-w-6xl mx-auto px-6 py-10 space-y-10 font-manrope">
      {/* Welcome Message */}
      <div className="space-y-1">
        {user?.data?.username ? (
          <h1 className="text-3xl md:text-4xl font-bold text-[#333]">
            Welcome, {user?.data?.username}! 👋
          </h1>
        ) : (
          <div className="h-8 md:h-10 w-48 bg-gray-200 rounded animate-pulse" />
        )}

        <div className="flex flex-col sm:flex-row gap-3 text-sm text-[#4F4F4F]">
          <span className="flex items-center gap-1">
            <Clock size={14} className="text-[#42B883]" />
            Last login: 2 hours ago
          </span>
          <span className="flex items-center gap-1">
            <Flame size={14} className="text-[#FF6B6B] fill-[#FF6B6B]" />
            Streak: 3 days
          </span>
        </div>
      </div>

      {/* CTA Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#C9F4E5] p-6 rounded-2xl shadow-inner flex flex-col justify-between space-y-4">
          <h2 className="text-[20px] font-semibold text-[#333]">
            ✨ Ready to build something new?
          </h2>
          <p className="text-sm text-[#4F4F4F]">
            Start a fresh Seedlet or continue your ongoing Lab.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              className="cursor-pointer"
              onClick={() => router.push("/seedlets/new")}
            >
              New Seedlet
            </Button>
            <Button
              variant="outline"
              className="text-black cursor-pointer"
              onClick={() => router.push("/labs")}
            >
              View Labs
            </Button>
          </div>
        </div>

        <div className="p-6 border border-dashed border-[#C9F4E5] bg-[#F9FFFD] rounded-2xl text-left shadow-sm space-y-4">
          <h2 className="text-lg font-semibold text-[#333]">
            Explore What Others Are Building
          </h2>
          <p className="text-sm text-[#4F4F4F]">
            Seedlets are sprouting across the community. Get inspired, leave
            feedback, or join one!
          </p>
          <Button
            variant="outline"
            className="border-[#42B883] text-[#42B883] hover:bg-[#C9F4E5] cursor-pointer"
            onClick={() => router.push("/seedlets")}
          >
            Explore Seedlets
          </Button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-6">
          {/* Your Stats */}
          <Card className="bg-white shadow-sm border border-[#E0F7EF]">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <BarChart3 size={18} className="text-[#42B883]" />
                Your Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 md:space-y-4">
                {[
                  {
                    icon: <Sprout size={16} />,
                    label: "Seedlets Posted",
                    value: 0,
                  },
                  {
                    icon: <MessageCircle size={16} />,
                    label: "Comments Made",
                    value: 0,
                  },
                  {
                    icon: <Heart size={16} />,
                    label: "Likes Received",
                    value: 0,
                  },
                  {
                    icon: <UserPlus size={16} />,
                    label: "Interested Users",
                    value: 0,
                  },
                  {
                    icon: <ClipboardList size={16} />,
                    label: "Labs Joined",
                    value: 0,
                  },
                ].map((stat, i) => (
                  <li key={i} className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm text-[#4F4F4F]">
                      <span className="text-[#42B883]">{stat.icon}</span>
                      {stat.label}
                    </span>
                    <span className="text-base font-bold bg-[#C9F4E5] py-1 px-3 rounded-full">
                      {stat.value}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Labs Summary */}
          <Card className="bg-white shadow-sm border border-[#E0F7EF]">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <FlaskConical size={18} className="text-[#42B883]" />
                Labs Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-[#4F4F4F] space-y-4">
                <li className="flex items-center gap-2">
                  <FlaskConical size={16} className="text-[#42B883]" />
                  Active Labs: <strong>0</strong>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-500" />
                  Completed Labs: <strong>0</strong>
                </li>
                <li className="flex items-center gap-2">
                  <Hourglass size={16} className="text-yellow-500" />
                  Pending Approvals: <strong>0</strong>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-6">
          {/* Recent Activity */}
          <Card className="bg-white shadow-sm border border-[#E0F7EF]">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Activity size={18} className="text-[#42B883]" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4 text-sm text-[#4F4F4F]">
                <li className="flex items-start gap-3">
                  <UploadCloud className="text-[#42B883] mt-1" size={18} />
                  <div className="text-sm leading-snug">
                    You posted{" "}
                    <strong className="text-[#333]">GreenCart</strong> 2 days
                    ago
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <MessageCircle className="text-[#42B883] mt-1" size={18} />
                  <div className="text-sm leading-snug">
                    You commented on{" "}
                    <strong className="text-[#333]">MindBloom</strong>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Star className="text-[#42B883] mt-1" size={18} />
                  <div className="text-sm leading-snug">
                    3 people are now interested in{" "}
                    <strong className="text-[#333]">AI Study Buddy</strong>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Top Performing Seedlets */}
          <Card className="bg-white shadow-sm border border-[#E0F7EF] rounded-xl">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Flame size={18} className="text-[#FF6B6B]" />
                Top Performing Seedlets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    title: "GreenCart",
                    likes: 56,
                    comments: 12,
                    interested: 9,
                    progress: "80%",
                  },
                  {
                    title: "AI Study Buddy",
                    likes: 46,
                    comments: 9,
                    interested: 13,
                    progress: "70%",
                  },
                ].map((seedlet, idx) => (
                  <div
                    key={idx}
                    className="space-y-2 p-3 bg-[#F9FFFD] rounded-lg border border-[#C9F4E5]"
                  >
                    <div className="flex justify-between items-center text-sm font-medium">
                      <span className="font-semibold text-[#42B883]">
                        {seedlet.title}
                      </span>
                      <div className="flex items-center gap-3 text-[#4F4F4F] text-xs sm:text-sm">
                        <span className="flex items-center gap-1">
                          <Heart
                            size={14}
                            className="text-[#FF6B6B] fill-[#FF6B6B]"
                          />
                          {seedlet.likes}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle size={14} className="text-[#42B883]" />
                          {seedlet.comments}
                        </span>
                        <span className="flex items-center gap-1">
                          <UserPlus size={14} className="text-[#6C5DD3]" />
                          {seedlet.interested}
                        </span>
                      </div>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-full bg-[#42B883] rounded-full transition-all"
                        style={{ width: seedlet.progress }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Community Insights */}
          <Card className="bg-white shadow-sm border border-[#E0F7EF]">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Users size={18} className="text-[#42B883]" />
                Community Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-[#4F4F4F] space-y-3">
                <li className="flex items-center gap-2">
                  <Users size={16} className="text-[#42B883]" />
                  12 new users joined this week
                </li>
                <li className="flex items-center gap-2">
                  <Tag size={16} className="text-[#FF6B6B]" />
                  Trending tag: <strong>#greenTech</strong>
                </li>
                <li className="flex items-center gap-2">
                  <MessageSquare size={16} className="text-[#6C5DD3]" />
                  Top commenter: <strong>@jane_dev</strong>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
