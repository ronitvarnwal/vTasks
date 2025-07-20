'use client';

import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  return (
    <>
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className="relative bg-transparent border-none shadow-none h-10 w-10 bg-gray-100/50 dark:bg-zinc-900/50"
    >
      <Sun className="transition-all duration-300 dark:opacity-0 dark:scale-0 dark:text-white" />
      <Moon className="h-10 w-10 absolute transition-all duration-300 opacity-0 scale-0 dark:opacity-100 dark:scale-100 dark:text-white" />
    </Button>
      {theme === 'light' ? (
          <img src="/menu.svg" className="opacity-100 w-10 h-10"/>) : (
      <img src="/white-menu.svg" className="w-10 h-10" />)
          }
    </>
  )
}