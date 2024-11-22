import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Filter } from 'lucide-react';

const FiltersMenu = ({
    handleCategoryClick,
    handleLanguageClick,
    handleDifficultyClick,
    handleToggleFavorite,
    handleToggleSortbyLikes,
    filters, // Asegúrate de pasar 'filters' desde el componente padre
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
            <div className="flex justify-center items-center h-20 text-gray-600 dark:text-gray-300">
                <div className="animate-spin">
                    <Filter className="w-6 h-6" />
                </div>
                <span className="ml-2">Cargando...</span>
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
        <div className="flex flex-wrap gap-4 py-6 px-4 border border-black bg-gray-200 dark:bg-gray-700 rounded-lg shadow-md">
            <select onChange={(e) => handleCategoryClick(e.target.value)} className="select-class">
                <option value="">Todas las Categorías</option>
                {categories.map((category) => (
                    <option key={category.name} value={category.name}>
                        {category.name}
                    </option>
                ))}
            </select>
            <select onChange={(e) => handleLanguageClick(e.target.value)} className="select-class">
                <option value="">Todos los Lenguajes</option>
                {languages.map((language) => (
                    <option key={language.name} value={language.name}>
                        {language.name}
                    </option>
                ))}
            </select>
            <select onChange={(e) => handleDifficultyClick(e.target.value)} className="select-class">
                <option value="">Todas las Dificultades</option>
                {difficulties.map((difficulty) => (
                    <option key={difficulty.grado} value={difficulty.grado}>
                        {difficulty.grado}
                    </option>
                ))}
            </select>
            <div>
                <button onClick={handleToggleFavorite}>
                    {filters.favorites ? 'Ver Todos' : 'Ver Favoritos'}
                </button>
                <button onClick={handleToggleSortbyLikes}>
                    {filters.sort_by_likes ? 'Ordenar por Relevancia' : 'Ordenar por Likes'}
                </button>
            </div>
        </div>
    );
};

export default FiltersMenu;
