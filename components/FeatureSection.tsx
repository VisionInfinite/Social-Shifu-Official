'use client';

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Image from "next/image";

export const FeatureSection = () => {
  const features = [
    {
      title: "AI-Powered Creation",
      description: "From image generation to video production, our AI tools streamline your creative process.",
      icon: "🎯",
    },
    {
      title: "Multi-Platform Support",
      description: "Create and share content across all major social media platforms seamlessly.",
      icon: "🌐",
    },
    {
      title: "Real-time Collaboration",
      description: "Work together with your team in real-time, from anywhere in the world.",
      icon: "👥",
    },
    {
      title: "Advanced Analytics",
      description: "Track performance and gain insights with our comprehensive analytics tools.",
      icon: "📊",
    },
    {
      title: "Custom Templates",
      description: "Choose from thousands of templates or create your own unique designs.",
      icon: "🎨",
    },
    {
      title: "Cloud Storage",
      description: "Securely store and access your content from anywhere, anytime.",
      icon: "☁️",
    },
    {
      title: "24/7 Support",
      description: "Get help whenever you need it with our round-the-clock customer support.",
      icon: "🛟",
    },
    {
      title: "Smart Automation",
      description: "Automate repetitive tasks and focus on what matters most - creating.",
      icon: "⚡",
    },
  ];

  return (
    <div className="relative w-full">
      <div className="mx-auto max-w-7xl px-4 py-24">
        <div className="text-center mb-20">
          <h2 className={`text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white via-white/90 to-white/70 mb-4`}>
            Packed with Powerful Features
          </h2>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto">
            Everything you need to create stunning videos and reach your audience
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="group relative overflow-hidden rounded-2xl bg-[#151921] p-8 hover:bg-[#1C2128] transition-colors"
            >
              <div className="relative z-10">
                <span className="mb-4 block text-3xl">{feature.icon}</span>
                <h3 className="mb-2 text-xl font-semibold text-white group-hover:text-[#00E599] transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-400">
                  {feature.description}
                </p>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-[#00E599]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}; 