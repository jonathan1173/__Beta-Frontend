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
  const [testCode, setTestCode] = useState(''); // Estado para el código de prueba
  const [testResults, setTestResults] = useState(null); // Estado para los resultados de las pruebas
  const [testError, setTestError] = useState(null); // Estado para errores en la ejecución

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
        setTestCode(response.data.test || ''); // Cargar el código de prueba si está disponible
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

  const handleTestCodeChange = (newTestCode) => {
    setTestCode(newTestCode); // Actualiza el estado del código de prueba
  };

  const handleTestExecution = async () => {
    const token = localStorage.getItem('access_token');
    const language = challenge.language || 'python'; // Usa el lenguaje del desafío

    try {
      // Realiza la solicitud POST al backend con la solución, el código de prueba y el lenguaje
      const response = await axios.post(
        `http://localhost:8000/beta/challenges/challenges/${id}/execute/`,
        { solution: solutionCode, test: testCode, language: language }, // Enviar el lenguaje también
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // Actualiza los resultados de las pruebas
      if (response.data.output) {
        // Suponemos que response.data.output es un string o un array de resultados
        setTestResults(response.data.output); // Aquí esperamos que `output` contenga los resultados de las pruebas
        setTestError(null);
      } else {
        setTestError('No se recibieron resultados.');
      }
    } catch (err) {
      console.error('Error al ejecutar la solución:', err);
      setTestError('Error al ejecutar la solución. Verifique su código.');
      setTestResults(null);
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
        <div>
          <h2>Resultados de la Prueba</h2>
          {testResults ? (
            Array.isArray(testResults) ? (
              // Si testResults es un array, mostrar cada resultado en un párrafo
              testResults.map((result, index) => (
                <p className='border border-red-500 m-4' key={index}>{result}</p>
              ))
            ) : (
              <p>{testResults}</p> // Si es un solo resultado, simplemente mostrarlo
            )
          ) : (
            testError && <p className="text-red-500">{testError}</p>
          )}
        </div>
      </section>

      <section className="w-[50%]">
        <h2>Solución</h2>
        <CodeEditor
          value={solutionCode}
          onChange={handleSolutionChange}
          language={challenge.language || 'python'} // Se adapta al lenguaje del desafío
        />

        <h2>Código de Prueba</h2>
        <CodeEditor
          value={testCode}
          onChange={handleTestCodeChange}
          language={challenge.language || 'python'} // Se adapta al lenguaje del desafío
        />

        <button onClick={handleTestExecution} className="mt-4 p-2 bg-blue-500 text-white">
          Ejecutar Pruebas
        </button>
      </section>
    </div>
  );
};

export default ChallengeDetail;
