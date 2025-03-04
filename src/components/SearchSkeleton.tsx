
import React from "react";

interface SearchSkeletonProps {
  count?: number;
}

const SearchSkeleton: React.FC<SearchSkeletonProps> = ({ count = 3 }) => {
  return (
    <div className="w-full">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="search-result-item flex flex-col gap-2">
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2" />
        </div>
      ))}
    </div>
  );
};

export default SearchSkeleton;
