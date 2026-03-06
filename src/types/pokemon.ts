/**
 * Pokémon API Type Definitions
 * 
 * These interfaces match the PokeAPI v2 response structure.
 * Strictly typed with no implicit any - enables full TypeScript safety. 
 */

// =============================================================================
// Core Types
// =============================================================================

/**
 * Base Pokemon interface for all responses
 */
export interface Pokemon {
  id: number;
  name: string;
  height: number;       // in dm (decimeters)
  weight: number;       // in hg (hectograms)
  base_experience: number;
  
  // Type information
  types: PokemonType[];
  
  // Abilities
  abilities: PokemonAbility[];
  
  // Stats
  stats: PokemonStat[];
  
  // Images
  sprites?: { front_default?: string; other?: Record<string, unknown> };
}

/**
 * Single Pokémon type with slot information
 */
export interface PokemonType {
  slot: number;
  type: { name: string };
}

/**
 * Pokémon ability (can be hidden)
 */
export interface PokemonAbility {
  is_hidden: boolean;
  slot: number;
  ability: { name: string };
}

/**
 * Base stat with effort value
 */
export interface PokemonStat {
  base_stat: number;
  effort: number;
  stat: { name: string };
}

// =============================================================================
// Statistics Types (for Stats.name mapping)
// =============================================================================

/**
 * Valid stat names - used for type narrowing and validation
 */
export type PokemonStatName = 
  | 'hp'
  | 'attack'
  | 'defense'
  | 'special-attack'
  | 'special-defense'
  | 'speed';

/**
 * Valid type names - used for filtering and display
 */
export type PokemonTypeName = 
  | 'normal' | 'fire' | 'water' | 'electric' | 'grass'
  | 'ice' | 'fighting' | 'poison' | 'ground' | 'flying'
  | 'psychic' | 'bug' | 'rock' | 'ghost' | 'dragon'
  | 'steel' | 'dark' | 'fair';

// =============================================================================
// API Response Wrappers
// =============================================================================

/**
 * Standard response wrapper for all API calls
 */
export interface PokeAPIResponse<T> {
  data: T;
  error?: Error;
  fromCache?: boolean;
}

/**
 * Species information - detailed Pokemon lore and evolution
 */
export interface PokemonSpecies {
  name: string;
  url: string; // /api/v2/pokemon-species/{id}
  
  flavor_text_entries: FlavorTextEntry[];
  
  generation: { name: string };
  
  // Evolution information
  evolutions?: PokemonSpeciesEvolutions[];
}

export interface FlavorTextEntry {
  language: LanguageInfo;
  flavor_text: string;
}

export interface LanguageInfo {
  name: string;      // 'en', 'ja', etc.
  url: string;
  is_official: boolean;
}

/**
 * Evolution chain information
 */
export interface PokemonSpeciesEvolutions {
  species: SpeciesReference;
  condition?: any;              // Complex evolution conditions
  level_up?: { 
    party_species: SpeciesReference;
    party_type?: SpeciesReference; 
  };
}

export interface SpeciesReference {
  name: string;
  url: string;
}

// =============================================================================
// List Response Types
// =============================================================================

/**
 * Pokemon list response (when fetching multiple at once)
 */
export interface PokemonListResponse {
  count: number;      // Total matching results
  next?: string;      // URL for pagination
  previous?: string;
  results: ResultItem[];
}

export interface ResultItem {
  name: string;       // e.g., 'bulbasaur'
  url: string;        // /api/v2/pokemon/bulbasaur
  sprite: { front_default: string };
}

// =============================================================================
// Type Effectiveness Types
// =============================================================================

/**
 * Type effectiveness data for battle calculations
 * Format: { attackingType: { defendingType: multiplier } }
 */
export interface TypeEffectiveness {
  [attackingType: string]: {    // 'fire', 'water', etc.
    [defendingType: string]: number;   // 1.0 (neutral), 2.0 (super effective), 0.5 (resistant)
  };
}

// =============================================================================
// Utility Types
// =============================================================================

/**
 * Language name mapping for display purposes
 */
export const LANGUAGE_NAMES: Record<string, string> = {
  en: 'English',
  ja: 'Japanese', 
  ko: 'Korean',
  zh: 'Chinese',
  es: 'Spanish',
  fr: 'French',
  de: 'German',
  it: 'Italian',
  pt: 'Portuguese',
};

/**
 * Type color mapping for UI rendering
 */
export const TYPE_COLORS: Record<string, string> = {
  normal: '#A8A77A',
  fire: '#EE8130',
  water: '#6390F0',
  electric: '#F7D02C',
  grass: '#7AC74C',
  ice: '#96D9D6',
  fighting: '#C22E28',
  poison: '#A33EA1',
  ground: '#E2BF65',
  flying: '#A98FF3',
  psychic: '#F95587',
  bug: '#A6B91A',
  rock: '#B6A136',
  ghost: '#735797',
  dragon: '#6F35FC',
  steel: '#B7B7CE',
  dark: '#705746',
  fairy: '#D685AD',
};