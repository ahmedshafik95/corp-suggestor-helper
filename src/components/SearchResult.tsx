
import React from "react";
import { CompanySuggestion } from "@/types/company";
import { Globe, Library, Building2 } from "lucide-react";

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
  const { name, registrationNumber, jurisdiction, source } = result;
  
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

  // Get icon based on source
  const getSourceIcon = () => {
    switch (source) {
      case 'ISED_FEDERAL':
        return <Globe className="h-3.5 w-3.5 text-primary/70" />;
      case 'ONTARIO_REGISTRY':
        return <Building2 className="h-3.5 w-3.5 text-primary/70" />;
      case 'BUSINESS_REGISTRIES':
        return <Library className="h-3.5 w-3.5 text-primary/70" />;
      default:
        return <Globe className="h-3.5 w-3.5 text-primary/70" />;
    }
  };

  // Format source name for display
  const getSourceName = () => {
    switch (source) {
      case 'ISED_FEDERAL':
        return 'Federal';
      case 'ONTARIO_REGISTRY':
        return 'Ontario';
      case 'BUSINESS_REGISTRIES':
        return 'Business Registry';
      default:
        return '';
    }
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
          <span className={`w-2 h-2 rounded-full mr-1.5 opacity-70 ${
            jurisdiction === 'ONTARIO' 
              ? 'bg-green-500' 
              : jurisdiction === 'FEDERAL' 
                ? 'bg-blue-500' 
                : 'bg-primary'
          }`}></span>
          {jurisdiction.replace('_', ' ')}
        </span>
        <span>#{registrationNumber}</span>
        <span className="inline-flex items-center gap-1 text-xs">
          {getSourceIcon()}
          <span>{getSourceName()}</span>
        </span>
      </div>
    </div>
  );
};

export default SearchResult;
