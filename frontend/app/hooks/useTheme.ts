'use client'
import { useState, useEffect } from 'react'

export function useTheme() {
  const [theme, setThemeState] = useState<'dark' | 'light'>(() => {
    if (typeof window === 'undefined') return 'dark'
    return (localStorage.getItem('rs-theme') as 'dark' | 'light') || 'dark'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('rs-theme', theme)
  }, [theme])

  return { theme, setTheme: setThemeState }
}
