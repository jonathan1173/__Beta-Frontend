'use client'

import React from "react"
import LogoutButton from "./LogoutButton"
import { Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import DarkModeToggle from "./DarkModeToggle"
import { motion } from "framer-motion"
import { Award, LogIn, UserPlus } from 'lucide-react'

export default function NavBar() {
  const { isAuthenticated } = useAuth()

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
          {/* titulo */}
          <Link to="/dashboard" className="text-2xl font-bold hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            <h1>Beta</h1>
          </Link>

        </motion.div>
        <nav className="flex items-center space-x-4">
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* link cuando tenes permiso */}
                <Link to="challenges/" className="flex items-center space-x-2 px-3 py-2 rounded-md  bg-gray-100 hover:bg-gray-300 dark:bg-gray-500 dark:hover:bg-gray-700 transition-colors">
                  <Award className="w-5 h-5" />
                  <span>Challenges</span>
                </Link>
              </motion.div>
              <LogoutButton />
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* link cuando no tenes permiso  */}
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

            </div>
          )}  
          <DarkModeToggle />

        </nav>
      </div>
    </motion.header>
  )
} 