"use client"

import { motion } from "framer-motion"
import { useParams } from "next/navigation"  // Changed this line
import { FaGoogle, FaFacebook, FaTwitter } from "react-icons/fa"

const translations = {
  en: {
    signInWith: "Sign in with {{provider}}",
  },
  es: {
    signInWith: "Iniciar sesión con {{provider}}",
  },
  fr: {
    signInWith: "Se connecter avec {{provider}}",
  },
}

const SocialLoginButtons = () => {
  const handleSocialLogin = (provider: string) => {
    // Implement social login logic here
    console.log(`Logging in with ${provider}`);
  }

  return (
    <div className="flex flex-col space-y-4">
      <button
        onClick={() => handleSocialLogin("Google")}
        className="flex items-center justify-center w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
      >
        Sign in with Google
      </button>
      <button
        onClick={() => handleSocialLogin("Facebook")}
        className="flex items-center justify-center w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Sign in with Facebook
      </button>
      <button
        onClick={() => handleSocialLogin("Twitter")}
        className="flex items-center justify-center w-full py-3 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition"
      >
        Sign in with Twitter
      </button>
    </div>
  )
}

export default SocialLoginButtons

