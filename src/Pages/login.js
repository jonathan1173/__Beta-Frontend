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
      const response = await axios.post('https://beta-api-cs50.vercel.app/beta/access/login/', {
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
    <div className="flex items-center justify-center min-h-screen bg-white dark:bg-zinc-900 transition-all duration-300">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-8 bg-zinc-50 dark:bg-zinc-800 rounded-xl shadow-lg w-full max-w-md transition-all duration-300"
      >
        <h2 className="text-3xl font-bold mb-8 text-center text-zinc-900 dark:text-white">
          Iniciar Sesión
        </h2>
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative group">
            <User className="absolute top-3.5 left-3 text-zinc-400 dark:text-zinc-500 group-hover:text-fuchsia-500 dark:group-hover:text-emerald-400 transition-colors duration-300" size={20} />
            <input
              type="text"
              placeholder="Nombre de usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-3 border-2 border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:border-fuchsia-500 dark:focus:border-emerald-400 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 transition-all duration-300 placeholder-zinc-400 dark:placeholder-zinc-500"
            />
          </div>
          <div className="relative group">
            <Lock className="absolute top-3.5 left-3 text-zinc-400 dark:text-zinc-500 group-hover:text-fuchsia-500 dark:group-hover:text-emerald-400 transition-colors duration-300" size={20} />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-3 border-2 border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:border-fuchsia-500 dark:focus:border-emerald-400 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 transition-all duration-300 placeholder-zinc-400 dark:placeholder-zinc-500"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-fuchsia-500 hover:bg-cyan-500 dark:bg-emerald-400 dark:hover:bg-fuchsia-400 text-white py-3 rounded-lg transition-all duration-300 flex items-center justify-center text-lg font-medium shadow-md hover:shadow-lg"
          >
            <LogIn className="mr-2" size={20} />
            Ingresar
          </motion.button>
        </form>
        
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 text-red-500 dark:text-red-400 text-center font-medium"
          >
            {error}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}