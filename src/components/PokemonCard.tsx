import { Pokemon } from "@/types/pokemon";

const typeColors: Record<string, string> = {
  fire: "bg-gradient-to-br from-orange-500 to-red-600 text-white",
  water: "bg-gradient-to-br from-blue-500 to-cyan-600 text-white",
  grass: "bg-gradient-to-br from-green-500 to-emerald-600 text-white",
  electric: "bg-gradient-to-br from-yellow-400 to-amber-500 text-white",
  ice: "bg-gradient-to-br from-cyan-400 to-blue-500 text-white",
  fighting: "bg-gradient-to-br from-red-600 to-orange-700 text-white",
  poison: "bg-gradient-to-br from-purple-500 to-fuchsia-600 text-white",
  ground: "bg-gradient-to-br from-amber-600 to-yellow-700 text-white",
  flying: "bg-gradient-to-br from-indigo-400 to-violet-500 text-white",
  psychic: "bg-gradient-to-br from-pink-500 to-rose-600 text-white",
  bug: "bg-gradient-to-br from-lime-500 to-green-600 text-white",
  rock: "bg-gradient-to-br from-orange-700 to-stone-600 text-white",
  ghost: "bg-gradient-to-br from-violet-600 to-purple-800 text-white",
  dragon: "bg-gradient-to-br from-indigo-600 to-blue-700 text-white",
  steel: "bg-gradient-to-br from-gray-400 to-slate-500 text-white",
  dark: "bg-gradient-to-br from-gray-700 to-black text-white",
  normal: "bg-gradient-to-br from-gray-300 to-gray-400 text-gray-800",
  fairy: "bg-gradient-to-br from-pink-400 to-rose-500 text-white",
};

export default function PokemonCard({ pokemon }: { pokemon: Pokemon }) {
  return (
    <div className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
      {/* Hover overlay effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Pokemon Image with animation */}
      <div className="relative h-48 flex items-center justify-center p-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-20 transition-opacity duration-300">
          <img
            src={pokemon.sprites.front_default}
            alt={pokemon.name}
            className="w-64 h-64 object-contain animate-pulse"
          />
        </div>
        <img
          src={pokemon.sprites.front_default}
          alt={pokemon.name}
          className="w-32 h-32 object-contain drop-shadow-lg group-hover:scale-110 transition-transform duration-300 relative z-10"
        />
      </div>

      {/* Content */}
      <div className="relative p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-lg capitalize group-hover:text-blue-600 transition-colors duration-300">
            {pokemon.name}
          </h3>
          <span className="text-sm font-mono bg-gray-100 text-gray-600 px-2 py-1 rounded-md">
            #{String(pokemon.id).padStart(3, "0")}
          </span>
        </div>

        {/* Types with gradient badges */}
        <div className="flex gap-1.5 flex-wrap">
          {pokemon.types.map((type) => (
            <span
              key={type.type.name}
              className={`px-3 py-1 text-xs font-medium rounded-full capitalize ${typeColors[type.type.name] || type.normal}`}
            >
              {type.type.name}
            </span>
          ))}
        </div>

        {/* Quick stats preview */}
        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>HP</span>
            <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500"
                style={{ width: `${(pokemon.stats.find(s => s.stat.name === "hp")?.base_stat || 0) / 150 * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* View details button */}
      <div className="px-4 pb-4">
        <button className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-300 group-hover:bg-blue-700">
          View Details
        </button>
      </div>
    </div>
  );
}
