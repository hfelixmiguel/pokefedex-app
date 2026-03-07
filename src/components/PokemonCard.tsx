/**
 * Pokémon Card Component
 * 
 * Displays a single Pokémon with sprite, name, types, and basic stats.
 * Mobile-first responsive design with TailwindCSS.
 */

'use client';

import Image from 'next/image';
import type { Pokemon } from '@/types/pokemon';

interface PokemonCardProps {
  pokemon: Pokemon;
  onClick?: (pokemon: Pokemon) => void;
  showStats?: boolean;
}

/**
 * Get a color based on Pokémon name for gradient background
 */
function getNameColor(name: string): string {
  const colors = [
    'from-blue-500 to-purple-600',
    'from-orange-400 to-red-500', 
    'from-green-400 to-emerald-600',
    'from-cyan-400 to-blue-500',
    'from-yellow-400 to-orange-500',
    'from-pink-400 to-purple-500',
    'from-indigo-400 to-blue-500',
  ];
  const index = name.length % colors.length;
  return colors[index];
}

/**
 * Get type badge styles
 */
function getTypeBadgeStyle(type: string) {
  const color = TYPE_COLORS[type] || '#9CA3AF';
  
  // Calculate contrast - use white text on light types, dark on others
  const isLightType = ['water', 'ice', 'electric', 'fairy'].includes(type);
  
  return {
    backgroundColor: color,
    color: isLightType ? '#1F2937' : '#FFFFFF',
  };
}

/**
 * Type colors for display
 */
export const TYPE_COLORS = {
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

export function PokemonCard({ pokemon, onClick, showStats = false }: PokemonCardProps) {
  const typeColors = pokemon.types.map(t => getTypeBadgeStyle(t.type.name)).map(s => s.backgroundColor);
  const gradientClass = getNameColor(pokemon.name); 

  return (
    <div 
      className={`
        relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300
        bg-gradient-to-br ${gradientClass}
        cursor-pointer transform hover:-translate-y-1
      `}
      onClick={() => onClick?.(pokemon)}
    >
      {/* Header */}
      <div className="p-4 pb-2">
        <h3 className="text-lg font-bold text-white text-center uppercase tracking-wide">
          {pokemon.name}
        </h3>
      </div>

      {/* Sprite */}
      <div className="flex justify-center p-4 bg-white/10 backdrop-blur-sm">
        {pokemon.sprites?.front_default ? (
          <Image
            src={pokemon.sprites.front_default}
            alt={`${pokemon.name} sprite`}
            width={120}
            height={120}
            className="object-contain filter drop-shadow-md hover:scale-110 transition-transform duration-300"
            priority
          />
        ) : (
          <div className="text-white/50 text-sm">No sprite available</div>
        )}
      </div>

      {/* Types */}
      {pokemon.types.length > 0 && (
        <div className="px-4 pb-3">
          <div className="flex flex-wrap justify-center gap-1.5">
            {pokemon.types.map((typeSlot, index) => {
              const color = getTypeBadgeStyle(typeSlot.type.name);
              return (
                <span
                  key={index}
                  style={{ backgroundColor: color.backgroundColor }}
                  className="px-2 py-0.5 text-xs font-semibold rounded-full whitespace-nowrap"
                >
                  {typeSlot.type.name.toUpperCase()}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Stats Preview (optional) */}
      {showStats && pokemon.stats.length > 0 && (
        <div className="px-4 pb-4">
          <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-center bg-black/20 rounded-lg p-3">
            {pokemon.stats.slice(0, 4).map((stat) => {
              const statColor = TYPE_COLORS[stat.stat.name] || '#9CA3AF';
              return (
                <div key={stat.stat.name}>
                  <span className="block text-[10px] opacity-80">
                    {stat.stat.name.replace('-', ' ').toUpperCase()}
                  </span>
                  <span 
                    style={{ color: statColor }}
                    className="text-sm font-bold"
                  >
                    {stat.base_stat}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default PokemonCard;
