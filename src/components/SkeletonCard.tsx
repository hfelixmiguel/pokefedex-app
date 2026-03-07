/**
 * Skeleton Card Component for Loading States
 * 
 * Provides visual feedback while data is being fetched.
 */

import type { Pokemon } from '@/types/pokemon';

interface SkeletonCardProps {
  index?: number;
}

export function SkeletonCard({ index = 0 }: SkeletonCardProps) {
  // Add subtle animation delay based on index for staggered effect
  const animationDelay = `${index * 50}ms`;

  return (
    <div
      className="rounded-2xl bg-gray-100 overflow-hidden animate-pulse"
      style={{ animationDelay }}
    >
      {/* Header */}
      <div className="p-4 pb-2">
        <div className="h-5 bg-gray-200 rounded w-3/4 mx-auto"></div>
      </div>

      {/* Sprite placeholder */}
      <div className="flex justify-center p-4 bg-gray-50">
        <div className="w-32 h-32 bg-gray-200 rounded-full"></div>
      </div>

      {/* Types placeholder */}
      <div className="px-4 pb-3 pt-2">
        <div className="flex justify-center gap-1.5">
          <div className="h-5 w-12 bg-gray-200 rounded-full"></div>
          <div className="h-5 w-12 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}

export default SkeletonCard;