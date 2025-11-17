import { useState, useMemo } from "react";

/**
 * useFilterMovies soporta dos modos:
 * - Modo controlado: pasar (movies, searchTerm, selectedGenres, selectedCategories)
 *   -> devuelve { filteredMovies, resultsCount }
 * - Modo no controlado: pasar solo (movies)
 *   -> devuelve todo el estado y setters (searchTerm, setSearchTerm, toggleGenre, ...)
 */
export default function useFilterMovies(
  movies = [],
  searchTermArg,
  selectedGenresArg,
  selectedCategoriesArg
) {
  // Estado interno (modo no-controlado)
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Detectar si es controlado
  const controlled = searchTermArg !== undefined;

  // Usar props si controlado, o estado interno si no
  const term = controlled ? searchTermArg : searchTerm;
  const genres = controlled ? selectedGenresArg : selectedGenres;
  const categories = controlled ? selectedCategoriesArg : selectedCategories;

  // 🎯 Filtrado con sistema de puntuación solo por TÍTULO
  const filteredMovies = useMemo(() => {
    const searchLower = term.toLowerCase().trim();

    // Sin filtros, devolver todas las películas
    if (!searchLower && genres.length === 0 && categories.length === 0) {
      return movies;
    }

    return movies
      .map((movie) => {
        let score = 0;

        // 1️⃣ Puntuación solo por TÍTULO
        if (searchLower) {
          const titulo = (movie.titulo || "").toLowerCase();

          // Coincidencia exacta en título = máximo puntaje
          if (titulo === searchLower) {
            score += 100;
          }
          // Título comienza con la búsqueda
          else if (titulo.startsWith(searchLower)) {
            score += 80;
          }
          // Título contiene la búsqueda
          else if (titulo.includes(searchLower)) {
            score += 50;
          }
        }

        // 2️⃣ Verificar filtros de género
        const matchesGenre =
          genres.length === 0 ||
          genres.some((g) => {
            const movieGenre = String(movie.gen || movie.genero || "")
              .toLowerCase();
            return movieGenre.includes(g.toLowerCase());
          });

        // 3️⃣ Verificar filtros de categoría
        const matchesCategory =
          categories.length === 0 ||
          categories.some((c) => {
            const movieCat = String(movie.categoria || "").toLowerCase();
            return movieCat === c.toLowerCase();
          });

        // Si no pasa los filtros, score = 0
        if (!matchesGenre || !matchesCategory) {
          score = 0;
        }

        // Si no hay búsqueda de texto pero pasa filtros, dar puntaje base
        if (!searchLower && score === 0 && matchesGenre && matchesCategory) {
          score = 1;
        }

        return { movie, score };
      })
      // Filtrar solo los que tienen puntaje > 0
      .filter(({ score }) => score > 0)
      // Ordenar por puntaje descendente (más relevantes primero)
      .sort((a, b) => b.score - a.score)
      // Extraer solo las películas
      .map(({ movie }) => movie);
  }, [movies, term, genres, categories]);

  const resultsCount = filteredMovies.length;

  // Si es modo controlado, solo devolver resultados
  if (controlled) {
    return { filteredMovies, resultsCount };
  }

  // funciones para modo no-controlado
  const toggleGenre = (gen) => {
    setSelectedGenres((s) =>
      s.includes(gen)
        ? s.filter((g) => g !== gen)
        : [...s, gen]
    );
  };

  const toggleCategory = (cat) => {
    setSelectedCategories((s) =>
      s.includes(cat)
        ? s.filter((c) => c !== cat)
        : [...s, cat]
    );
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedGenres([]);
    setSelectedCategories([]);
  };

  return {
    searchTerm,
    setSearchTerm,
    selectedGenres,
    toggleGenre,
    selectedCategories,
    toggleCategory,
    clearFilters,
    filteredMovies,
    resultsCount,
  };
}