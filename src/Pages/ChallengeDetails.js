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
  const [output, setOutput] = useState('');  
  const [compiling, setCompiling] = useState(false);  
  const [testResults, setTestResults] = useState(null); 
  const [testing, setTesting] = useState(false);  

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
    setCompiling(true);  
    setOutput('');  

    const token = localStorage.getItem('access_token');
    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/beta/challenges/execute/',  
        {
          language: challenge.language || 'python',  
          code: solutionCode,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setOutput(response.data.run.stdout || 'No se generó salida.');
    } catch (err) {
      setOutput('Error al ejecutar el código.');
    } finally {
      setCompiling(false);  
    }
  };

  const handleTest = async () => {
    setTesting(true);
    setTestResults(null); 

    const token = localStorage.getItem('access_token');
    try {
      const response = await axios.post(
        'http://localhost:8000/beta/challenges/code-test/',
        {
          challenge_id: id,
          solution: solutionCode,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTestResults(response.data);
    } catch (err) {
      console.error('Error al ejecutar los tests:', err);
      setTestResults({ message: 'Error al ejecutar los tests.' });
    } finally {
      setTesting(false);
    }
  };

  if (loading) return <p>Cargando desafío...</p>;
  if (error) return <p>{error}</p>;

  const isTestAvailable = ['python', 'javascript'].includes(challenge.language.toLowerCase());

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
          disabled={compiling} 
        >
          {compiling ? 'Compilando...' : 'Compilar'}
        </button>
        <p><strong>Salida:</strong></p>
        <pre>{output}</pre>

        {isTestAvailable ? (
          <button 
            onClick={handleTest}
            disabled={testing}
          >
            {testing ? 'Ejecutando Tests...' : 'Probar Código'}
          </button>
        ) : (
          <p>Tests no disponibles para este lenguaje.</p>
        )}

        {testResults && (
          <div>
            <p><strong>Resultado de los Tests:</strong> {testResults.message}</p>
            <ul>
              {testResults.test_results.map((test, index) => (
                <li key={index}>
                  <strong>{test.test_name}:</strong> {test.status === 'passed' ? '✅' : '❌'}
                  <pre>{test.output}</pre>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
};

export default ChallengeDetail;
