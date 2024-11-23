import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Code2, 
  PlayCircle, 
  Save, 
  MessageSquare, 
  Info, 
  ThumbsUp, 
  ThumbsDown,
  Tag,
  Loader,
  CheckCircle2,
  XCircle,
  Trophy
} from 'lucide-react';
import CodeEditor from '../services/CodeEditor';
import ChallengeComments from '../components/ChallengeComments';

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
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    const fetchChallenge = async () => {
      const token = localStorage.getItem('access_token');
      try {
        const response = await axios.get(
          `https://beta-api-cs50.vercel.app/beta/challenges/challenges/${id}/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setChallenge(response.data);
        setSolutionCode(response.data.solution || '');
      } catch (err) {
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
        'https://beta-api-cs50.vercel.app/beta/challenges/execute/',
        {
          language: challenge.language || 'python',
          code: solutionCode,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
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
        'https://beta-api-cs50.vercel.app/beta/challenges/code-test/',
        {
          challenge_id: id,
          solution: solutionCode,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTestResults(response.data);
    } catch (err) {
      setTestResults({ message: 'Error al ejecutar los tests.' });
    } finally {
      setTesting(false);
    }
  };

  const handleSaveSolution = async () => {
    setSaving(true);
    const token = localStorage.getItem('access_token');
    try {
      await axios.post(
        `https://beta-api-cs50.vercel.app/beta/challenges/challenges/${id}/save-solution/`,
        { solution: solutionCode },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert('¡Solución guardada exitosamente!');
    } catch (err) {
      alert('Hubo un error al guardar la solución.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-zinc-900">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader className="w-12 h-12 text-fuchsia-500 dark:text-emerald-400" />
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-zinc-900">
        <p className="text-red-500 dark:text-red-400 text-xl font-medium">{error}</p>
      </div>
    );
  }

  const isTestAvailable = ['python', 'javascript'].includes(challenge.language.toLowerCase());

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 p-4 md:p-6">
      <div className="flex flex-col lg:flex-row gap-4 md:gap-6 max-w-7xl mx-auto">
        {/* Left Panel */}
        <div className="w-full lg:w-1/2 space-y-4 md:space-y-6">
          {/* Tab Buttons */}
          <div className="flex gap-2 md:gap-4 mb-4 md:mb-6 overflow-x-auto pb-2 md:pb-0">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab('details')}
              className={`flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 rounded-lg text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                activeTab === 'details'
                  ? 'bg-fuchsia-100 text-fuchsia-700 dark:bg-emerald-900/50 dark:text-emerald-300'
                  : 'bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200'
              }`}
            >
              <Info className="w-4 h-4" />
              Detalles
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab('comments')}
              className={`flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 rounded-lg text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                activeTab === 'comments'
                  ? 'bg-fuchsia-100 text-fuchsia-700 dark:bg-emerald-900/50 dark:text-emerald-300'
                  : 'bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              Comentarios
            </motion.button>
          </div>

          {/* Content Panels */}
          <AnimatePresence mode="wait">
            {activeTab === 'details' ? (
              <motion.div
                key="details"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-zinc-300 dark:bg-zinc-800 rounded-xl p-4 md:p-6 shadow-lg"
              >
                <h1 className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-white mb-4 md:mb-6">
                  {challenge.title}
                </h1>
                
                <div className="space-y-4">
                  <p className="text-sm md:text-base text-zinc-700 dark:text-zinc-300">
                    <strong className="text-zinc-900 dark:text-white">Descripción:</strong> {challenge.description}
                  </p>
                  
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-fuchsia-500 dark:text-emerald-400" />
                    <span className="text-sm md:text-base text-zinc-700 dark:text-zinc-300">
                      <strong className="text-zinc-900 dark:text-white">Dificultad:</strong> {challenge.difficulty}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-fuchsia-500 dark:text-emerald-400" />
                    <span className="text-sm md:text-base text-zinc-700 dark:text-zinc-300">
                      <strong className="text-zinc-900 dark:text-white">Lenguaje:</strong> {challenge.language}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <Trophy className="w-4 h-4 text-fuchsia-500 dark:text-emerald-400" />
                    <span className="text-sm md:text-base text-zinc-700 dark:text-zinc-300">
                      <strong className="text-zinc-900 dark:text-white">Categorías:</strong>
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {challenge.categories.map(cat => (
                        <span key={cat.name} className="px-3 py-1 rounded-full text-xs font-medium bg-white dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300">
                          {cat.name}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <ThumbsUp className="w-4 h-4 text-fuchsia-500 dark:text-emerald-400" />
                      <span className="text-sm md:text-base text-zinc-700 dark:text-zinc-300">{challenge.likes_count}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ThumbsDown className="w-4 h-4 text-red-500 dark:text-red-400" />
                      <span className="text-sm md:text-base text-zinc-700 dark:text-zinc-300">{challenge.dislikes_count}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="comments"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-zinc-300 dark:bg-zinc-800 rounded-xl p-4 md:p-6 shadow-lg"
              >
                <ChallengeComments challengeId={id} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        
        <div className="w-full lg:w-1/2 space-y-4 md:space-y-6">
          <div className="bg-zinc-300 dark:bg-zinc-800 rounded-xl p-4 md:p-6 shadow-lg">
            <h2 className="text-lg md:text-xl font-bold text-zinc-900 dark:text-white mb-4">Solución</h2>
            
            <div className="mb-4">
              <CodeEditor
                value={solutionCode}
                onChange={handleSolutionChange}
                language={challenge.language || 'python'}
              />
            </div>

            <div className="flex flex-wrap gap-2 md:gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCompile}
                disabled={compiling}
                className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium bg-fuchsia-500 hover:bg-fuchsia-600 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white transition-all duration-300 disabled:opacity-50"
              >
                <PlayCircle className="w-4 h-4" />
                {compiling ? 'Compilando...' : 'Compilar'}
              </motion.button>

              {isTestAvailable && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleTest}
                  disabled={testing}
                  className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium bg-cyan-500 hover:bg-cyan-600 dark:bg-fuchsia-500 dark:hover:bg-fuchsia-600 text-white transition-all duration-300 disabled:opacity-50"
                >
                  <PlayCircle className="w-4 h-4" />
                  {testing ? 'Ejecutando...' : 'Probar'}
                </motion.button>
              )}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSaveSolution}
                disabled={saving}
                className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-zinc-800 dark:text-zinc-200 transition-all duration-300 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Guardando...' : 'Guardar'}
              </motion.button>
            </div>

            {output && (
              <div className="mt-4 md:mt-6 p-3 md:p-4 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-700">
                <h3 className="text-base md:text-lg font-medium text-zinc-900 dark:text-white mb-2">Salida:</h3>
                <pre className="text-xs md:text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap overflow-x-auto">{output}</pre>
              </div>
            )}

{testResults && (
              <div className="mt-4 md:mt-6 p-3 md:p-4 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-700">
                <h3 className="text-base md:text-lg font-medium text-zinc-900 dark:text-white mb-2">
                  Resultado de los Tests:
                </h3>
                <p className="text-sm md:text-base text-zinc-700 dark:text-zinc-300 mb-4">{testResults.message}</p>
                <ul className="space-y-4">
                  {testResults.test_results.map((test, index) => (
                    <li key={index} className="flex items-start gap-3">
                      {test.status === 'passed' ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                      )}
                      <div className="min-w-0 flex-1"> 
                        <strong className="text-sm md:text-base text-zinc-900 dark:text-white block truncate">
                          {test.test_name}
                        </strong>
                        <div className="mt-2 relative">
                          <pre className="text-xs md:text-sm text-zinc-700 dark:text-zinc-300 bg-zinc-300 dark:bg-zinc-800 p-2 rounded w-full overflow-x-auto">
                            {test.output}
                          </pre>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
               < p className='mt-4 md:mt-6 p-3 md:p-4 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-700 text-sm md:text-base text-zinc-700 dark:text-zinc-300 mb-4'> puntos obtenidos {testResults.points_awarded}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengeDetail;