import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import CodeEditor from '../services/CodeEditor';

const ChallengeDetail = () => {
  const { id } = useParams();
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [solutionCode, setSolutionCode] = useState('');
  const [output, setOutput] = useState('');  // Para mostrar la salida de la ejecución
  const [compiling, setCompiling] = useState(false);  // Para saber si está en proceso de compilación

  useEffect(() => {
    const fetchChallenge = async () => {
      const token = localStorage.getItem('access_token');

      try {
        const response = await axios.get(
          `https://beta-api-cs50.vercel.app/beta/challenges/challenges/${id}/`, 
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log('Datos recibidos:', response.data);
        setChallenge(response.data);
        setSolutionCode(response.data.solution || '');
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
    setSolutionCode(newCode);
  };

  const handleCompile = async () => {
    setCompiling(true);  // Comienza el proceso de compilación
    setOutput('');  // Limpiar cualquier salida previa

    const token = localStorage.getItem('access_token');
    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/beta/challenges/execute/',  // URL del backend
        {
          language: challenge.language || 'python',  // Si no tiene lenguaje, por defecto 'python'
          code: solutionCode,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('Respuesta de la ejecución:', response.data);
      setOutput(response.data.run.stdout || 'No se generó salida.');
    } catch (err) {
      console.error('Error al ejecutar el código:', err);
      setOutput('Error al ejecutar el código.');
    } finally {
      setCompiling(false);  // Termina el proceso de compilación
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
        <button 
          onClick={handleCompile}
          disabled={compiling} // Desactiva el botón mientras se compila
        >
          {compiling ? 'Compilando...' : 'Compilar'}
        </button>
        <p><strong>Salida:</strong></p>
        <pre>{output}</pre>
      </section>
    </div>
  );
};

export default ChallengeDetail;
