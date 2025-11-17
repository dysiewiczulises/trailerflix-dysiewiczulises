// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Link } from 'react-router-dom';

// function normalizePoster(p) {
//   if (!p) return p;
//   // convierte "./posters/1.jpg" -> "/posters/1.jpg"
//   if (p.startsWith('./')) return p.replace('./', '/');
//   // si ya es relative without dot and current route can break, for safety:
//   if (!p.startsWith('/') && !p.startsWith('http')) return `/${p}`;
//   return p;
// }

// export default function MovieCard({ movie }) {
//   const navigate = useNavigate();
//   const poster = normalizePoster(movie.poster);

//   return (

//     <div className="card">

//       <Link to={`/movie/${movie.id}`} className="card">

//         <div className="card-picture">
//           <img src={poster} alt={movie.titulo} className="" loading="lazy" />
//         </div>


//         <div className="card-bottom">
//           <h3 className="card-bottom-title">{movie.titulo}</h3>
//           <p>{movie.categoria}</p>
//         </div>

//       </Link>

//     </div>
//   );
// }


import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import '../styles/MovieCard.css';

function normalizePoster(p) {
  if (!p) return p;
  // convierte "./posters/1.jpg" -> "/posters/1.jpg"
  if (p.startsWith('./')) return p.replace('./', '/');
  // si ya es relative without dot and current route can break, for safety:
  if (!p.startsWith('/') && !p.startsWith('http')) return `/${p}`;
  return p;
}

export default function MovieCard({ movie }) {
  const navigate = useNavigate();
  const poster = normalizePoster(movie.poster);

  return (
    <div className="movie-card">
      <Link to={`/movie/${movie.id}`} className="movie-card__link">
        <div className="movie-card__image-container">
          <img 
            src={poster} 
            alt={movie.titulo} 
            className="movie-card__image" 
            loading="lazy" 
          />
        </div>

        <div className="movie-card__content">
          <h3 className="movie-card__title">{movie.titulo}</h3>
          <p className="movie-card__genre">{movie.categoria}</p>
        </div>
      </Link>
    </div>
  );
}