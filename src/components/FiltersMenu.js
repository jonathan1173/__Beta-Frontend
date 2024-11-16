'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

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

    if (loading) return <div>Cargando...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="flex flex-wrap space-x-4 py-4">
            {/* Filtro de Categorías */}
            <select
                onChange={(e) => handleCategoryClick(e.target.value)}
                className="border border-gray-300 p-2 rounded"
            >
                <option value="">Todas las Categorías</option>
                {categories.map((category) => (
                    <option key={category.name} value={category.name}>
                        {category.name}
                    </option>
                ))}
            </select>

            {/* Filtro de Lenguajes */}
            <select
                onChange={(e) => handleLanguageClick(e.target.value)}
                className="border border-gray-300 p-2 rounded"
            >
                <option value="">Todos los Lenguajes</option>
                {languages.map((language) => (
                    <option key={language.name} value={language.name}>
                        {language.name}
                    </option>
                ))}
            </select>

            {/* Filtro de Dificultades */}
            <select
                onChange={(e) => handleDifficultyClick(e.target.value)}
                className="border border-gray-300 p-2 rounded"
            >
                <option value="">Todas las Dificultades</option>
                {difficulties.map((difficulty) => (
                    <option key={difficulty.grado} value={difficulty.grado}>
                        {difficulty.grado}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default FiltersMenu;
