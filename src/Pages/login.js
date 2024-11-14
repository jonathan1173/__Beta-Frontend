import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { User, Lock, LogIn } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/beta/access/login/', {
        username,
        password,
      });
      const { access, refresh } = response.data;

      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);

      login();

      setError(null);
      navigate('/dashboard');
    } catch (error) {
      setError('Credenciales incorrectas');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md w-full max-w-md transition-colors duration-300"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-200">Iniciar Sesión</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <User className="absolute top-3 left-3 text-gray-400 dark:text-gray-500" size={20} />
            <input
              type="text"
              placeholder="Nombre de usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-300"
            />
          </div>
          <div className="relative">
            <Lock className="absolute top-3 left-3 text-gray-400 dark:text-gray-500" size={20} />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-300"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-blue-500 dark:bg-blue-600 text-white py-2 rounded-md hover:bg-blue-600 dark:hover:bg-blue-700 transition duration-300 flex items-center justify-center"
          >
            <LogIn className="mr-2" size={20} />
            Ingresar
          </motion.button>
        </form>
        
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 text-red-500 dark:text-red-400 text-center"
          >
            {error}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}