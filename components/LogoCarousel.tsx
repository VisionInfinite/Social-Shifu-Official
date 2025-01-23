"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

// Import logos
import netflixLogo from "@/public/logos/netflix.svg";
import instagramLogo from "@/public/logos/instagram.svg";
// import tiktokLogo from "@/public/logos/tiktok.svg";
// import youtubeLogo from "@/public/logos/youtube.svg";
import twitchLogo from "@/public/logos/twitch.svg";
import spotifyLogo from "@/public/logos/spotify.svg";
import discordLogo from "@/public/logos/discord.svg";

const LOGOS = [
  {
    src: netflixLogo,
    alt: "Netflix",
    width: 120,
    height: 50,
  },
  {
    src: instagramLogo,
    alt: "Instagram",
    width: 120,
  },
  // {
  //   src: tiktokLogo,
  //   alt: "TikTok",
  //   width: 100,
  //   height: 100,
  // },
  // {
  //   src: youtubeLogo,
  //   alt: "YouTube",
  //   width: 140,
  // },
  {
    src: twitchLogo,
    alt: "Twitch",
    width: 120,
    height: 50,
  },
  {
    src: spotifyLogo,
    alt: "Spotify",
    width: 120,
    height: 100,
  },
  {
    src: discordLogo,
    alt: "Discord",
    width: 120,
    height: 100,
  }
];

export const LogoCarousel = () => {
  return (
    <div className="relative flex flex-col items-center justify-center w-full overflow-hidden bg-[#151921] py-16">
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white via-white/90 to-white/70">
          Trusted by Leading Platforms
        </h2>
      </div>
      <div className="relative w-full overflow-hidden">
        {/* First row */}
        <div className="flex">
          <motion.div
            animate={{
              x: ["0%", "-100%"],
            }}
            transition={{
              duration: 20,
              ease: "linear",
              repeat: Infinity,
            }}
            className="flex gap-16 py-4 shrink-0"
          >
            {LOGOS.map((logo, idx) => (
              <div
                key={idx}
                className="flex items-center justify-center px-4 grayscale hover:grayscale-0 transition-all"
              >
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={logo.width}
                  height={logo.height}
                  className="object-contain h-16"
                />
              </div>
            ))}
          </motion.div>
          <motion.div
            animate={{
              x: ["0%", "-100%"],
            }}
            transition={{
              duration: 20,
              ease: "linear",
              repeat: Infinity,
            }}
            className="flex gap-16 py-4 shrink-0"
          >
            {LOGOS.map((logo, idx) => (
              <div
                key={idx}
                className="flex items-center justify-center px-4 grayscale hover:grayscale-0 transition-all"
              >
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={logo.width}
                  height={logo.height}
                  className="object-contain h-16"
                />
              </div>
            ))}
          </motion.div>
        </div>

        {/* Second row */}
        <div className="flex">
          <motion.div
            animate={{
              x: ["-100%", "0%"],
            }}
            transition={{
              duration: 20,
              ease: "linear",
              repeat: Infinity,
            }}
            className="flex gap-16 py-4 shrink-0"
          >
            {LOGOS.map((logo, idx) => (
              <div
                key={idx}
                className="flex items-center justify-center px-4 grayscale hover:grayscale-0 transition-all"
              >
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={logo.width}
                  height={logo.height}
                  className="object-contain h-16"
                />
              </div>
            ))}
          </motion.div>
          <motion.div
            animate={{
              x: ["-100%", "0%"],
            }}
            transition={{
              duration: 20,
              ease: "linear",
              repeat: Infinity,
            }}
            className="flex gap-16 py-4 shrink-0"
          >
            {LOGOS.map((logo, idx) => (
              <div
                key={idx}
                className="flex items-center justify-center px-4 grayscale hover:grayscale-0 transition-all"
              >
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={logo.width}
                  height={logo.height}
                  className="object-contain h-16"
                />
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Gradient overlays */}
      <div className="absolute left-0 top-0 bottom-0 w-40 bg-gradient-to-r from-[#0C1117] to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-40 bg-gradient-to-l from-[#0C1117] to-transparent z-10" />
    </div>
  );
}; 