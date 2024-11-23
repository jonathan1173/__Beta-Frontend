import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Medal, Crown, Loader2, AlertCircle, Users } from "lucide-react";

const TopUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopUsers = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setError("No se encontró el token de acceso");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get("https://beta-api-cs50.vercel.app/beta/access/top-users/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(response.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Error al cargar los datos o no autorizado");
        setLoading(false);
      }
    };

    fetchTopUsers();
    const interval = setInterval(fetchTopUsers, 10000);
    return () => clearInterval(interval);
  }, []);

  const getRankIcon = (index) => {
    switch (index) {
      case 0:
        return <Crown className="h-6 w-6 text-yellow-400" />;
      case 1:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 2:
        return <Medal className="h-6 w-6 text-amber-600" />;
      default:
        return <Trophy className="h-6 w-6 text-fuchsia-500 dark:text-emerald-400" />;
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center p-8 rounded-lg bg-white dark:bg-zinc-900 shadow-lg"
      >
        <Loader2 className="h-8 w-8 text-fuchsia-500 dark:text-emerald-400 animate-spin" />
        <p className="mt-4 text-zinc-600 dark:text-zinc-400">Cargando usuarios...</p>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center p-8 rounded-lg bg-white dark:bg-zinc-900 shadow-lg"
      >
        <AlertCircle className="h-8 w-8 text-red-500" />
        <p className="mt-4 text-red-500">{error}</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto p-6 rounded-xl bg-white dark:bg-zinc-900 shadow-lg"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Users className="h-7 w-7 text-fuchsia-500 dark:text-emerald-400" />
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
            Top Usuarios
          </h2>
        </div>
        <Trophy className="h-6 w-6 text-fuchsia-500 dark:text-emerald-400" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="space-y-3"
        >
          {users.map((user, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 rounded-lg bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-8">
                  {getRankIcon(index)}
                </div>
                <span className="font-medium text-zinc-900 dark:text-white">
                  {user.username}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-fuchsia-100 dark:bg-emerald-900/30 text-fuchsia-600 dark:text-emerald-400 font-semibold">
                  {user.points} pts
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default TopUsers;