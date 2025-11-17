import React from 'react'

export default function SearchBar({ value, onChange }) {
  return (
    <div className="search-container">
                <input
                  type="search"
                  id="searchInput"
                  className="search-input"
                  placeholder="Buscar películas y series..."
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  autoComplete="off"
                  aria-label="Buscar películas"
                />
        <span className="search-icon">🔍</span>
    </div>
    
  )
}
