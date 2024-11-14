// DarkModeContext.js
import React, { createContext, useState, useEffect } from 'react';

// Crear el contexto
export const DarkModeContext = createContext();

// Proveedor de contexto para envolver la aplicación
export const DarkModeProvider = ({ children }) => {
  // Estado para almacenar si el modo oscuro está activado
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) return savedMode === 'true';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  
  // Efecto para cargar la preferencia guardada en el localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode) {
      setIsDarkMode(savedMode === 'true');
    } else {
      // Si no hay preferencia guardada, verificar si el usuario tiene una preferencia del sistema
      setIsDarkMode(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
  }, []);

  // Efecto para aplicar el modo oscuro al body y guardarlo en el localStorage
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [isDarkMode]);

  // Función para alternar entre modo oscuro y claro
  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};
