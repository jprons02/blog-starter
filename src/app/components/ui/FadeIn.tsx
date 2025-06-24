"use client";

import { motion } from "framer-motion";

export default function FadeIn({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut", delay: delay / 1000 }} // convert ms to seconds
      className={className}
    >
      {children}
    </motion.div>
  );
}
