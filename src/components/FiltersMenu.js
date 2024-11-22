import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Filter, ChevronDown, Star, ThumbsUp, Loader2, XCircle } from 'lucide-react';

const FiltersMenu = ({
    handleCategoryClick,
    handleLanguageClick,
    handleDifficultyClick,
    handleToggleFavorite,
    handleToggleSortbyLikes,
    filters,
    handleRestFilter
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
                const token = localStorage.getItem('access_token');
                const response = await axios.get(`https://beta-api-cs50.vercel.app/beta/challenges/filters/`, {
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

    if (loading) {
        return (
            <div className="flex items-center justify-center p-4 text-gray-600 dark:text-gray-300">
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                <span>Cargando...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-red-500 dark:text-red-400 text-center py-4">
                {error}
            </div>
        );
    }

    return (
        <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-800 p-4 shadow-md"
        >
            <div className="flex justify-center space-y-4 md:flex-row md:space-y-0 md:space-x-4">
                <SelectFilter
                    options={categories}
                    onChange={handleCategoryClick}
                    placeholder="Todas las Categorías"
                    icon={<Filter className="w-5 h-5" />}
                />
                <SelectFilter
                    options={languages}
                    onChange={handleLanguageClick}
                    placeholder="Todos los Lenguajes"
                    icon={<ChevronDown className="w-5 h-5" />}
                />
                <SelectFilter
                    options={difficulties}
                    onChange={handleDifficultyClick}
                    placeholder="Todas las Dificultades"
                    icon={<ChevronDown className="w-5 h-5" />}
                />
                <ToggleButton
                    onClick={handleToggleFavorite}
                    active={filters.favorites}
                    icon={<Star className="w-5 h-5" />}
                    activeText="Ver Todos"
                    inactiveText="Ver Favoritos"
                />
                <ToggleButton
                    onClick={handleToggleSortbyLikes}
                    active={filters.sort_by_likes}
                    icon={<ThumbsUp className="w-5 h-5" />}
                    activeText="Ordenar por Relevancia"
                    inactiveText="Ordenar por Likes"
                />
                
                {/* Botón de reset */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleRestFilter}
                    className="flex items-center px-4 py-2 rounded-full text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                    <XCircle className="w-5 h-5 mr-2" />
                    Restablecer Filtros
                </motion.button>
            </div>
        </motion.div>
    );
};

const SelectFilter = ({ options, onChange, placeholder, icon }) => (
    <div className="relative">
        <select
            onChange={(e) => onChange(e.target.value)}
            className="appearance-none w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white dark:focus:bg-gray-600 focus:border-gray-500 dark:focus:border-gray-500"
        >
            <option value="">{placeholder}</option>
            {options.map((option) => (
                <option key={option.name || option.grado} value={option.name || option.grado}>
                    {option.name || option.grado}
                </option>
            ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-200">
            {icon}
        </div>
    </div>
);

const ToggleButton = ({ onClick, active, icon, activeText, inactiveText }) => (
    <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className={`flex items-center px-4 py-2 rounded-full transition-colors duration-200 ${
            active
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'
        }`}
    >
        {icon}
        <span className="ml-2">{active ? activeText : inactiveText}</span>
    </motion.button>
);

export default FiltersMenu;
