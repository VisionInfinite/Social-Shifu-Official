'use client'

import { useRouter } from 'next/navigation'
import { useSelectedLayoutSegments } from 'next/navigation'

interface LanguageSelectorProps {
  className?: string
}

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'hi', name: 'हिंदी' },
]

export default function LanguageSelector({ className }: LanguageSelectorProps) {
  const router = useRouter()
  const segments = useSelectedLayoutSegments()
  const currentLocale = segments[0] || 'en'
  
  const handleLanguageChange = (newLocale: string) => {
    // Get the current path segments excluding locale
    const pathSegments = segments.slice(1)
    
    // If no path segments, default to 'login'
    const path = pathSegments.length > 0 ? pathSegments.join('/') : 'login'
    
    // Construct new path with the new locale
    const newPath = `/${newLocale}/${path}`
    router.push(newPath)
  }

  return (
    <select
      className={`bg-[#1C2128] text-white border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:border-[#00E599] ${className}`}
      value={currentLocale}
      onChange={(e) => handleLanguageChange(e.target.value)}
    >
      {languages.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.name}
        </option>
      ))}
    </select>
  )
}