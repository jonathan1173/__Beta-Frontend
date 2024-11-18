import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import CodeEditor from '../services/CodeEditor';

const ChallengeDetail = () => {
  const { id } = useParams(); // Obtiene el ID del desafío desde la URL
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [solutionCode, setSolutionCode] = useState(''); // Estado para la solución
  const [testCode, setTestCode] = useState(''); // Estado para las pruebas

  useEffect(() => {
    const fetchChallenge = async () => {
      const token = localStorage.getItem('access_token');

      try {
        const response = await axios.get(
          `http://localhost:8000/beta/challenges/challenges/${id}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log('Datos recibidos:', response.data);
        setChallenge(response.data);
        setSolutionCode(response.data.solution || '');
        setTestCode(response.data.test || '');
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

  const handleTestChange = (newCode) => {
    setTestCode(newCode); // Actualiza el estado del código de la prueba
  };

  const handleSaveSolution = async () => {
    const token = localStorage.getItem('access_token');
    try {
      const response = await axios.patch(
        `http://localhost:8000/beta/challenges/challenges/${id}/`,
        {
          solution: solutionCode,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('Solución guardada:', response.data);
      // Actualiza el desafío con la solución guardada en el backend
      setChallenge((prevChallenge) => ({
        ...prevChallenge,
        solution: response.data.solution,
      }));
      
      // Alerta que se ha guardado la solución correctamente
      alert('¡Solución guardada exitosamente!');

    } catch (err) {
      console.error('Error al guardar la solución:', err);
      setError('Error al guardar la solución.');
    }
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
          language={challenge.language || 'python'}
        />
        <h2>Prueba</h2>
        <CodeEditor
          value={testCode}
          onChange={handleTestChange}
          language={challenge.language || 'python'}
        />
        <button onClick={handleSaveSolution}>Guardar Solución</button>
      </section>
    </div>
  );
};

export default ChallengeDetail;
