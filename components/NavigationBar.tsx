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

  const links = [
    {
      title: "Home",
      icon: (
        <IconHome className="h-full w-full text-gray-400 group-hover:text-[#00E599]" />
      ),
      href: "/en",
    },
    {
      title: "Products",
      icon: (
        <IconTerminal2 className="h-full w-full text-gray-400 group-hover:text-[#00E599]" />
      ),
      href: "/en/products",
    },
    {
      title: "Components",
      icon: (
        <IconNewSection className="h-full w-full text-gray-400 group-hover:text-[#00E599]" />
      ),
      href: "/en/components",
    },
    {
      title: "Aceternity UI",
      icon: (
        <Image
          src="https://assets.aceternity.com/logo-dark.png"
          width={20}
          height={20}
          alt="Aceternity Logo"
        />
      ),
      href: "#",
    },
    {
      title: "Changelog",
      icon: (
        <IconExchange className="h-full w-full text-gray-400 group-hover:text-[#00E599]" />
      ),
      href: "#",
    },
    {
      title: "Twitter",
      icon: (
        <IconBrandX className="h-full w-full text-gray-400 group-hover:text-[#00E599]" />
      ),
      href: "#",
    },
    {
      title: "GitHub",
      icon: (
        <IconBrandGithub className="h-full w-full text-gray-400 group-hover:text-[#00E599]" />
      ),
      href: "https://github.com",
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
            <div className="p-4">
              <motion.div
                className="bg-[#151921]/90 backdrop-blur-lg rounded-2xl border border-white/10 shadow-lg overflow-hidden"
                initial={false}
                animate={{
                  height: isMobileMenuOpen ? 'auto' : '64px',
                }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                <div className="p-4 flex items-center justify-between">
                  <span className="text-gray-400">Menu</span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-[#00E599]"
                  >
                    <IconMenu2 className="w-6 h-6" />
                  </motion.button>
                </div>
                {isMobileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="px-4 pb-4 grid grid-cols-3 gap-4"
                  >
                    {links.map((item) => (
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
              <FloatingDock items={links} />
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
