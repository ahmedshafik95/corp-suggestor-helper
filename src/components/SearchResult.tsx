
import React from "react";
import { CompanySuggestion } from "@/types/company";

interface SearchResultProps {
  result: CompanySuggestion;
  searchQuery: string;
  onSelect: (result: CompanySuggestion) => void;
}

const SearchResult: React.FC<SearchResultProps> = ({ 
  result, 
  searchQuery, 
  onSelect 
}) => {
  const { name, registrationNumber, jurisdiction } = result;
  
  // Highlight matching text
  const getHighlightedText = (text: string, highlight: string) => {
    if (!highlight.trim()) return text;
    
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    
    return (
      <>
        {parts.map((part, index) => 
          part.toLowerCase() === highlight.toLowerCase() ? 
            <span key={index} className="search-highlight">{part}</span> : 
            part
        )}
      </>
    );
  };

  return (
    <div 
      className="search-result-item transition-all duration-300 animate-slide-in" 
      onClick={() => onSelect(result)}
    >
      <h3 className="font-medium text-base mb-1">
        {getHighlightedText(name, searchQuery)}
      </h3>
      <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
        <span className="inline-flex items-center">
          <span className="w-2 h-2 rounded-full bg-primary mr-1.5 opacity-70"></span>
          {jurisdiction}
        </span>
        <span>#{registrationNumber}</span>
      </div>
    </div>
  );
};

export default SearchResult;
