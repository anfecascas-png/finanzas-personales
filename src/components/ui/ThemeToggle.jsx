import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

export function ThemeToggle() {
  const { dark, toggleDark } = useTheme()
  return (
    <button
      onClick={toggleDark}
      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-500 dark:text-gray-400"
      title={dark ? 'Modo claro' : 'Modo oscuro'}
    >
      {dark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  )
}
