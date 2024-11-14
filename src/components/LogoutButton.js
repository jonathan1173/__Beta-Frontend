import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion"

const LogoutButton = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >

      <button onClick={handleLogout} className="bg-red-500 hover:bg-red-700 transition-colors  flex items-center space-x-2 px-3 py-2 rounded-md">
        Cerrar sesión
      </button>
    </motion.div>
  );
};

export default LogoutButton;
