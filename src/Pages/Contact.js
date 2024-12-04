'use client'

import React, { useEffect, useRef } from 'react'
import { motion, useAnimation, useInView } from 'framer-motion'
import miImagen1 from '../style/1.jpg'
import miImagen2 from '../style/2.jpg'
import miImagen3 from '../style/3.jpg'

const ImageCard = ({ src, alt, index }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.5 })
  const controls = useAnimation()

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [isInView, controls])

  return (
    <motion.div 
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, rotateY: 0 },
        visible: { 
          opacity: 1, 
          rotateY: 360,
          transition: { 
            duration: 1.5,
            delay: index * 0.2,
            ease: "easeInOut"
          }
        }
      }}
      className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 h-full"
    >
      <div className="w-full h-full">
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover transition-all duration-300 hover:opacity-90"
        />
      </div>
    </motion.div>
  )
}

function ImageCards() {
  return (
    <div className="bg-white dark:bg-zinc-900 py-12 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ImageCard src={miImagen1} alt="Descripción de la imagen 1" index={0} />
          <ImageCard src={miImagen2} alt="Descripción de la imagen 2" index={1} />
          <ImageCard src={miImagen3} alt="Descripción de la imagen 3" index={2} />
        </div>
      </div>
    </div>
  )
}

export default ImageCards

