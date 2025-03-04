
import React, { useState, useRef, useEffect } from "react";
import { Search, X, ChevronDown, Loader2 } from "lucide-react";
import { CompanySuggestion, Company } from "@/types/company";
import { searchCompanies, getCompanyById } from "@/services/searchService";
import SearchResult from "./SearchResult";
import SearchSkeleton from "./SearchSkeleton";
import { useToast } from "@/components/ui/use-toast";
import { useDebounce } from '@/hooks/use-debounce';

interface CorporateSearchProps {
  onCompanySelect?: (company: Company) => void;
}

const CorporateSearch: React.FC<CorporateSearchProps> = ({ onCompanySelect }) => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<CompanySuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const debouncedQuery = useDebounce(searchQuery, 300);

  const handleClickOutside = (event: MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchResults = async () => {
      if (debouncedQuery.trim().length < 2) {
        setResults([]);
        return;
      }
      
      try {
        setIsLoading(true);
        const data = await searchCompanies(debouncedQuery);
        setResults(data);
        
        // Open the dropdown if we have results
        if (data.length > 0) {
          setIsOpen(true);
        } else if (debouncedQuery.trim().length > 0) {
          // Only set isOpen to false if there are no results AND we have a query
          setIsOpen(false);
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
        toast({
          title: "Error",
          description: "Failed to fetch search results. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [debouncedQuery, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // If the input is cleared, reset the selected company
    if (!value.trim()) {
      setSelectedCompany(null);
    }
    
    // Open dropdown if there's text and we're not already open
    if (value.trim() && !isOpen) {
      setIsOpen(true);
    }
  };

  const handleInputFocus = () => {
    // Open dropdown on focus if we have a query and results
    if (searchQuery.trim() && results.length > 0) {
      setIsOpen(true);
    }
  };

  const handleSelectResult = async (result: CompanySuggestion) => {
    try {
      setIsLoading(true);
      const company = await getCompanyById(result.id);
      
      if (company) {
        setSelectedCompany(company);
        setSearchQuery(company.name);
        onCompanySelect?.(company);
        setIsOpen(false);
      }
    } catch (error) {
      console.error("Error fetching company details:", error);
      toast({
        title: "Error",
        description: "Failed to fetch company details. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSelectedCompany(null);
    setResults([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div className="w-full max-w-xl mx-auto relative" ref={containerRef}>
      <div className="glass-panel rounded-xl overflow-hidden flex flex-col">
        {/* Search input */}
        <div className="relative">
          <div className="absolute left-4 inset-y-0 flex items-center pointer-events-none text-gray-400">
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
            ) : (
              <Search className="h-5 w-5" aria-hidden="true" />
            )}
          </div>
          
          <input
            ref={inputRef}
            type="search"
            placeholder="Search for Ontario or Federal corporations..."
            value={searchQuery}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            className="block w-full pl-12 pr-12 py-4 focus:outline-none focus:ring-0 border-0 bg-transparent text-base placeholder:text-gray-400"
            aria-label="Search for a company"
            autoComplete="off"
          />
          
          <div className="absolute right-4 inset-y-0 flex items-center">
            {searchQuery ? (
              <button 
                onClick={handleClearSearch} 
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Clear search"
              >
                <X className="h-5 w-5" />
              </button>
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
            )}
          </div>
        </div>
        
        {/* Results dropdown */}
        {isOpen && (
          <div className="border-t border-gray-100 dark:border-gray-800 max-h-[320px] overflow-y-auto overscroll-contain">
            {isLoading ? (
              <SearchSkeleton count={3} />
            ) : results.length > 0 ? (
              results.map(result => (
                <SearchResult
                  key={result.id}
                  result={result}
                  searchQuery={searchQuery}
                  onSelect={handleSelectResult}
                />
              ))
            ) : searchQuery.trim().length >= 2 ? (
              <div className="py-6 text-center text-gray-500">
                No companies found matching your search.
              </div>
            ) : null}
          </div>
        )}
      </div>
      
      {/* Selected company details */}
      {selectedCompany && (
        <div className="mt-8 glass-panel rounded-xl p-6 animate-fade-in">
          <h2 className="text-xl font-medium mb-4">{selectedCompany.name}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="text-sm text-gray-500 w-32">Jurisdiction:</span>
                <span className="font-medium">{selectedCompany.jurisdiction}</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-500 w-32">Reg. Number:</span>
                <span className="font-medium">{selectedCompany.registrationNumber}</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-500 w-32">Status:</span>
                <span className="font-medium flex items-center">
                  <span 
                    className={`w-2 h-2 rounded-full mr-1.5 ${
                      selectedCompany.status === 'ACTIVE' 
                        ? 'bg-green-500' 
                        : selectedCompany.status === 'INACTIVE' 
                          ? 'bg-yellow-500' 
                          : 'bg-red-500'
                    }`}
                  ></span>
                  {selectedCompany.status}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="text-sm text-gray-500 w-32">Type:</span>
                <span className="font-medium">{selectedCompany.type.replace(/_/g, ' ')}</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-500 w-32">Incorporated:</span>
                <span className="font-medium">
                  {new Date(selectedCompany.incorporationDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CorporateSearch;
