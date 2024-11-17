'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Filter, ChevronDown } from 'lucide-react';

const FiltersMenu = ({
    handleCategoryClick,
    handleLanguageClick,
    handleDifficultyClick,
}) => {
    const [categories, setCategories] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [difficulties, setDifficulties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFilterOptions = async () => {
            try {
                setLoading(true);
                setError(null);  
                const token = localStorage.getItem('access_token');
                const response = await axios.get(`http://localhost:8000/beta/challenges/filters/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const { categories, languages, difficulties } = response.data.filters || {};
                setCategories(categories || []);
                setLanguages(languages || []);
                setDifficulties(difficulties || []);
            } catch (err) {
                setError('Error al cargar las opciones de filtro');
            } finally {
                setLoading(false);
            }
        };

        fetchFilterOptions();
    }, []);

    if (loading) return (
        <div className="flex justify-center items-center h-20 text-gray-600 dark:text-gray-300">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
                <Filter className="w-6 h-6" />
            </motion.div>
            <span className="ml-2">Cargando...</span>
        </div>
    );

    if (error) return (
        <div className="text-red-500 dark:text-red-400 text-center py-4">
            {error}
        </div>
    );

    const selectClass = "appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 transition-colors duration-200";

    return (
        <motion.div 
            className="flex flex-wrap gap-4 py-6 px-4 border border-black bg-gray-200 dark:bg-gray-700 rounded-lg shadow-md"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="relative">
                <select
                    onChange={(e) => handleCategoryClick(e.target.value)}
                    className={selectClass}
                >
                    <option value="">Todas las Categorías</option>
                    {categories.map((category) => (
                        <option key={category.name} value={category.name}>
                            {category.name}
                        </option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-200">
                    <ChevronDown className="w-4 h-4" />
                </div>
            </div>

            <div className="relative">
                <select
                    onChange={(e) => handleLanguageClick(e.target.value)}
                    className={selectClass}
                >
                    <option value="">Todos los Lenguajes</option>
                    {languages.map((language) => (
                        <option key={language.name} value={language.name}>
                            {language.name}
                        </option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-200">
                    <ChevronDown className="w-4 h-4" />
                </div>
            </div>

            <div className="relative">
                <select
                    onChange={(e) => handleDifficultyClick(e.target.value)}
                    className={selectClass}
                >
                    <option value="">Todas las Dificultades</option>
                    {difficulties.map((difficulty) => (
                        <option key={difficulty.grado} value={difficulty.grado}>
                            {difficulty.grado}
                        </option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-200">
                    <ChevronDown className="w-4 h-4" />
                </div>
            </div>
        </motion.div>
    );
};

export default FiltersMenu; 