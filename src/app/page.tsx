/**
 * Main Pokemon Grid Page
 * 
 * Features:
 * - Search with debouncing (300ms)
 * - Type filtering
 * - Sort options (ID, Name)
 * - Responsive grid layout
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import PokemonCard from '@/components/PokemonCard';
import type { Pokemon, PokemonStatName, PokemonTypeName } from '@/types/pokemon';
import {
  getPokemonList,
  searchPokemon,
  getTypes as fetchAllTypes,
} from '@/lib/pokeapi';

// =============================================================================
// Constants & Configuration
// =============================================================================

const ITEMS_PER_PAGE = 24;
const DEBOUNCE_DELAY = 300; // ms

/**
 * Sort options for the UI
 */
interface SortOption {
  value: string;
  label: string;
}

export const SORT_OPTIONS: SortOption[] = [
  { value: 'id-asc', label: 'ID (Ascending)' },
  { value: 'id-desc', label: 'ID (Descending)' },
  { value: 'name-asc', label: 'Name (A-Z)' },
  { value: 'name-desc', label: 'Name (Z-A)' },
];

/**
 * Type filter options - all types for better filtering
 */
export const TYPE_FILTER_OPTIONS = [
  { value: '', label: 'All Types' },
  { value: 'normal', label: 'Normal' },
  { value: 'fire', label: 'Fire' },
  { value: 'water', label: 'Water' },
  { value: 'electric', label: 'Electric' },
  { value: 'grass', label: 'Grass' },
  { value: 'ice', label: 'Ice' },
  { value: 'fighting', label: 'Fighting' },
  { value: 'poison', label: 'Poison' },
  { value: 'ground', label: 'Ground' },
  { value: 'flying', label: 'Flying' },
  { value: 'psychic', label: 'Psychic' },
  { value: 'bug', label: 'Bug' },
  { value: 'rock', label: 'Rock' },
  { value: 'ghost', label: 'Ghost' },
  { value: 'dragon', label: 'Dragon' },
  { value: 'steel', label: 'Steel' },
  { value: 'dark', label: 'Dark' },
  { value: 'fairy', label: 'Fairy' },
];

// =============================================================================
// Component
// =============================================================================

export default function Home() {
  // State
  const [allPokemon, setAllPokemon] = useState<Pokemon[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPokemon, setFilteredPokemon] = useState<Pokemon[]>([]);
  const [selectedType, setSelectedType] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('id-asc');
  const [page, setPage] = useState(1);
  
  // Loading & error states
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string>('');

  // Fetch initial Pokemon list
  useEffect(() => {
    fetchPokemonList();
  }, []);

  /**
   * Fetch the complete Pokemon list with retry logic
   */
  async function fetchPokemonList() {
    setIsLoading(true);
    setHasError(false);
    
    try {
      const response = await getPokemonList(ITEMS_PER_PAGE);
      
      if (response.error) {
        throw new Error(response.error.message);
      }

      // Sort by ID initially and store for pagination
      const sortedPokemon = response.data.sort((a, b) => a.id - b.id);
      setAllPokemon(sortedPokemon);
    } catch (error) {
      console.error('Failed to fetch Pokemon list:', error);
      
      if (error instanceof Error) {
        setErrorDetails(error.message);
      }
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }

  /**
   * Debounced search handler
   */
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      // No search - show all Pokemon sorted by selected criteria
      applyFiltersAndSort(allPokemon, '', sortBy);
      setPage(1);
      return;
    }

    // Perform search with debounce already handled by effect
  }, []);

  /**
   * Apply filters and sorting to Pokemon list
   */
  const applyFiltersAndSort = useCallback((
    pokemon: Pokemon[],
    query?: string,
    sortOption = sortBy,
    filterType = selectedType
  ) => {
    let result = [...pokemon];

    // Apply search filter
    if (query) {
      const lowerQuery = query.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(lowerQuery)
      );
    }

    // Apply type filter
    if (filterType) {
      result = result.filter(p => 
        p.types.some(t => t.type.name === filterType)
      );
    }

    // Apply sorting
    switch (sortOption) {
      case 'id-asc':
        result.sort((a, b) => a.id - b.id);
        break;
      case 'id-desc':
        result.sort((a, b) => b.id - a.id);
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
    }

    setFilteredPokemon(result);
  }, [sortBy, selectedType]);

  // Apply filters when query or type changes
  useEffect(() => {
    applyFiltersAndSort(allPokemon, searchQuery, sortBy, selectedType);
    setPage(1); // Reset to first page on filter change
  }, [searchQuery, selectedType, sortBy]);

  /**
   * Get current page data
   */
  const getCurrentPageData = useCallback(() => {
    return filteredPokemon.slice(
      (page - 1) * ITEMS_PER_PAGE,
      page * ITEMS_PER_PAGE
    );
  }, [filteredPokemon, page]);

  // =============================================================================
  // Render Functions
