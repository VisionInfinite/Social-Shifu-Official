'use client';

import { motion } from "framer-motion";
import Image from "next/image";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { calSans } from "@/app/fonts";
// import heroImage from "@/public/hero-image.png";
import heroImage from "@/public/hero-section-images/hero-section1.png";

export const HeroSection = () => {
  return (
    <ContainerScroll
      titleComponent={
        <div id="hero-section" className="max-w-5xl mx-auto text-center">
          <h1 
            className={`
              ${calSans.className}
              tracking-tight
              pb-4
              flex flex-col
            `}
            style={{ 
              lineHeight: '1.1',
            }}
          >
            <span className="text-4xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white via-white/90 to-white/70">
              Transform Your Ideas
            </span>
            <span className="text-4xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white via-white/90 to-white/70 mt-1">
              into{" "}
              <span className="text-[#00E599]">
                Stunning
              </span>
            </span>
            <span className="text-4xl md:text-7xl font-bold text-[#00E599] mt-1">
              Videos
            </span>
          </h1>
        </div>
      }
    >
      <div className="flex items-center justify-center w-full h-full bg-[#151921] rounded-2xl">
        <div className="relative w-full h-full">
          <Image
            src={heroImage}
            alt="Hero Image"
            fill
            className="object-cover rounded-2xl"
            priority
            quality={100}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-full bg-gradient-to-br from-[#00E599]/20 to-transparent rounded-2xl" />
          </div>
        </div>
      </div>
    </ContainerScroll>
  );
}; 