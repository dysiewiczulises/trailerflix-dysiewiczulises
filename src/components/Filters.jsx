import React, { useMemo } from 'react';

export default function Filters({
  movies,
  selectedGenres,
  toggleGenre,
  selectedCategories,
  toggleCategory,
  clearFilters,
}) {
  // Extraer géneros únicos
  const genres = useMemo(
    () => Array.from(new Set(movies.map((m) => m.gen).filter(Boolean))).sort(),
    [movies]
  );

  // Extraer categorías únicas
  const categories = useMemo(
    () => Array.from(new Set(movies.map((m) => m.categoria).filter(Boolean))).sort(),
    [movies]
  );

  return (
    <>
    <aside className="filters-container">

      {/* Filtro por Género */} 
      <div className="filter-group">
        <label className="filter-label">Género:</label>
        <div id="genreFilters" className="filter-buttons">
          {genres.map((gen) => (
            <button
              key={gen}
              className={`filter-btn ${selectedGenres.includes(gen) ? 'active' : ''}`}
              onClick={() => toggleGenre(gen)}
            >
              {gen}
            </button>
          ))}
        </div>
      </div>

      {/* Filtro por Categoría */}
      <div className="filter-group">
        <label className="filter-label">Categoria:</label>
        <div className="filter-buttons">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`filter-btn ${selectedCategories.includes(cat) ? 'active' : ''}`}
              onClick={() => toggleCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Botón Limpiar */}
      <button id="clearFilters" className="clear-btn" onClick={clearFilters}>
        Limpiar filtros
      </button>
    </aside>
    </>
  );
}
