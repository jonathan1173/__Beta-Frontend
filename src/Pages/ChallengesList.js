import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ThumbsUp, ThumbsDown, Tag, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import Filters from '../components/FiltersMenu';

export default function ChallengesList() {
  const [challenges, setChallenges] = useState([]);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ next: null, previous: null });
  const [filters, setFilters] = useState({
    category: '',
    difficulty: '',
    language: '',
    favorites: false,
    sort_by_likes: false,
  });

  // Usamos useCallback para memorizar la función fetchChallenges
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
  }, [filters]); // La función depende de filters

  useEffect(() => {
    fetchChallenges();
  }, [filters, fetchChallenges]); // Añadimos fetchChallenges como dependencia

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

  if (error) return <p>{error}</p>;

  return (
    <div>
      <Filters
         filters={filters} 
        handleCategoryClick={handleCategoryClick}
        handleLanguageClick={handleLanguageClick}
        handleDifficultyClick={handleDifficultyClick}
        handleToggleFavorite={toggleFavorites}
        handleToggleSortbyLikes={toggleSortByLikes}
      />
      <div>
        <button onClick={toggleFavorites}>
          {filters.favorites ? 'Ver Todos' : 'Ver Favoritos'}
        </button>
        <button onClick={toggleSortByLikes}>
          {filters.sort_by_likes ? 'Ordenar por Relevancia' : 'Ordenar por Likes'}
        </button>
      </div>
      <h2>Lista de Desafíos</h2>
      <ul>
        {challenges.map(challenge => (
          <li key={challenge.id} className="m-10 border border-red-100">
            <div>
              <Link to={`/challenges/${challenge.id}`}>
                {challenge.title}
              </Link>
              <div>
                <span>Dificultad:</span>
                <span onClick={() => handleDifficultyClick(challenge.difficulty)}>
                  <Tag />
                  {challenge.difficulty}
                </span>
              </div>
              <div>
                <div>
                  <span>Categorías:</span>
                  {challenge.categories?.length ? (
                    challenge.categories.map((category, index) => (
                      <span key={index} onClick={() => handleCategoryClick(category.name)}>
                        <Tag />
                        {category.name}
                      </span>
                    ))
                  ) : (
                    '- Sin categorías -'
                  )}
                </div>
                <div>
                  <span>Lenguaje:</span>
                  <span onClick={() => handleLanguageClick(challenge.language)}>
                    <Tag />
                    {challenge.language}
                  </span>
                </div>
              </div>
              <div>
                <button onClick={() => handleAction(challenge.id, 'like')} 
                className={challenge.user_liked ? 'bg-blue-500' : 'btn'}>
                  <ThumbsUp />
                  <span>{challenge.likes_count}</span>
                </button>
                <button onClick={() => handleAction(challenge.id, 'dislike')}
                  className={challenge.user_disliked ? 'bg-red-500' : 'btn'}
                  >
                  <ThumbsDown />
                  <span>{challenge.dislikes_count}</span>
                </button>
                <button onClick={() => handleAction(challenge.id, 'favorite')} className={challenge.user_favorited ? 'bg-yellow-500' : 'btn'}>
                  <Heart />
                  <span>{challenge.user_favorited ? 'Favorito' : 'Agregar a Favoritos'}
                  
                  </span>
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div>
        {pagination.previous && (
          <button onClick={() => fetchChallenges(pagination.previous)}>
            <ChevronLeft />
            Página Anterior
          </button>
        )}
        {pagination.next && (
          <button onClick={() => fetchChallenges(pagination.next)}>
            Página Siguiente
            <ChevronRight />
          </button>
        )}
      </div>
    </div>
  );
}
