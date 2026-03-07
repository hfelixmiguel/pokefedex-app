/**
 * Pokemon Search Component
 * 
 * Enhanced search with debouncing and visual feedback.
 */

'use client';

import { useState, useEffect, useCallback } from 'react';

interface PokemonSearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export function PokemonSearch({ onSearch, placeholder = '🔍 Search by name...' }: PokemonSearchProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Debounced search with 300ms delay
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, onSearch]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setHasSearched(false);
  }, []);

  const handleClear = useCallback(() => {
    setQuery('');
    setHasSearched(false);
    onSearch('');
  }, [onSearch]);

  return (
    <div className="relative">
      {/* Search Input */}
      <div
        className={`
          flex items-center w-full px-4 py-3 rounded-xl border-2 transition-all duration-200
          ${isFocused || hasSearched 
            ? 'border-blue-500 ring-4 ring-blue-100' 
            : 'border-gray-200 hover:border-gray-300'
          }
        `}
      >
        <span className="text-xl mr-3">🔍</span>
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none text-lg placeholder-gray-400"
        />

        {/* Clear button */}
        {query && (
          <button
            onClick={handleClear}
            className="ml-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Clear search"
          >
            <span className="text-gray-400 hover:text-gray-600">×</span>
          </button>
        )}
      </div>

      {/* Search feedback indicator */}
      {hasSearched && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <span className="text-blue-500 text-sm animate-pulse">Searching...</span>
        </div>
      )}
    </div>
  );
}

export default PokemonSearch;