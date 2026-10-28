"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export default function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-footer-bg border-b border-isil-cyan">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2 min-w-0 pr-3">
          <span className="text-isil-cyan font-bold text-lg">ISIL</span>
          <span className="text-white text-xs sm:text-base font-bold">
            {" "}
            · Calculadora y Agenda Académica
          </span>
        </div>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
          aria-label={
            theme === "light" ? "Activar modo oscuro" : "Activar modo claro"
          }
          title={theme === "light" ? "Modo oscuro" : "Modo claro"}
        >
          {theme === "light" ? (
            <Moon className="w-5 h-5 text-white" />
          ) : (
            <Sun className="w-5 h-5 text-white" />
          )}
        </button>
      </div>
    </header>
  );
}
