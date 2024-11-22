'use client'

import React, { useState } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Award, LogIn, UserPlus, Menu } from 'lucide-react'
import { useAuth } from "../contexts/AuthContext"
import LogoutButton from "./LogoutButton"
import DarkModeToggle from "./DarkModeToggle"

export default function NavBar() {
  const { isAuthenticated } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const NavItems = () => (
    <>
      {isAuthenticated ? (
        <>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="challenges/" className="flex items-center space-x-2 px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-300 dark:bg-gray-500 dark:hover:bg-gray-700 transition-colors">
              <Award className="w-5 h-5" />
              <span>Challenges</span>
            </Link>
          </motion.div>
          <LogoutButton />
        </>
      ) : (
        <>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/login" className="flex items-center space-x-2 px-3 py-2 rounded-md text-white bg-gray-500 hover:bg-gray-600 dark:hover:bg-gray-700 transition-colors">
              <LogIn className="w-5 h-5" />
              <span>Iniciar Sesión</span>
            </Link>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/register" className="flex items-center space-x-2 px-3 py-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white transition-colors">
              <UserPlus className="w-5 h-5" />
              <span>Register</span>
            </Link>
          </motion.div>
        </>
      )}
    </>
  )

  return (
    <motion.header
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-950 text-gray-900 dark:text-white shadow-md border-b-4 border-gray-300"
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link to="/dashboard" className="text-2xl font-bold hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            <h1>Beta</h1>
          </Link>
        </motion.div>
        <nav className="flex items-center space-x-4">
          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            <NavItems />
          </div>
          
          {/* Mobile menu button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </button>
          
          <DarkModeToggle />
        </nav>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="md:hidden"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavItems />
          </div>
        </motion.div>
      )}
    </motion.header>
  )
}

