'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Sun, Moon } from 'lucide-react'
import logo from '../svgs/logosvg.svg'

interface HeaderProps {
  activeSection: string
  setActiveSection: (section: string) => void
  theme: 'light' | 'dark'
  toggleTheme: () => void
}

export default function Header({ activeSection, setActiveSection, theme, toggleTheme }: HeaderProps) {
  const navItems = [
    { name: 'Home', section: 'home' },
    { name: 'Upload', section: 'upload' },
    { name: 'About', section: 'about' },
    { name: 'Contact', section: 'contact' },
  ]

  return (
    <header className={`bg-gradient-to-r from-blue-500 to-teal-500 shadow-md sticky top-0 z-10 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <motion.div
          className="flex items-center space-x-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Image src={logo} alt="Malama AI Logo" width={50} height={50} className="rounded-full" />
          <h1 className="text-2xl font-bold text-white">Congify AI</h1>
        </motion.div>
        <nav className="flex items-center space-x-6">
          <ul className="flex space-x-4">
            {navItems.map((item) => (
              <motion.li key={item.section} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href={`#${item.section}`}
                  className={`text-lg ${
                    activeSection === item.section
                      ? 'text-white font-semibold'
                      : 'text-gray-200'
                  } hover:text-white transition duration-200`}
                  onClick={() => setActiveSection(item.section)}
                >
                  {item.name}
                </Link>
              </motion.li>
            ))}
          </ul>
          <motion.button
            onClick={toggleTheme}
            className={`p-2 rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {theme === 'dark' ? <Sun className="text-yellow-400" /> : <Moon className="text-gray-600" />}
          </motion.button>
        </nav>
      </div>
    </header>
  )
}