'use client'
import { motion } from "framer-motion"
import { useParams } from "next/navigation"  // Changed this line

interface PasswordStrengthMeterProps {
  strength: number
}

const translations = {
  en: {
    passwordStrength: "Password Strength",
    passwordNone: "None",
    passwordWeak: "Weak",
    passwordFair: "Fair",
    passwordGood: "Good",
    passwordStrong: "Strong",
  },
  es: {
    passwordStrength: "Fortaleza de la contraseña",
    passwordNone: "Ninguna",
    passwordWeak: "Débil",
    passwordFair: "Regular",
    passwordGood: "Buena",
    passwordStrong: "Fuerte",
  },
  fr: {
    passwordStrength: "Force du mot de passe",
    passwordNone: "Aucune",
    passwordWeak: "Faible",
    passwordFair: "Moyenne",
    passwordGood: "Bonne",
    passwordStrong: "Forte",
  },
}

export default function PasswordStrengthMeter({ strength }: PasswordStrengthMeterProps) {
  const params = useParams()  // Changed this line
  const locale = (params?.locale as string) || "en"  // Changed this line
  const t = translations[locale as keyof typeof translations]

  const getColor = (strength: number) => {
    switch (strength) {
      case 1:
        return "bg-red-500"
      case 2:
        return "bg-yellow-500"
      case 3:
        return "bg-blue-500"
      case 4:
        return "bg-[#00E599]"
      default:
        return "bg-gray-600"
    }
  }

  const getText = (strength: number) => {
    switch (strength) {
      case 1:
        return t.passwordWeak
      case 2:
        return t.passwordFair
      case 3:
        return t.passwordGood
      case 4:
        return t.passwordStrong
      default:
        return t.passwordNone
    }
  }

  return (
    <div className="mt-2">
      <div className="flex justify-between mb-1">
        <span className="text-xs text-gray-400">{t.passwordStrength}</span>
        <span className="text-xs text-gray-400">{getText(strength)}</span>
      </div>
      <div className="w-full bg-[#1C2128] rounded-full h-1.5">
        <motion.div
          className={`h-1.5 rounded-full ${getColor(strength)}`}
          initial={{ width: 0 }}
          animate={{ width: `${strength * 25}%` }}
          transition={{ duration: 0.5 }}
          style={{
            boxShadow: strength > 0 ? "0 0 10px rgba(0, 229, 153, 0.3)" : "none",
          }}
        />
      </div>
    </div>
  )
}

