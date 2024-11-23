import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Filter, ChevronDown, Heart, ThumbsUp, Loader, XCircle } from 'lucide-react';

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
            <div className="flex items-center justify-center p-6 text-zinc-600 dark:text-zinc-400">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                    <Loader className="w-8 h-8 text-fuchsia-500 dark:text-emerald-400" />
                </motion.div>
                <span className="ml-3 font-medium">Cargando filtros...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-red-500 dark:text-red-400 text-center py-6 font-medium">
                {error}
            </div>
        );
    }

    return (
        <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-zinc-50 dark:bg-zinc-800 p-6 rounded-xl shadow-lg mb-8"
        >
            <div className="flex flex-wrap gap-4 justify-center">
                <SelectFilter
                    options={categories}
                    onChange={handleCategoryClick}
                    value={filters.category}
                    placeholder="Todas las Categorías"
                    icon={<Filter className="w-4 h-4 text-fuchsia-500 dark:text-emerald-400" />}
                />
                <SelectFilter
                    options={languages}
                    onChange={handleLanguageClick}
                    value={filters.language}
                    placeholder="Todos los Lenguajes"
                    icon={<ChevronDown className="w-4 h-4 text-fuchsia-500 dark:text-emerald-400" />}
                />
                <SelectFilter
                    options={difficulties}
                    onChange={handleDifficultyClick}
                    value={filters.difficulty}
                    placeholder="Todas las Dificultades"
                    icon={<ChevronDown className="w-4 h-4 text-fuchsia-500 dark:text-emerald-400" />}
                />
                <ToggleButton
                    onClick={handleToggleFavorite}
                    active={filters.favorites}
                    icon={<Heart className="w-4 h-4" />}
                    activeText="Ver Todos"
                    inactiveText="Ver Favoritos"
                />
                <ToggleButton
                    onClick={handleToggleSortbyLikes}
                    active={filters.sort_by_likes}
                    icon={<ThumbsUp className="w-4 h-4" />}
                    activeText="Ordenar por Fecha"
                    inactiveText="Ordenar por Likes"
                />
                
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleRestFilter}
                    className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 hover:bg-red-50 dark:hover:bg-red-900/30 border-2 border-zinc-200 dark:border-zinc-700 transition-all duration-300"
                >
                    <XCircle className="w-4 h-4 mr-2 text-red-500 dark:text-red-400" />
                    Restablecer
                </motion.button>
            </div>
        </motion.div>
    );
};

const SelectFilter = ({ options, onChange, value, placeholder, icon }) => (
    <div className="relative">
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="appearance-none w-full min-w-[200px] px-4 py-2 pr-10 rounded-lg text-sm font-medium bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 border-2 border-zinc-200 dark:border-zinc-700 focus:outline-none focus:border-fuchsia-500 dark:focus:border-emerald-400 transition-all duration-300"
        >
            <option value="">{placeholder}</option>
            {options.map((option) => (
                <option 
                    key={option.name || option.grado} 
                    value={option.name || option.grado}
                    className="py-2"
                >
                    {option.name || option.grado}
                </option>
            ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
            {icon}
        </div>
    </div>
);

const ToggleButton = ({ onClick, active, icon, activeText, inactiveText }) => (
    <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
            active
                ? 'bg-fuchsia-100 text-fuchsia-700 dark:bg-emerald-900/50 dark:text-emerald-300 border-2 border-fuchsia-200 dark:border-emerald-700'
                : 'bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 hover:bg-fuchsia-50 dark:hover:bg-emerald-900/30 border-2 border-zinc-200 dark:border-zinc-700'
        }`}
    >
        {React.cloneElement(icon, {
            className: `w-4 h-4 mr-2 ${
                active
                    ? 'text-fuchsia-500 dark:text-emerald-400'
                    : 'text-zinc-600 dark:text-zinc-400'
            }`
        })}
        <span>{active ? activeText : inactiveText}</span>
    </motion.button>
);

export default FiltersMenu;