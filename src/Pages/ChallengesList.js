'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ThumbsUp, ThumbsDown, Tag, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import Filters from '../components/FiltersMenu';
import { motion } from 'framer-motion';

export default function ChallengesList() {
  const [challenges, setChallenges] = useState([]);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ next: null, previous: null });

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async (
    url = 'http://localhost:8000/beta/challenges/challenges/',
    category = '',
    difficulty = '',
    language = ''
  ) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
        params: { category, difficulty, language },
      });

      console.log("Response from API:", response.data);
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
  };

  const handleAction = async (challengeId, action) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.post(
        `http://localhost:8000/beta/challenges/challenges/${challengeId}/action/${action}/`,
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
    fetchChallenges('http://localhost:8000/beta/challenges/challenges/', category);
  };

  const handleDifficultyClick = (difficulty) => {
    fetchChallenges('http://localhost:8000/beta/challenges/challenges/', '', difficulty);
  };

  const handleLanguageClick = (language) => {
    fetchChallenges('http://localhost:8000/beta/challenges/challenges/', '', '', language);
  };

  if (error) return <p>{error}</p>;

  return (
    <div>
      <Filters
        handleCategoryClick={handleCategoryClick}
        handleLanguageClick={handleLanguageClick}
        handleDifficultyClick={handleDifficultyClick}
      />
      <h2>Lista de Desafíos</h2>
      <ul >

        {challenges.map(challenge => (
          <motion.li
            key={challenge.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className='m-10 border border-white'>
              <Link to={`/challenges/${challenge.id}`}>
                {challenge.title}
              </Link>
              <div>
                <span>Dificultad:</span>
                <motion.span
                  onClick={() => handleDifficultyClick(challenge.difficulty)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Tag />
                  {challenge.difficulty}
                </motion.span>
              </div>
              <div>
                <div>
                  <span>Categorías:</span>
                  {challenge.categories?.length ? (
                    challenge.categories.map((category, index) => (
                      <motion.span
                        key={index}
                        onClick={() => handleCategoryClick(category.name)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Tag />
                        {category.name}
                      </motion.span>
                    ))
                  ) : (
                    '- Sin categorías -'
                  )}
                </div>



                <div>
                  <span>Lenguaje:</span>
                  <motion.span
                    onClick={() => handleLanguageClick(challenge.language)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Tag />
                    {challenge.language}
                  </motion.span>
                </div>
              </div>

              <div>
                <motion.button
                  onClick={() => handleAction(challenge.id, 'like')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ThumbsUp />
                  <span>{challenge.likes_count}</span>
                </motion.button>

                <motion.button
                  onClick={() => handleAction(challenge.id, 'dislike')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ThumbsDown />
                  <span>{challenge.dislikes_count}</span>
                </motion.button>

                <motion.button
                  onClick={() => handleAction(challenge.id, 'favorite')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Heart />
                  <span>{challenge.user_favorited ? 'Favorito' : 'Agregar a Favoritos'}</span>
                </motion.button>
              </div>
            </div>
          </motion.li>
        ))}
      </ul>

      <div>
        {pagination.previous && (
          <motion.button
            onClick={() => fetchChallenges(pagination.previous)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronLeft />
            Página Anterior
          </motion.button>
        )}
        {pagination.next && (
          <motion.button
            onClick={() => fetchChallenges(pagination.next)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Página Siguiente
            <ChevronRight />
          </motion.button>
        )}
      </div>
    </div>
  );
}
