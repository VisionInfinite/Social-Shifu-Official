"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useForm } from "react-hook-form"
import { useRouter, useSelectedLayoutSegments } from "next/navigation"
import PasswordStrengthMeter from "./PasswordStrengthMeter"
import SocialLoginButtons from "./SocialLoginButtons"
import { FaGoogle, FaFacebook, FaTwitter } from "react-icons/fa"
import translations from '../public/locales/en/common.json'

type FormData = {
  email: string
  password: string
  rememberMe: boolean
}

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const segments = useSelectedLayoutSegments()
  const currentLocale = segments[0] || 'en'
  const t = translations

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>()
  const [passwordStrength, setPasswordStrength] = useState(0)

  const password = watch("password")

  useEffect(() => {
    // Simple password strength calculation
    const strength = password ? Math.min(password.length, 4) : 0
    setPasswordStrength(strength)
  }, [password])

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    console.log(data)
    setIsLoading(false)
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-300">
          {t.email}
        </label>
        <motion.div whileFocus={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
          <input
            id="email"
            type="email"
            {...register("email", {
              required: t.emailRequired,
              pattern: { value: /^\S+@\S+$/i, message: t.invalidEmail },
            })}
            className={`mt-1 block w-full px-4 py-3 bg-[#1C2128] border ${
              errors.email ? "border-red-500" : "border-white/10"
            } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#00E599] focus:ring-1 focus:ring-[#00E599] transition-colors`}
            placeholder={t.emailPlaceholder}
          />
        </motion.div>
        {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-300">
          {t.password}
        </label>
        <motion.div whileFocus={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
          <input
            id="password"
            type="password"
            {...register("password", {
              required: t.passwordRequired,
              minLength: { value: 8, message: t.passwordMinLength },
            })}
            className={`mt-1 block w-full px-4 py-3 bg-[#1C2128] border ${
              errors.password ? "border-red-500" : "border-white/10"
            } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#00E599] focus:ring-1 focus:ring-[#00E599] transition-colors`}
            placeholder={t.passwordPlaceholder}
          />
        </motion.div>
        {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>}
        <PasswordStrengthMeter strength={passwordStrength} />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            type="checkbox"
            {...register("rememberMe")}
            className="h-4 w-4 rounded border-white/10 bg-[#1C2128] text-[#00E599] focus:ring-[#00E599] focus:ring-offset-0"
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
            {t.rememberMe}
          </label>
        </div>

        <div className="text-sm">
          <a
            onClick={() => router.push(`/${currentLocale}/forgot-password`)}
            className="font-medium text-[#00E599] hover:text-[#00E599]/80 transition-colors cursor-pointer"
          >
            {t.forgotPassword}
          </a>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        disabled={isLoading}
        className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white ${
          isLoading ? "bg-[#00E599]/50" : "bg-[#00E599] hover:bg-[#00E599]/90"
        } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00E599] transition-colors`}
        style={{
          boxShadow: "0 0 20px rgba(0, 229, 153, 0.3)",
        }}
      >
        {isLoading ? (
          <motion.svg
            className="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </motion.svg>
        ) : (
          t.signIn
        )}
      </motion.button>

      <div className="my-4">
        <hr className="border-white/10" />
      </div>

      <div className="text-center text-gray-400">
        <p>{t.orContinueWith}</p>
      </div>

      <div className="mt-6 flex justify-around">
        <button
          onClick={() => console.log("Login with Google")}
          className="flex items-center justify-center w-16 h-16 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          <FaGoogle className="w-8 h-8" />
        </button>
        <button
          onClick={() => console.log("Login with Facebook")}
          className="flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <FaFacebook className="w-8 h-8" />
        </button>
        <button
          onClick={() => console.log("Login with Twitter")}
          className="flex items-center justify-center w-16 h-16 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition"
        >
          <FaTwitter className="w-8 h-8" />
        </button>
      </div>

      <div className="text-center mt-6">
        <p className="text-sm text-gray-400">
          {t.noAccount}{" "}
          <button
            onClick={() => router.push(`/${currentLocale}/signup`)}
            className="font-medium text-[#00E599] hover:text-[#00E599]/80 transition-colors"
            style={{
              textShadow: "0 0 10px rgba(0, 229, 153, 0.3)",
            }}
          >
            {t.signUp}
          </button>
        </p>
      </div>
    </motion.form>
  )
}

