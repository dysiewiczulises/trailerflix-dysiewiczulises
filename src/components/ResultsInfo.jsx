import React from 'react';
import '../styles/ResultsInfo.css';

export default function ResultsInfo({ count, clearFilters }) {


  return (
    <div className="results-count">
      <span className="count-label">
        Resultados encontrados:
      </span>
      <span className="count-number">
        {count}
      </span>

      {count === 0 && (
        <div className="no-results-message">
          <p style={{ color: 'white' }}>No se encontraron resultados que coincidan con tu búsqueda o filtros.</p>
          <button onClick={clearFilters} className="reset-link">
            Limpiar filtros
          </button>
        </div>
      )}
    </div>
  );
}
