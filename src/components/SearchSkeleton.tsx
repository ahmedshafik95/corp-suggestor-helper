
import React from "react";

interface SearchSkeletonProps {
  count?: number;
}

const SearchSkeleton: React.FC<SearchSkeletonProps> = ({ count = 3 }) => {
  return (
    <div className="w-full">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={`p-4 ${index < count - 1 ? 'border-b border-gray-200' : ''}`}>
          <div className="flex flex-col space-y-2">
            <div className="h-5 bg-gray-200 rounded w-3/4 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default SearchSkeleton;