// =============================================================================

  function renderSearchSection() {
    if (!searchQuery && !selectedType && allPokemon.length > 0) {
      return null; // Don't show search when showing initial list
    }

    return (
      <div className="space-y-4 mb-6">
        {/* Search Input */}
        <div>
          <label htmlFor="search" className="sr-only">Search Pokémon</label>
          <input
            id="search"
            type="text"
            placeholder="🔍 Search by name..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full px-5 py-3.5 rounded-xl border-2 border-gray-200 bg-white shadow-md focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all text-lg placeholder:text-gray-400"
          />
        </div>

        {/* Active Filters */}
        {selectedType && (
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
            <span className="text-sm font-medium text-blue-800">Active Type Filter:</span>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-blue-200 bg-white focus:ring-2 focus:ring-blue-500 cursor-pointer text-sm"
            >
              {TYPE_FILTER_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <button
              onClick={() => setSelectedType('')}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Clear
            </button>
          </div>
        )}
      </div>
    );
  }

  function renderSortSection() {
    if (filteredPokemon.length === 0 && !isLoading) {
      return null;
    }

    return (
      <div className="flex flex-wrap gap-3 mb-6">
        {/* Type Filter */}
        {allPokemon.length > 0 && (
          <div className="relative">
            <label htmlFor="type-filter" className="sr-only">Filter by type</label>
            <select
              id="type-filter"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2.5 rounded-xl border-2 border-gray-200 bg-white shadow-sm focus:ring-4 focus:ring-blue-100 focus:border-blue-500 cursor-pointer text-sm font-medium"
            >
              {TYPE_FILTER_OPTIONS.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
        )}

        {/* Sort Options */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-600 whitespace-nowrap">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2.5 rounded-xl border-2 border-gray-200 bg-white shadow-sm focus:ring-4 focus:ring-blue-100 focus:border-blue-500 cursor-pointer text-sm font-medium"
          >
            {SORT_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      </div>
    );
  }

  function renderPokemonGrid() {
    if (isLoading) {
      return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 aspect-[3/4] overflow-hidden"
            >
              <div className="h-48 bg-gray-300 animate-pulse" />
              <div className="p-4 space-y-2">
                <div className="h-6 bg-gray-300 rounded w-3/4 mx-auto animate-pulse" />
                <div className="flex gap-1.5 justify-center">
                  <div className="h-5 w-12 bg-gray-300 rounded-full animate-pulse" />
                  <div className="h-5 w-12 bg-gray-300 rounded-full animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (hasError && errorDetails) {
      return (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-red-500 text-lg font-semibold mb-2">⚠️ Error loading Pokémon</p>
          <p className="text-gray-600 mb-6">{errorDetails}</p>
          <button
            onClick={fetchPokemonList}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Try Again
          </button>
        </div>
      );
    }

    if (filteredPokemon.length === 0 && !isLoading) {
      return (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-500 text-lg font-medium">No Pokémon found matching your criteria.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedType('');
            }}
            className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
          >
            Clear filters
          </button>
        </div>
      );
    }

    const currentPagePokemon = getCurrentPageData();

    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {currentPagePokemon.map(pokemon => (
          <PokemonCard
            key={pokemon.id}
            pokemon={pokemon}
            onClick={(p) => {
              // Could navigate to details page here
              console.log('Viewing Pokemon:', p.name);
            }}
          />
        ))}
      </div>
    );
  }

  function renderPagination() {
    const totalPages = Math.ceil(filteredPokemon.length / ITEMS_PER_PAGE);

    if (totalPages <= 1) return null;

    return (
      <div className="flex justify-center gap-3 mt-8">
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          className={`px-5 py-2.5 rounded-xl font-medium transition-all ${
            page === 1 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white border-2 border-gray-200 hover:border-blue-500 hover:text-blue-600'
          }`}
        >
          ← Previous
        </button>

        <span className="px-5 py-2.5 bg-white border-2 border-gray-200 rounded-xl font-medium">
          Page {page} of {totalPages}
        </span>

        <button
          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className={`px-5 py-2.5 rounded-xl font-medium transition-all ${
            page === totalPages 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white border-2 border-gray-200 hover:border-blue-500 hover:text-blue-600'
          }`}
        >
          Next →
        </button>
      </div>
    );
  }

  function renderStatsSection() {
    return (
      <div className="mt-12 p-8 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-3xl shadow-lg border border-gray-100">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <span>📊</span> Current Session Stats
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-white rounded-2xl shadow-sm">
            <p className="text-4xl font-bold text-blue-600">{allPokemon.length}</p>
            <p className="text-sm text-gray-500 mt-1 font-medium">Total Loaded</p>
          </div>
          <div className="text-center p-4 bg-white rounded-2xl shadow-sm">
            <p className="text-4xl font-bold text-green-600">{filteredPokemon.length}</p>
            <p className="text-sm text-gray-500 mt-1 font-medium">Filtered Results</p>
          </div>
          <div className="text-center p-4 bg-white rounded-2xl shadow-sm">
            <p className="text-4xl font-bold text-purple-600">{page}</p>
            <p className="text-sm text-gray-500 mt-1 font-medium">Current Page</p>
          </div>
          <div className="text-center p-4 bg-white rounded-2xl shadow-sm">
            <p className="text-4xl font-bold text-orange-600">
              {searchQuery ? '🔍' : selectedType ? '🏷️' : '✨'}
            </p>
            <p className="text-sm text-gray-500 mt-1 font-medium">Active Filter</p>
          </div>
        </div>
      </div>
    );
  }

  // =============================================================================
  // Main Render
  // =============================================================================

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-8 px-4">
      {/* Header */}
      <header className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-3xl shadow-xl mb-6">
          <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        </div>
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
          🐾 PokéDex Explorer
        </h1>
        <p className="text-gray-600 max-w-lg mx-auto text-lg">
          Discover all 151 Kanto Pokémon with powerful search and filters!
        </p>
      </header>

      {/* Search & Controls */}
      {(allPokemon.length > 0 || hasError) && renderSearchSection()}

      {/* Sort Options */}
      {renderSortSection()}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <p className="text-gray-600 font-medium">
            Showing {filteredPokemon.length} of {allPokemon.length} Pokémon
          </p>
        </div>

        {/* Pokemon Grid */}
        {renderPokemonGrid()}

        {/* Pagination */}
        {renderPagination()}
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto mt-12">
        {renderStatsSection()}
      </div>
    </main>
  );
}
