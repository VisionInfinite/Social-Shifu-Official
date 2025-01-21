'use client';

import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { FaHome, FaSearch, FaChartPie, FaHistory, FaUser } from 'react-icons/fa'

export default function NavigationBar() {
  const router = useRouter()

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="fixed bottom-6 inset-x-0 mx-auto w-fit z-50"
    >
      <div className="flex items-center space-x-4 sm:space-x-6 md:space-x-8 px-4 sm:px-5 md:px-6 py-3 bg-[#151921]/90 backdrop-blur-lg rounded-full border border-white/10 shadow-lg">
        <button
          onClick={() => router.push('/')}
          className="flex flex-col items-center text-gray-400 hover:text-[#00E599] transition-colors"
          aria-label="Home"
          tabIndex={0}
        >
          <FaHome className="w-4 h-4 sm:w-5 sm:h-5 mb-1" />
          <span className="text-[10px] sm:text-xs">Home</span>
        </button>
        
        <button 
          className="flex flex-col items-center text-gray-400 hover:text-[#00E599] transition-colors"
          aria-label="Search"
          tabIndex={0}
        >
          <FaSearch className="w-4 h-4 sm:w-5 sm:h-5 mb-1" />
          <span className="text-[10px] sm:text-xs">Search</span>
        </button>
        
        <button 
          className="flex flex-col items-center text-gray-400 hover:text-[#00E599] transition-colors"
          aria-label="Pricing"
          tabIndex={0}
        >
          <FaChartPie className="w-4 h-4 sm:w-5 sm:h-5 mb-1" />
          <span className="text-[10px] sm:text-xs">Pricing</span>
        </button>
        
        <button 
          className="flex flex-col items-center text-gray-400 hover:text-[#00E599] transition-colors"
          aria-label="Contact Us"
          tabIndex={0}
        >
          <FaHistory className="w-4 h-4 sm:w-5 sm:h-5 mb-1" />
          <span className="text-[10px] sm:text-xs">Contact Us</span>
        </button>
        
        <button
          onClick={() => router.push('/en/login')}
          className="flex flex-col items-center text-gray-400 hover:text-[#00E599] transition-colors"
          aria-label="Profile"
          tabIndex={0}
        >
          <FaUser className="w-4 h-4 sm:w-5 sm:h-5 mb-1" />
          <span className="text-[10px] sm:text-xs">Profile</span>
        </button>
      </div>
    </motion.div>
  )
} 