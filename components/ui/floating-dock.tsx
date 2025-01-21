/**
 * Note: Use position fixed according to your needs
 * Desktop navbar is better positioned at the bottom
 * Mobile navbar is better positioned at bottom right.
 **/

'use client';

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export const FloatingDock = ({
  items,
  mobileClassName,
}: {
  items: {
    title: string;
    icon: React.ReactNode;
    href: string;
  }[];
  mobileClassName?: string;
}) => {
  return (
    <div className={cn("fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300", mobileClassName)}>
      <div className="flex items-center gap-6 px-6 py-4 bg-[#151921]/90 backdrop-blur-lg rounded-full border border-white/10 shadow-lg">
        {items.map((item) => (
          <motion.a
            key={item.title}
            href={item.href}
            className="flex flex-col items-center group"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="w-6 h-6 text-gray-400 group-hover:text-[#00E599] transition-colors">
              {item.icon}
            </div>
            <span className="text-xs mt-1 text-gray-400 group-hover:text-[#00E599] transition-colors">
              {item.title}
            </span>
          </motion.a>
        ))}
      </div>
    </div>
  );
};
