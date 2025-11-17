import { useState, useEffect, useMemo } from 'react';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import Filters from '../components/Filters';
import ResultsInfo from '../components/ResultsInfo';
import MovieCard from '../components/MovieCard';
import useFilterMovies from '../hooks/useFilterMovies';

import '../styles/Home.css';
import '../styles/MovieCard.css';
import '../styles/ResultsInfo.css';

function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showResults, setShowResults] = useState(false); // 👈 NUEVO

  const {
    searchTerm,
    setSearchTerm,
    selectedGenres,
    toggleGenre,
    selectedCategories,
    toggleCategory,
    clearFilters,
    filteredMovies,
    resultsCount,
  } = useFilterMovies(movies);

  const groupedByGenre = useMemo(() => {
    // crear mapa genre -> movies
    const map = filteredMovies.reduce((acc, m) => {
      const raw = String(m.gen || (m.genero || '')).trim();
      // usar primer género si "genero" contiene varios (opcional)
      const genre = raw || 'Sin género';
      if (!acc[genre]) acc[genre] = [];
      acc[genre].push(m);
      return acc;
    }, {});
    // ordenar películas dentro de cada grupo
    Object.keys(map).forEach((g) => {
      map[g].sort((a, b) => a.titulo.localeCompare(b.titulo, 'es', { sensitivity: 'base' }));
    });
    // obtener géneros ordenados alfabéticamente
    const sortedGenres = Object.keys(map).sort((a, b) =>
      a.localeCompare(b, 'es', { sensitivity: 'base' })
    );
    // devolver array ordenado de { genre, movies }
    return sortedGenres.map((g) => ({ genre: g, movies: map[g] }));
  }, [filteredMovies]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch('/data/trailerflix.json');
        const data = await response.json();
        setMovies(data);
      } catch (error) {
        console.error('Error al cargar películas:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  useEffect(() => {
    // Verificar si hay algún filtro activo
    const hasFilters =
      searchTerm.trim() !== '' ||           // Hay texto de búsqueda
      selectedGenres.length > 0 ||          // Hay géneros seleccionados
      selectedCategories.length > 0;        // Hay categorías seleccionadas
    
    setShowResults(hasFilters);
  }, [searchTerm, selectedGenres, selectedCategories]); // 👈 Se ejecuta cuando cambian

  if (loading) return <p>Cargando...</p>;

  return (
    <>
      <Header />

      <main>
        <section className="search-filters-section">
          <div className="search-container">
            <SearchBar value={searchTerm} onChange={(v) => setSearchTerm(v)} />
          </div>

          <div className="filters-container">
            <Filters
              movies={movies}
              selectedGenres={selectedGenres}
              toggleGenre={toggleGenre}
              selectedCategories={selectedCategories}
              toggleCategory={toggleCategory}
              clearFilters={clearFilters}
            />
          </div>
        </section>

        {/* 👇 Solo se renderiza si showResults === true */}
        {showResults && <ResultsInfo count={resultsCount} clearFilters={clearFilters} />}

        {resultsCount === 0 ? (
          <p style={{ color: 'white', textAlign: 'center', padding: '20px' }}>
            No se encontraron resultados.
          </p>
        ) : (
          <>
            {groupedByGenre.map(({ genre, movies }) => (
              <section key={genre} className="genero">
                <h2>{genre}</h2>
                <div className="container">
                  {movies.map((m) => (
                    <MovieCard key={m.id} movie={m} />
                  ))}
                </div>
              </section>
            ))}
          </>
        )}
      </main>
    </>
  );
}

export default Home;
