'use client';

import { useState } from "react"
import { motion } from "framer-motion"
import { useRouter, useSelectedLayoutSegments } from "next/navigation"
import Background from "@/components/Background"
import LanguageSelector from "@/components/LanguageSelector"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const router = useRouter()
  const segments = useSelectedLayoutSegments()
  const currentLocale = segments[0] || 'en'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage("")

    // Simulate API call for password reset
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Here you would typically send a request to your API
    // For example: await fetch('/api/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) })

    setMessage("If an account with that email exists, a password reset link will be sent.")
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0C1117] text-white relative overflow-hidden">
      <Background />
      <div className="z-10 w-full max-w-md p-8 rounded-xl bg-[#151921]/80 backdrop-blur-xl border border-white/10 shadow-lg">
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <h2 className="text-2xl font-bold text-center">{currentLocale === 'en' ? 'Forgot Password?' : '¿Olvidaste tu contraseña?'}</h2>
          <p className="text-center text-gray-400">{currentLocale === 'en' ? 'Enter your email to receive a password reset link.' : 'Ingresa tu correo electrónico para recibir un enlace de restablecimiento de contraseña.'}</p>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-3 bg-[#1C2128] border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#00E599] focus:ring-1 focus:ring-[#00E599] transition-colors"
              placeholder="you@example.com"
            />
          </div>

          {message && <p className="mt-1 text-xs text-green-400">{message}</p>}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white ${isLoading ? "bg-[#00E599]/50" : "bg-[#00E599] hover:bg-[#00E599]/90"} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00E599] transition-colors`}
          >
            {isLoading ? "Loading..." : "Send Reset Link"}
          </motion.button>

          <div className="text-center text-gray-400">
            <p>{currentLocale === 'en' ? 'Remembered your password?' : '¿Recordaste tu contraseña?'}</p>
            <button
              onClick={() => router.push(`/${currentLocale}/login`)}
              className="text-[#00E599] hover:text-[#00E599]/80 transition-colors"
            >
              {currentLocale === 'en' ? 'Login' : 'Iniciar sesión'}
            </button>
          </div>
        </motion.form>
      </div>
      <LanguageSelector className="absolute top-4 right-4" />
    </div>
  )
} 