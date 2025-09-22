"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function SeedletLoader() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex flex-col items-center justify-center gap-4 min-h-screen"
    >
      <motion.div
        className="w-16 h-16 relative"
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          ease: "linear",
        }}
      >
        <Image
          src="/seedlet.png"
          alt="Loading logo"
          fill
          sizes="40px"
          className="object-contain"
          priority
        />
      </motion.div>
      <p className="text-muted-foreground text-sm animate-pulse">
        Sprouting Seedlet...
      </p>
    </motion.div>
  );
}
