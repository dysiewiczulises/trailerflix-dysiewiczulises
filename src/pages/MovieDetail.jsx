import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import '../styles/MovieDetail.css'; // 👈 Asegúrate de tener este archivo

// 👇 Agrega esta función
function normalizePoster(p) {
  if (!p) return p;
  // convierte "./posters/1.jpg" -> "/posters/1.jpg"
  if (p.startsWith('./')) return p.replace('./', '/');
  // si ya es relative without dot and current route can break, for safety:
  if (!p.startsWith('/') && !p.startsWith('http')) return `/${p}`;
  return p;
}

export default function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await fetch('/data/trailerflix.json');
        if (!response.ok) {
          throw new Error('Error al cargar los datos');
        }
        const data = await response.json();
        const found = data.find((m) => String(m.id) === String(id));
        
        if (!found) {
          setError('Película no encontrada');
          setMovie(null);
        } else {
          setMovie(found);
          setError(null);
        }
      } catch (err) {
        console.error('Error:', err);
        setError('Ocurrió un error al cargar la película');
        setMovie(null);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMovie();
  }, [id]);

  // Estado de carga
  if (loading) {
    return (
      <>
        <Header />
        <main className="movie-page-container">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Cargando película...</p>
          </div>
        </main>
      </>
    );
  }

  // Estado de error
  if (error || !movie) {
    return (
      <>
        <Header />
        <main className="movie-page-container">
          <div className="error-container">
            <div className="error-icon">⚠️</div>
            <h2 className="error-title">¡Oops! Algo salió mal</h2>
            <p className="error-message">
              {error || 'No se pudo encontrar la película que buscas.'}
            </p>
            <p className="error-subtitle">
              Es posible que la película no exista o haya sido eliminada.
            </p>
            <button onClick={() => navigate('/')} className="back-btn-error">
              🏠 Volver al inicio
            </button>
          </div>
        </main>
      </>
    );
  }

  // Estado exitoso - mostrar película
  const poster = normalizePoster(movie.poster);

  return (
    <>
      <Header />
      <main className="movie-page-container">
        <button onClick={() => navigate('/')} className="back-btn">
          ← Volver al catálogo
        </button>

        <div className="movie-details">
          <div className="movie-poster">
            <img src={poster} alt={movie.titulo} />
          </div>

          <div className="movie-info">
            <h2>{movie.titulo}</h2>
            <p><strong>Resumen:</strong> {movie.resumen}</p>

            {movie.trailer && (
              <iframe
                title={`Tráiler de ${movie.titulo}`}
                width="560"
                height="315"
                src={movie.trailer}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}

            <p><strong>Reparto:</strong> {movie.reparto}</p>
          </div>
        </div>
      </main>
    </>
  );
}
