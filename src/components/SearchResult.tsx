
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
  const { name, registrationNumber, jurisdiction, source, incorporationDate } = result;
  
  // Highlight matching text
  const getHighlightedText = (text: string, highlight: string) => {
    if (!highlight.trim()) return text;
    
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    
    return (
      <>
        {parts.map((part, index) => 
          part.toLowerCase() === highlight.toLowerCase() ? 
            <span key={index} className="font-medium text-blue-600">{part}</span> : 
            part
        )}
      </>
    );
  };

  // Get icon based on source
  const getSourceIcon = () => {
    switch (source) {
      case 'ISED_FEDERAL':
        return <Globe size={14} />;
      case 'ONTARIO_REGISTRY':
        return <Building2 size={14} />;
      case 'BUSINESS_REGISTRIES':
        return <Library size={14} />;
      default:
        return <Globe size={14} />;
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

  // Get jurisdiction badge color
  const getJurisdictionColor = () => {
    switch (jurisdiction) {
      case 'ONTARIO':
        return 'bg-green-500';
      case 'FEDERAL':
        return 'bg-blue-500';
      case 'BRITISH_COLUMBIA':
        return 'bg-purple-500';
      case 'ALBERTA':
        return 'bg-red-500';
      default:
        return 'bg-blue-500';
    }
  };

  // Format jurisdiction for display if available
  const getJurisdictionDisplay = () => {
    if (!jurisdiction) return null;
    
    return (
      <div className="flex items-center">
        <div 
          className={`w-[2px] h-[2px] rounded-full mr-1.5 opacity-70 ${getJurisdictionColor()}`}
        />
        <span>{jurisdiction.replace(/_/g, ' ')}</span>
      </div>
    );
  };

  // Format date for display
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return null;
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (e) {
      return null;
    }
  };

  return (
    <div 
      className="p-4 transition-all duration-300 hover:bg-gray-50 cursor-pointer"
      onClick={() => onSelect(result)}
    >
      <div className="font-medium text-base mb-1">
        {getHighlightedText(name, searchQuery)}
      </div>
      <div className="flex items-center gap-3 text-sm text-gray-500">
        {getJurisdictionDisplay()}
        {registrationNumber && <div>#{registrationNumber}</div>}
        {incorporationDate && <div className="text-xs">Reg: {formatDate(incorporationDate)}</div>}
        <div className="flex items-center gap-1 text-xs">
          <div className="text-blue-600 opacity-70">
            {getSourceIcon()}
          </div>
          <span>{getSourceName()}</span>
        </div>
      </div>
    </div>
  );
};

export default SearchResult;
