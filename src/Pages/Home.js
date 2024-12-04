import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import {Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 dark:from-gray-900 dark:to-indigo-950 flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <motion.h1 
          className="text-4xl md:text-6xl font-bold text-blue-600 dark:text-blue-400 mb-6"
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 120 }}
        >
          Bienvenido a Beta
        </motion.h1>
        <motion.p 
          className="text-xl text-gray-700 dark:text-gray-300 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Descubre el futuro de la innovación con nosotros.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className='flex flex-col items-center gap-2'
        >
          <Link to="/login" className="inline-flex items-center px-6 py-3 text-lg font-semibold text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-colors duration-300">
            Comenzar
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
          <Link to="/contact" className="inline-flex items-center px-6 py-3 text-lg font-semibold text-white bg-emerald-600 rounded-full hover:bg-emerald-700 transition-colors duration-300">
            Contact
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}