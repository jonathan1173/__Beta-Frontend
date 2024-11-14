'use client'

import React, { useContext } from 'react'
import { DarkModeContext } from '../contexts/DarkModeContext'
import { motion } from 'framer-motion'
import { Moon, Sun } from 'lucide-react'

const DarkModeToggle = () => {
  const { isDarkMode, toggleDarkMode } = useContext(DarkModeContext)

  return (
    <motion.button
      onClick={toggleDarkMode}
      className="p-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-full"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      {isDarkMode ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </motion.button>
  )
}

export default DarkModeToggle