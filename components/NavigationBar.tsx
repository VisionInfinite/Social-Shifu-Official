'use client'
import React, { useEffect, useState } from "react";
import { FloatingDock } from "@/components/ui/floating-dock";
import {
  IconBrandGithub,
  IconBrandX,
  IconExchange,
  IconHome,
  IconNewSection,
  IconTerminal2,
  IconMenu2,
  IconPencil,
  IconMicrophone,
  IconFiles,
  // IconLogin,
} from "@tabler/icons-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export function NavigationBar() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const screenHeight = window.innerHeight;

      if (currentScrollY > lastScrollY && currentScrollY > screenHeight * 0.7) {
        setIsVisible(false);
        setIsMobileMenuOpen(false);
      } else if (currentScrollY < lastScrollY || currentScrollY < screenHeight * 0.3) {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const navigationItems = [
    {
      title: "Home",
      icon: (
        <IconHome className="h-full w-full text-gray-400 group-hover:text-[#00E599]" />
      ),
      href: "/",
    },
    {
      title: "Generate Script",
      icon: (
        <IconPencil className="h-full w-full text-gray-400 group-hover:text-[#00E599]" />
      ),
      href: "/generate-script",
    },
    {
      title: "Generated Script",
      icon: (
        <IconFiles className="h-full w-full text-gray-400 group-hover:text-[#00E599]" />
      ),
      href: "/generated-script",
    },
    {
      title: "Generate Audio",
      icon: (
        <IconMicrophone className="h-full w-full text-gray-400 group-hover:text-[#00E599]" />
      ),
      href: "/generate-audio",
    },
    {
      title: "Products",
      icon: (
        <IconNewSection className="h-full w-full text-gray-400 group-hover:text-[#00E599]" />
      ),
      href: "/products",
    },
    {
      title: "Terminal",
      icon: (
        <IconTerminal2 className="h-full w-full text-gray-400 group-hover:text-[#00E599]" />
      ),
      href: "/terminal",
    },
    {
      title: "Exchange",
      icon: (
        <IconExchange className="h-full w-full text-gray-400 group-hover:text-[#00E599]" />
      ),
      href: "/exchange",
    },
    {
      title: "GitHub",
      icon: (
        <IconBrandGithub className="h-full w-full text-gray-400 group-hover:text-[#00E599]" />
      ),
      href: "https://github.com/Vision-Infinity",
    },
    {
      title: "Twitter",
      icon: (
        <IconBrandX className="h-full w-full text-gray-400 group-hover:text-[#00E599]" />
      ),
      href: "https://twitter.com/VisionInfinity_",
    },
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-0 left-0 right-0 z-50"
        >
          {isMobile ? (
            // Mobile Navigation
            <div className="bg-[#151921]/80 backdrop-blur-lg border-t border-white/10">
              <div className="px-4 pt-4">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="w-full py-2 flex items-center justify-center gap-2 
                  text-gray-400 hover:text-white transition-colors"
                >
                  <IconMenu2 size={24} />
                  <span className="text-sm">Menu</span>
                </button>
              </div>
              <motion.div
                initial={false}
                animate={isMobileMenuOpen ? "open" : "closed"}
                variants={{
                  open: { height: "auto", opacity: 1 },
                  closed: { height: 0, opacity: 0 },
                }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                {isMobileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="px-4 pb-4 grid grid-cols-3 gap-4"
                  >
                    {navigationItems.map((item) => (
                      <motion.a
                        key={item.title}
                        href={item.href}
                        className="flex flex-col items-center p-2 group"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div className="w-6 h-6 mb-1">{item.icon}</div>
                        <span className="text-xs text-gray-400 group-hover:text-[#00E599]">
                          {item.title}
                        </span>
                      </motion.a>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            </div>
          ) : (
            // Desktop Navigation
            <div className="flex items-center justify-center pb-6">
              <FloatingDock items={navigationItems} />
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
