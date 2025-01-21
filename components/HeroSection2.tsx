"use client";

import React from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import heroSection1 from "@/public/hero-section-images/hero-section1.png";
import heroSection2 from "@/public/hero-section-images/hero-section2.png";
import heroSection3 from "@/public/hero-section-images/hero-section3.png";
import heroSection4 from "@/public/hero-section-images/hero-section4.png";
import heroSection5 from "@/public/hero-section-images/hero-section5.png";
import { StaticImageData } from "next/image";

const products = [
  {
    title: "Video Creation",
    link: "https://ui.aceternity.com/components/link-preview",
    thumbnail: heroSection1
  },
  {
    title: "AI Templates",
    link: "https://ui.aceternity.com/components/link-preview",
    thumbnail: heroSection2
  },
  {
    title: "Social Media",
    link: "#",
    thumbnail: heroSection3
  },
  {
    title: "Content Studio",
    link: "#",
    thumbnail: heroSection4
  },
  {
    title: "Analytics Dashboard",
    link: "#",
    thumbnail: heroSection5
  },
  {
    title: "Collaboration Tools",
    link: "#",
    thumbnail: heroSection1
  },
  {
    title: "Asset Library",
    link: "#",
    thumbnail: heroSection2
  },
  {
    title: "Export Options",
    link: "#",
    thumbnail: heroSection3
  },
  {
    title: "Custom Branding",
    link: "#",
    thumbnail: heroSection4
  },
  {
    title: "Team Management",
    link: "#",
    thumbnail: heroSection5
  },
  {
    title: "Cloud Storage",
    link: "#",
    thumbnail: heroSection1
  },
  {
    title: "API Integration",
    link: "#",
    thumbnail: heroSection2
  },
  {
    title: "Mobile Apps",
    link: "#",
    thumbnail: heroSection3
  },
  {
    title: "Support Center",
    link: "#",
    thumbnail: heroSection4
  },
  {
    title: "Training Resources",
    link: "#",
    thumbnail: heroSection5
  }
];

export const HeroSection2 = () => {
  const firstRow = products.slice(0, 5);
  const secondRow = products.slice(5, 10);
  const thirdRow = products.slice(10, 15);
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

  const translateX = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 1000]),
    springConfig
  );
  const translateXReverse = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -1000]),
    springConfig
  );
  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [15, 0]),
    springConfig
  );
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [0.2, 1]),
    springConfig
  );
  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [20, 0]),
    springConfig
  );
  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [-700, 500]),
    springConfig
  );

  return (
    <div
      ref={ref}
      className="h-[300vh] py-40 overflow-hidden antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d]"
    >
      <Header />
      <motion.div
        style={{
          rotateX,
          rotateZ,
          translateY,
          opacity,
        }}
      >
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-20 mb-20">
          {firstRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product.title}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row mb-20 space-x-20">
          {secondRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateXReverse}
              key={product.title}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-20">
          {thirdRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product.title}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

const Header = () => {
  return (
    <div className="max-w-7xl relative mx-auto py-20 md:py-40 px-4 w-full left-0 top-0">
      <h1 className="text-2xl md:text-7xl font-bold text-white">
        Transform Your Ideas <br /> into Stunning Videos
      </h1>
      <p className="max-w-2xl text-base md:text-xl mt-8 text-neutral-200">
        Create professional videos effortlessly with our AI-powered tools. 
        Reach global audiences and enhance your content creation process.
      </p>
    </div>
  );
};

const ProductCard = ({
  product,
  translate,
}: {
  product: {
    title: string;
    link: string;
    thumbnail: StaticImageData;
  };
  translate: MotionValue<number>;
}) => {
  const [imageError, setImageError] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  return (
    <motion.div
      style={{
        x: translate,
      }}
      whileHover={{
        y: -20,
      }}
      key={product.title}
      className="group/product h-96 w-[30rem] relative flex-shrink-0"
    >
      <Link
        href={product.link}
        className="block group-hover/product:shadow-2xl"
      >
        <div className="relative h-full w-full">
          {isLoading && (
            <div className="absolute inset-0 bg-[#151921] rounded-2xl flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-[#00E599] border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          <Image
            src={product.thumbnail}
            height={600}
            width={600}
            className={`object-cover object-left-top absolute h-full w-full inset-0 rounded-2xl transition-opacity duration-300 ${
              isLoading ? 'opacity-0' : 'opacity-100'
            }`}
            alt={product.title}
            onLoadingComplete={() => setIsLoading(false)}
            onError={() => {
              setImageError(true);
              setIsLoading(false);
            }}
            priority
          />
          {imageError && (
            <div className="absolute inset-0 bg-[#151921] rounded-2xl flex items-center justify-center">
              <span className="text-[#00E599]">Image not found</span>
            </div>
          )}
        </div>
      </Link>
      <div className="absolute inset-0 h-full w-full opacity-0 group-hover/product:opacity-80 bg-black pointer-events-none rounded-2xl transition-opacity duration-300" />
      <h2 className="absolute bottom-4 left-4 opacity-0 group-hover/product:opacity-100 text-white font-bold text-2xl transition-opacity duration-300">
        {product.title}
      </h2>
    </motion.div>
  );
}; 