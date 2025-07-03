"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Menu,
  X,
  ClipboardList,
  CheckCircle,
  Lightbulb,
  Bell,
  User,
  LayoutDashboard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useCurrentUser } from "@/features/user/hooks/useUser";

const navItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard size={18} />,
  },
  { name: "Seedlets", href: "/seedlets", icon: <Lightbulb size={18} /> },
  { name: "Labs", href: "/labs", icon: <ClipboardList size={18} /> },
  { name: "Field", href: "/field", icon: <CheckCircle size={18} /> },
];

export default function ClientAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data } = useCurrentUser();
  const user = data?.data;
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col font-manrope text-secondary">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-primary font-semibold text-lg"
          >
            <Image
              src="/seedlet.png"
              alt="Seedlet Logo"
              width={30}
              height={30}
              className="object-contain"
            />
            <span>Seedlet</span>
          </Link>

          <nav className="hidden md:flex gap-6 items-center text-sm relative">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-1 font-medium relative transition-all duration-300 ease-in-out",
                  pathname.startsWith(item.href)
                    ? "text-primary"
                    : "text-gray-700 hover:text-primary"
                )}
              >
                {item.icon}
                {item.name}
                {pathname.startsWith(item.href) && (
                  <motion.div
                    layoutId="underline"
                    className="absolute -bottom-1 left-0 w-full h-[2px] bg-primary rounded"
                  />
                )}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4 text-black">
            <Link
              href="/notifications"
              className={cn(
                "hidden md:flex items-center transition-all duration-300 ease-in-out relative",
                pathname === "/notifications"
                  ? "text-primary"
                  : "text-gray-700 hover:text-primary"
              )}
            >
              <Bell size={20} />
              {pathname === "/notifications" && (
                <motion.div
                  layoutId="underline"
                  className="absolute -bottom-1 left-0 w-full h-[2px] bg-primary rounded"
                />
              )}
            </Link>
            <Link
              href={`/profile/${user?.username ?? "me"}`}
              className={cn(
                "hidden md:flex items-center gap-1 text-sm font-medium transition-all duration-300 ease-in-out relative",
                pathname.startsWith(`/profile`)
                  ? "text-primary"
                  : "text-gray-700 hover:text-primary"
              )}
            >
              <User size={20} />
              Profile
              {pathname.startsWith(`/profile`) && (
                <motion.div
                  layoutId="underline"
                  className="absolute -bottom-1 left-0 w-full h-[2px] bg-primary rounded"
                />
              )}
            </Link>

            <button
              className="md:hidden text-black cursor-pointer"
              onClick={() => setMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            >
              <motion.div
                className="fixed right-0 top-0 h-full w-64 bg-white p-5 shadow-lg flex flex-col gap-6"
                initial={{ x: 300 }}
                animate={{ x: 0 }}
                exit={{ x: 300 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-lg">Menu</span>
                  <button
                    className="text-black cursor-pointer"
                    onClick={() => setMenuOpen(false)}
                  >
                    <X size={24} />
                  </button>
                </div>

                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-2 py-2 px-2 rounded-md transition-all duration-300 ease-in-out",
                      pathname.startsWith(item.href)
                        ? "bg-primary/10 text-primary"
                        : "text-gray-800 hover:text-primary"
                    )}
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                ))}

                <Link
                  href="/notifications"
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-2 py-2 px-2 transition-all duration-300 ease-in-out",
                    pathname === "/notifications"
                      ? "bg-primary/10 text-primary"
                      : "text-gray-800 hover:text-primary"
                  )}
                >
                  <Bell size={18} />
                  Notifications
                </Link>

                <Link
                  href={`/profile/${user?.username ?? "me"}`}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 py-2 px-2 text-gray-800 hover:text-primary transition-all duration-300 ease-in-out"
                >
                  <User size={18} />
                  Profile
                </Link>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-grow">{children}</main>

      <footer className="mt-10 border-t border-gray-200 text-sm text-muted-foreground py-6 px-4 text-center">
        &copy;{new Date().getFullYear()} Seedlet 🌱
      </footer>
    </div>
  );
}
