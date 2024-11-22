import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ThumbsUp, ThumbsDown, Tag, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Filters from '../components/FiltersMenu';

export default function ChallengesList() {
  const [challenges, setChallenges] = useState([]);
  const [error, setError] = useState(null);
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
    } catch (err) {
      setError('No se pudieron cargar los desafíos. Inicia sesión.');
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

  if (error) return <p className="text-red-500 text-center mt-4">{error}</p>;

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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <Filters
        filters={filters}
        handleCategoryClick={handleCategoryClick}
        handleLanguageClick={handleLanguageClick}
        handleDifficultyClick={handleDifficultyClick}
        handleToggleFavorite={toggleFavorites}
        handleToggleSortbyLikes={toggleSortByLikes}
        handleRestFilter={resetFilters}
      />
      
y

      <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">Lista de Desafíos</h2>

      <motion.ul
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-4 max-w-4xl mx-auto"
      >
        {challenges.map(challenge => (
          <motion.li
            key={challenge.id}
            variants={item}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
          >
            <div className="p-6">
              <Link
                to={`/challenges/${challenge.id}`}
                className="text-xl font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
              >
                {challenge.title}
              </Link>

              <div className="mt-4 space-y-3">
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                  <span>Dificultad:</span>
                  <button
                    onClick={() => handleDifficultyClick(challenge.difficulty)}
                    className="inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <Tag className="w-4 h-4 mr-1" />
                    {challenge.difficulty}
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <span>Categorías:</span>
                  {challenge.categories?.length ? (
                    challenge.categories.map((category, index) => (
                      <button
                        key={index}
                        onClick={() => handleCategoryClick(category.name)}
                        className="inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        <Tag className="w-4 h-4 mr-1" />
                        {category.name}
                      </button>
                    ))
                  ) : (
                    <span className="text-gray-400 dark:text-gray-500">- Sin categorías -</span>
                  )}
                </div>

                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                  <span>Lenguaje:</span>
                  <button
                    onClick={() => handleLanguageClick(challenge.language)}
                    className="inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <Tag className="w-4 h-4 mr-1" />
                    {challenge.language}
                  </button>
                </div>
              </div>

              <div className="mt-6 flex items-center space-x-4">
                <button
                  onClick={() => handleAction(challenge.id, 'like')}
                  className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors
                    ${challenge.user_liked
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                >
                  <ThumbsUp className="w-4 h-4 mr-2" />
                  <span>{challenge.likes_count}</span>
                </button>

                <button
                  onClick={() => handleAction(challenge.id, 'dislike')}
                  className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors
                    ${challenge.user_disliked
                      ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                >
                  <ThumbsDown className="w-4 h-4 mr-2" />
                  <span>{challenge.dislikes_count}</span>
                </button>

                <button
                  onClick={() => handleAction(challenge.id, 'favorite')}
                  className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors
                    ${challenge.user_favorited
                      ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                >
                  <Heart className="w-4 h-4 mr-2" />
                </button>
              </div>
            </div>
          </motion.li>
        ))}
      </motion.ul>

      <div className="mt-8 flex justify-center space-x-4">
        <button
          onClick={() => fetchChallenges(pagination.previous)}
          disabled={!pagination.previous}
          className={`px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors
            ${!pagination.previous && 'opacity-50 cursor-not-allowed'}`}
        >
          <ChevronLeft className="w-4 h-4 inline-block mr-2" />
          Anterior
        </button>

        <button
          onClick={() => fetchChallenges(pagination.next)}
          disabled={!pagination.next}
          className={`px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors
            ${!pagination.next && 'opacity-50 cursor-not-allowed'}`}
        >
          Siguiente
          <ChevronRight className="w-4 h-4 inline-block ml-2" />
        </button>
      </div>
    </div>
  );
}
