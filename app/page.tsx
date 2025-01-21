'use client';

import { motion } from "framer-motion"
import Background from "@/components/Background"
import LanguageSelector from "@/components/LanguageSelector"
import NavigationBar from "@/components/NavigationBar"

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0C1117] text-white relative overflow-hidden">
      <Background />
      
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center h-screen text-center z-10">
        <h1 className="text-5xl font-bold mb-4" style={{ textShadow: "0 0 20px rgba(0, 229, 153, 0.5)" }}>
          Transform Your Ideas into Stunning Videos
        </h1>
        <p className="text-lg mb-6 max-w-2xl">
          Create professional videos effortlessly with our AI-powered tools. Reach global audiences and enhance your content creation process.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.location.href = '/en/login'} // Redirect to login
          className="bg-[#00E599] text-white py-3 px-6 rounded-lg hover:bg-[#00E599]/90 transition-colors"
        >
          Get Started
        </motion.button>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-[#151921]/80 z-10">
        <h2 className="text-3xl font-bold text-center mb-10">Why Choose Us?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
          <div className="bg-[#1C2128] p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-2">AI-Powered Tools</h3>
            <p>Leverage advanced AI technology to create videos quickly and efficiently.</p>
          </div>
          <div className="bg-[#1C2128] p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-2">Multilingual Support</h3>
            <p>Create videos in over 120 languages to reach a global audience.</p>
          </div>
          <div className="bg-[#1C2128] p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-2">User-Friendly Interface</h3>
            <p>Our intuitive design makes video creation accessible for everyone.</p>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-20 z-10">
        <h2 className="text-3xl font-bold text-center mb-10">What Our Users Say</h2>
        <div className="max-w-4xl mx-auto px-4">
          <blockquote className="bg-[#1C2128] p-6 rounded-lg shadow-lg text-center">
            <p className="text-lg italic mb-4">"This tool has transformed the way I create content. It's fast, easy, and the results are amazing!"</p>
            <cite className="text-sm font-semibold">- Happy User</cite>
          </blockquote>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-10 bg-[#151921] text-center z-10">
        <p className="text-sm text-gray-400">© 2024 Social Shifu. All rights reserved.</p>
        <LanguageSelector className="absolute top-4 right-4" />
      </footer>

      {/* Navigation Bar */}
      <NavigationBar />
    </div>
  )
} 