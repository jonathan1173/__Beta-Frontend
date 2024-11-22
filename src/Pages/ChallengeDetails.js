import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import CodeEditor from '../services/CodeEditor'; // Asegúrate de tener este componente

const ChallengeDetail = () => {
  const { id } = useParams(); // Obtiene el ID del desafío desde la URL
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [solutionCode, setSolutionCode] = useState(''); // Estado para la solución

  useEffect(() => {
    const fetchChallenge = async () => {
      const token = localStorage.getItem('access_token');

      try {
        const response = await axios.get(
          `http://localhost:8000/beta/challenges/challenges/${id}/`, // Asegúrate de que la URL es correcta
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log('Datos recibidos:', response.data);
        setChallenge(response.data);
        setSolutionCode(response.data.solution || ''); // Cargar el código de la solución si está disponible
      } catch (err) {
        console.error('Error:', err);
        setError('Error al cargar el desafío.');
      } finally {
        setLoading(false);
      }
    };

    fetchChallenge();
  }, [id]);

  const handleSolutionChange = (newCode) => {
    setSolutionCode(newCode); // Actualiza el estado del código de la solución
  };

  if (loading) return <p>Cargando desafío...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="flex">
      <section className="w-[50%]">
        <h1>{challenge.title}</h1>
        <p><strong>Descripción:</strong> {challenge.description}</p>
        <p><strong>Dificultad:</strong> {challenge.difficulty}</p>
        <p><strong>Lenguaje:</strong> {challenge.language}</p>
        <p><strong>Categorías:</strong> {challenge.categories.map(cat => cat.name).join(', ')}</p>
        <p><strong>Likes:</strong> {challenge.likes_count}</p>
        <p><strong>Dislikes:</strong> {challenge.dislikes_count}</p>
      </section>

      <section className="w-[50%]">
        <h2>Solución</h2>
        <CodeEditor
          value={solutionCode}
          onChange={handleSolutionChange}
          language={challenge.language || 'python'} // Se adapta al lenguaje del desafío
        />
      </section>
    </div>
  );
};

export default ChallengeDetail;
