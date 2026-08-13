'use client'

import { Sun, Moon } from 'lucide-react'
import { useTheme } from './ThemeProvider'

export default function Header() {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="bg-footer-bg border-b border-isil-cyan">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-1">
          <span className="text-isil-cyan font-bold text-lg">ISIL</span>
          <span className="text-white text-lg font-bold"> - Calculadora de Promedio de Calificaciones</span>
        </div>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? (
            <Moon className="w-5 h-5 text-white" />
          ) : (
            <Sun className="w-5 h-5 text-white" />
          )}
        </button>
      </div>
    </header>
  )
}
