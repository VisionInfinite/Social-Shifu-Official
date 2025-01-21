"use client"
// import { useEffect } from 'react';
import { useState } from "react"
import { motion } from "framer-motion"
import { useForm } from "react-hook-form"
import PasswordStrengthMeter from "./PasswordStrengthMeter"
import SocialLoginButtons from "./SocialLoginButtons"
import { useRouter, useSelectedLayoutSegments } from "next/navigation"
import { FaGoogle, FaFacebook, FaTwitter } from "react-icons/fa"
import translations from '../public/locales/en/common.json' // Adjust the path as necessary

type FormData = {
  email: string
  password: string
  confirmPassword: string
}

type TranslationKeys = {
  email: string;
  emailRequired: string;
  invalidEmail: string;
  emailPlaceholder: string;
  password: string;
  passwordRequired: string;
  passwordMinLength: string;
  confirmPassword: string;
  confirmPasswordRequired: string;
  passwordsDoNotMatch: string;
  signUp: string;
  alreadyHaveAccount: string;
  backToLogin: string;
}

const allTranslations: Record<string, TranslationKeys> = {
  en: {
    email: "Email",
    emailRequired: "Email is required",
    invalidEmail: "Invalid email address",
    emailPlaceholder: "you@example.com",
    password: "Password",
    passwordRequired: "Password is required",
    passwordMinLength: "Password must be at least 8 characters",
    confirmPassword: "Confirm Password",
    confirmPasswordRequired: "Confirm Password is required",
    passwordsDoNotMatch: "Passwords do not match",
    signUp: "Sign Up",
    alreadyHaveAccount: "Already have an account?",
    backToLogin: "Login",
  },
  es: {
    email: "Correo electrónico",
    emailRequired: "El correo electrónico es obligatorio",
    invalidEmail: "Dirección de correo electrónico inválida",
    emailPlaceholder: "tu@ejemplo.com",
    password: "Contraseña",
    passwordRequired: "La contraseña es obligatoria",
    passwordMinLength: "La contraseña debe tener al menos 8 caracteres",
    confirmPassword: "Confirmar contraseña",
    confirmPasswordRequired: "Se requiere confirmar la contraseña",
    passwordsDoNotMatch: "Las contraseñas no coinciden",
    signUp: "Regístrate",
    alreadyHaveAccount: "¿Ya tienes una cuenta?",
    backToLogin: "Iniciar sesión",
  },
  fr: {
    email: "E-mail",
    emailRequired: "L'e-mail est requis",
    invalidEmail: "Adresse e-mail invalide",
    emailPlaceholder: "vous@exemple.com",
    password: "Mot de passe",
    passwordRequired: "Le mot de passe est requis",
    passwordMinLength: "Le mot de passe doit contenir au moins 8 caractères",
    confirmPassword: "Confirmer le mot de passe",
    confirmPasswordRequired: "La confirmation du mot de passe est requise",
    passwordsDoNotMatch: "Les mots de passe ne correspondent pas",
    signUp: "S'inscrire",
    alreadyHaveAccount: "Vous avez déjà un compte ?",
    backToLogin: "Se connecter",
  },
  hi: {
    email: "ईमेल",
    emailRequired: "ईमेल आवश्यक है",
    invalidEmail: "अमान्य ईमेल पता",
    emailPlaceholder: "आप@उदाहरण.com",
    password: "पासवर्ड",
    passwordRequired: "पासवर्ड आवश्यक है",
    passwordMinLength: "पासवर्ड कम से कम 8 अक्षर का होना चाहिए",
    confirmPassword: "पासवर्ड की पुष्टि करें",
    confirmPasswordRequired: "पासवर्ड की पुष्टि आवश्यक है",
    passwordsDoNotMatch: "पासवर्ड मेल नहीं खाते",
    signUp: "साइन अप करें",
    alreadyHaveAccount: "पहले से ही एक खाता है?",
    backToLogin: "लॉगिन करें"
  },
  // Add translations for other languages if needed
}

export default function SignUpForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>()

  const password = watch("password")
  const confirmPassword = watch("confirmPassword")
  const router = useRouter()
  const segments = useSelectedLayoutSegments()
  const currentLocale = segments[0] || 'en'
  const t = allTranslations[currentLocale] || allTranslations.en; // Fallback to English if locale is not found

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    console.log(data)
    setIsLoading(false)
  }

  // Calculate password strength
  const calculatePasswordStrength = (password: string) => {
    const strength = password ? Math.min(password.length, 4) : 0
    setPasswordStrength(strength)
  }

  // Watch password changes to calculate strength
  watch((value) => {
    if (value.password) {
      calculatePasswordStrength(value.password)
    }
  })

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
        {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-300">
          {t.password}
        </label>
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
        />
        {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>}
        <PasswordStrengthMeter strength={passwordStrength} />
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
          {t.confirmPassword}
        </label>
        <input
          id="confirmPassword"
          type="password"
          {...register("confirmPassword", {
            required: t.confirmPasswordRequired,
            validate: (value) => value === password || t.passwordsDoNotMatch,
          })}
          className={`mt-1 block w-full px-4 py-3 bg-[#1C2128] border ${
            errors.confirmPassword ? "border-red-500" : "border-white/10"
          } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#00E599] focus:ring-1 focus:ring-[#00E599] transition-colors`}
        />
        {errors.confirmPassword && <p className="mt-1 text-xs text-red-400">{errors.confirmPassword.message}</p>}
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        disabled={isLoading}
        className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white ${
          isLoading ? "bg-[#00E599]/50" : "bg-[#00E599] hover:bg-[#00E599]/90"
        } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00E599] transition-colors`}
      >
        {isLoading ? "Loading..." : t.signUp}
      </motion.button>

      <div className="my-4">
        <hr className="border-white/10" />
      </div>

      <div className="text-center text-gray-400">
        <p>{t.alreadyHaveAccount}</p>
        <button
          onClick={() => router.push(`/${currentLocale}/login`)}
          className="text-[#00E599] hover:text-[#00E599]/80 transition-colors"
        >
          {t.backToLogin}
        </button>
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
    </motion.form>
  )
} 