import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ThumbsUp, ThumbsDown, Tag, Heart, ChevronLeft, ChevronRight, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Filters from '../components/FiltersMenu';

export default function ChallengesList() {
  const [challenges, setChallenges] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ next: null, previous: null });
  const resetFilters = () => {
    setFilters({
      category: '',
      difficulty: '',
      language: '',
      favorites: false,
      sort_by_likes: false,
    });
  };
  const [filters, setFilters] = useState({
    category: '',
    difficulty: '',
    language: '',
    favorites: false,
    sort_by_likes: false,
  });

  const fetchChallenges = useCallback(async (url = 'https://beta-api-cs50.vercel.app/beta/challenges/challenges/') => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          category: filters.category,
          difficulty: filters.difficulty,
          language: filters.language,
          favorites: filters.favorites ? 'true' : undefined,
          sort_by_likes: filters.sort_by_likes ? 'true' : undefined,
        },
      });

      setChallenges(
        response.data.results.map(challenge => ({
          ...challenge,
          likes_count: challenge.likes_count || 0,
          dislikes_count: challenge.dislikes_count || 0,
          user_liked: challenge.user_liked || false,
          user_disliked: challenge.user_disliked || false,
          user_favorited: challenge.user_favorited || false,
        }))
      );

      setPagination({
        next: response.data.next,
        previous: response.data.previous,
      });
      setError(null);
    } catch (err) {
      setError('No se pudieron cargar los desafíos. Inicia sesión.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchChallenges();
  }, [filters, fetchChallenges]);

  const handleAction = async (challengeId, action) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.post(
        `https://beta-api-cs50.vercel.app/beta/challenges/challenges/${challengeId}/action/${action}/`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setChallenges(prevChallenges =>
        prevChallenges.map(challenge => {
          if (challenge.id === challengeId) {
            const { user_liked, user_disliked, user_favorited, likes_count, dislikes_count } = response.data;
            return { ...challenge, user_liked, user_disliked, user_favorited, likes_count, dislikes_count };
          }
          return challenge;
        })
      );
    } catch (err) {
      setError('No se pudo realizar la acción.');
    }
  };

  const handleCategoryClick = (category) => {
    setFilters(prev => ({ ...prev, category }));
  };

  const handleDifficultyClick = (difficulty) => {
    setFilters(prev => ({ ...prev, difficulty }));
  };

  const handleLanguageClick = (language) => {
    setFilters(prev => ({ ...prev, language }));
  };

  const toggleFavorites = () => {
    setFilters(prev => ({ ...prev, favorites: !prev.favorites }));
  };

  const toggleSortByLikes = () => {
    setFilters(prev => ({ ...prev, sort_by_likes: !prev.sort_by_likes }));
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center min-h-[50vh]"
      >
        <p className="text-red-500 dark:text-red-400 text-lg font-medium">{error}</p>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 p-6 transition-colors duration-300">
      <Filters
        filters={filters}
        handleCategoryClick={handleCategoryClick}
        handleLanguageClick={handleLanguageClick}
        handleDifficultyClick={handleDifficultyClick}
        handleToggleFavorite={toggleFavorites}
        handleToggleSortbyLikes={toggleSortByLikes}
        handleRestFilter={resetFilters}
      />

      <h2 className="text-3xl font-bold text-center text-zinc-900 dark:text-white mb-8">
        Lista de Desafíos
      </h2>

      {loading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center min-h-[50vh] space-y-4"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Loader className="w-8 h-8 text-fuchsia-500 dark:text-emerald-400" />
          </motion.div>
          <p className="text-zinc-600 dark:text-zinc-400 text-lg font-medium">
            Cargando desafíos...
          </p>
        </motion.div>
      ) : (
        <AnimatePresence>
          <motion.ul
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-6 max-w-4xl mx-auto"
          >
            {challenges.map(challenge => (
              <motion.li
                key={challenge.id}
                variants={item}
                className="bg-zinc-300 dark:bg-zinc-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="p-6">
                  <Link
                    to={`/challenges/${challenge.id}`}
                    className="text-xl font-bold text-zinc-900 dark:text-white hover:text-fuchsia-500 dark:hover:text-emerald-400 transition-colors duration-300"
                  >
                    {challenge.title}
                  </Link>

                  <div className="mt-4 space-y-4">
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="text-zinc-600 dark:text-zinc-400">Dificultad:</span>
                      <button
                        onClick={() => handleDifficultyClick(challenge.difficulty)}
                        className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 hover:bg-fuchsia-50 dark:hover:bg-emerald-900/30 border-2 border-zinc-200 dark:border-zinc-700 transition-all duration-300"
                      >
                        <Tag className="w-4 h-4 mr-2 text-fuchsia-500 dark:text-emerald-400" />
                        {challenge.difficulty}
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2 text-sm">
                      <span className="text-zinc-600 dark:text-zinc-400">Categorías:</span>
                      {challenge.categories?.length ? (
                        challenge.categories.map((category, index) => (
                          <button
                            key={index}
                            onClick={() => handleCategoryClick(category.name)}
                            className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 hover:bg-fuchsia-50 dark:hover:bg-emerald-900/30 border-2 border-zinc-200 dark:border-zinc-700 transition-all duration-300"
                          >
                            <Tag className="w-4 h-4 mr-2 text-fuchsia-500 dark:text-emerald-400" />
                            {category.name}
                          </button>
                        ))
                      ) : (
                        <span className="text-zinc-400 dark:text-zinc-500">- Sin categorías -</span>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 text-sm">
                      <span className="text-zinc-600 dark:text-zinc-400">Lenguaje:</span>
                      <button
                        onClick={() => handleLanguageClick(challenge.language)}
                        className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 hover:bg-fuchsia-50 dark:hover:bg-emerald-900/30 border-2 border-zinc-200 dark:border-zinc-700 transition-all duration-300"
                      >
                        <Tag className="w-4 h-4 mr-2 text-fuchsia-500 dark:text-emerald-400" />
                        {challenge.language}
                      </button>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center space-x-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleAction(challenge.id, 'like')}
                      className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
                        ${challenge.user_liked
                          ? 'bg-fuchsia-100 text-fuchsia-700 dark:bg-emerald-900/50 dark:text-emerald-300'
                          : 'bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 hover:bg-fuchsia-50 dark:hover:bg-emerald-900/30'
                        } border-2 border-zinc-200 dark:border-zinc-700`}
                    >
                      <ThumbsUp className="w-4 h-4 mr-2" />
                      <span>{challenge.likes_count}</span>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleAction(challenge.id, 'dislike')}
                      className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
                        ${challenge.user_disliked
                          ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300'
                          : 'bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 hover:bg-red-50 dark:hover:bg-red-900/30'
                        } border-2 border-zinc-200 dark:border-zinc-700`}
                    >
                      <ThumbsDown className="w-4 h-4 mr-2" />
                      <span>{challenge.dislikes_count}</span>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleAction(challenge.id, 'favorite')}
                      className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
                        ${challenge.user_favorited
                          ? 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/50 dark:text-cyan-300'
                          : 'bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 hover:bg-cyan-50 dark:hover:bg-cyan-900/30'
                        } border-2 border-zinc-200 dark:border-zinc-700`}
                    >
                      <Heart className="w-4 h-4 mr-2" />
                      <span>Favorito</span>
                    </motion.button>
                  </div>
                </div>
              </motion.li>
            ))}
          </motion.ul>
        </AnimatePresence>
      )}

      <div className="mt-8 flex justify-center space-x-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => fetchChallenges(pagination.previous)}
          disabled={!pagination.previous || loading}
          className={`px-6 py-2.5 rounded-lg text-sm font-medium bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-fuchsia-50 dark:hover:bg-emerald-900/30 transition-all duration-300 border-2 border-zinc-200 dark:border-zinc-700 flex items-center
            ${(!pagination.previous || loading) && 'opacity-50 cursor-not-allowed hover:bg-white dark:hover:bg-zinc-800'}`}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Anterior
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => fetchChallenges(pagination.next)}
          disabled={!pagination.next || loading}
          className={`px-6 py-2.5 rounded-lg text-sm font-medium bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-fuchsia-50 dark:hover:bg-emerald-900/30 transition-all duration-300 border-2 border-zinc-200 dark:border-zinc-700 flex items-center
            ${(!pagination.next || loading) && 'opacity-50 cursor-not-allowed hover:bg-white dark:hover:bg-zinc-800'}`}
        >
          Siguiente
          <ChevronRight className="w-4 h-4 ml-2" />
        </motion.button>
      </div>
    </div>
  );
}