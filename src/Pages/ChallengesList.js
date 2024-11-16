'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ThumbsUp, ThumbsDown, Tag, Heart } from 'lucide-react';
import Filters from '../components/FiltersMenu';

const ChallengesList = () => {
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
      <ul>
        {challenges.map(challenge => (
          <li className="m-7 border border-sky-400" key={challenge.id}>
            <Link to={`/challenges/${challenge.id}`}>{challenge.title}</Link>

            <div className="text-gray-600">
              <div className="flex items-center space-x-2">
                <span>Categorías:</span>
                {challenge.categories?.length ? (
                  challenge.categories.map((category, index) => (
                    <span
                      key={index}
                      className="flex items-center space-x-1 rounded-md bg-slate-500 p-1 border border-black cursor-pointer"
                      onClick={() => handleCategoryClick(category.name)}
                    >
                      <Tag className="text-black" />
                      <span className="text-black">{category.name}</span>
                    </span>
                  ))
                ) : (
                  '- Sin categorías -'
                )}
              </div>

              <div className="flex items-center space-x-2">
                <span>Dificultad:</span>
                <span
                  className="flex items-center space-x-1 rounded-md bg-slate-500 p-1 border border-black cursor-pointer"
                  onClick={() => handleDifficultyClick(challenge.difficulty)}
                >
                  <Tag className="text-black" />
                  <span className="text-black">{challenge.difficulty}</span>
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <span>Lenguaje:</span>
                <span
                  className="flex items-center space-x-1 rounded-md bg-slate-500 p-1 border border-black cursor-pointer"
                  onClick={() => handleLanguageClick(challenge.language)}
                >
                  <Tag className="text-black" />
                  <span className="text-black">{challenge.language}</span>
                </span>
              </div>
            </div>

            <div className="flex space-x-4">
              <button onClick={() => handleAction(challenge.id, 'like')}>
                <ThumbsUp className={challenge.user_liked ? 'text-blue-500' : ''} />
                <span>{challenge.likes_count}</span>
              </button>

              <button onClick={() => handleAction(challenge.id, 'dislike')}>
                <ThumbsDown className={challenge.user_disliked ? 'text-red-500' : ''} />
                <span>{challenge.dislikes_count}</span>
              </button>

              <button onClick={() => handleAction(challenge.id, 'favorite')}>
                <Heart className={challenge.user_favorited ? 'text-yellow-500' : ''} />
                <span>{challenge.user_favorited ? 'Favorito' : 'Agregar a Favoritos'}</span>
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Botones de paginación */}
      <div className="pagination-buttons flex justify-between mt-4">
        {pagination.previous && (
          <button onClick={() => fetchChallenges(pagination.previous)} className="m-2 p-2 bg-blue-500 text-white rounded">
            Página Anterior
          </button>
        )}
        {pagination.next && (
          <button onClick={() => fetchChallenges(pagination.next)} className="m-2 p-2 bg-blue-500 text-white rounded">
            Página Siguiente
          </button>
        )}
      </div>
    </div>
  );
};

export default ChallengesList;
