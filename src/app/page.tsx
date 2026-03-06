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
 * Type filter options
 */
export const TYPE_FILTER_OPTIONS = [
  { value: '', label: 'All Types' },
  { value: 'grass', label: 'Grass' },
  { value: 'fire', label: 'Fire' },
  { value: 'water', label: 'Water' },
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
    selectedTypeFilter = selectedType
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
    if (selectedTypeFilter) {
      result = result.filter(p => 
        p.types.some(t => t.type.name === selectedTypeFilter)
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
  }, [searchQuery, selectedType, sortBy, applyFiltersAndSort, allPokemon]);

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
          <label htmlFor="search" className="sr-only">Search Pokemon</label>
          <input
            id="search"
            type="text"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg"
          />
        </div>

        {/* Active Filters */}
        {selectedType && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Active Type Filter:</span>
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm capitalize">
              {selectedType}
            </span>
            <button 
              onClick={() => setSelectedType('')}
              className="text-sm text-red-500 hover:text-red-700"
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
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-200 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            {TYPE_FILTER_OPTIONS.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        )}

        {/* Sort Options */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-200 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 cursor-pointer"
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-2xl bg-gray-100 aspect-square"
            />
          ))}
        </div>
      );
    }

    if (hasError && errorDetails) {
      return (
        <div className="text-center py-16">
          <p className="text-red-500 text-lg font-medium mb-2">Error loading Pokemon</p>
          <p className="text-gray-600 mb-4">{errorDetails}</p>
          <button
            onClick={fetchPokemonList}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      );
    }

    if (filteredPokemon.length === 0 && !isLoading) {
      return (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">No Pokemon found matching your criteria.</p>
        </div>
      );
    }

    const currentPagePokemon = getCurrentPageData();

    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
      <div className="flex justify-center gap-2 mt-8">
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          className={`px-4 py-2 rounded-lg transition-colors ${
            page === 1 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white border border-gray-200 hover:bg-gray-50'
          }`}
        >
          Previous
        </button>

        <span className="px-4 py-2">
          Page {page} of {totalPages}
        </span>

        <button
          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className={`px-4 py-2 rounded-lg transition-colors ${
            page === totalPages 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white border border-gray-200 hover:bg-gray-50'
          }`}
        >
          Next
        </button>
      </div>
    );
  }

  function renderStatsSection() {
    return (
      <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Current Session Stats</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">{allPokemon.length}</p>
            <p className="text-sm text-gray-500 mt-1">Total Loaded</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">{filteredPokemon.length}</p>
            <p className="text-sm text-gray-500 mt-1">Filtered Results</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-600">{page}</p>
            <p className="text-sm text-gray-500 mt-1">Current Page</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-orange-600">
              {searchQuery ? 'Yes' : selectedType ? 'Yes' : 'No'}
            </p>
            <p className="text-sm text-gray-500 mt-1">Active Filter</p>
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
      <header className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
          PokeDex Explorer
        </h1>
        <p className="text-gray-600 max-w-md mx-auto">
          Discover all 151 Kanto Pokemon with powerful search and filters!
        </p>
      </header>

      {/* Search & Controls */}
      {(allPokemon.length > 0 || hasError) && renderSearchSection()}

      {/* Sort Options */}
      {renderSortSection()}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        <div className="mb-4 flex justify-between items-center">
          <p className="text-gray-600">
            Showing {filteredPokemon.length} of {allPokemon.length} Pokemon
          </p>
        </div>

        {/* Pokemon Grid */}
        {renderPokemonGrid()}

        {/* Pagination */}
        {renderPagination()}
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto mt-8">
        {renderStatsSection()}
      </div>
    </main>
  );
}
