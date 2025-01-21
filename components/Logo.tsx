'use client'
import { motion } from "framer-motion"

export default function Logo() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex justify-center mb-8"
    >
      <h1
        className="text-4xl font-bold text-white"
        style={{
          textShadow: "0 0 20px rgba(0, 229, 153, 0.5)",
        }}
      >
        Social Shifu
      </h1>
    </motion.div>
  )
}

