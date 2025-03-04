import React, { useState, useRef, useEffect } from "react";
import { Search, X, ChevronDown, Loader2, Filter } from "lucide-react";
import { CompanySuggestion, Company, SearchOptions } from "@/types/company";
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
  const [totalResults, setTotalResults] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
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
        setTotalResults(0);
        setHasMore(false);
        setSearchError(null);
        return;
      }
      
      try {
        setIsLoading(true);
        setSearchError(null);
        
        const searchOptions: SearchOptions = {
          query: debouncedQuery,
          limit: 5,
          offset: 0
        };
        
        const { companies, total, hasMore } = await searchCompanies(searchOptions);
        
        setResults(companies);
        setTotalResults(total);
        setHasMore(hasMore);
        
        if (companies.length > 0) {
          setIsOpen(true);
        } else if (debouncedQuery.trim().length > 0) {
          setIsOpen(false);
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
        setSearchError("Failed to connect to registry services. Please try again.");
        toast({
          title: "Search Error",
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
    
    if (!value.trim()) {
      setSelectedCompany(null);
      setResults([]);
      setTotalResults(0);
      setHasMore(false);
      setSearchError(null);
    }
    
    if (value.trim() && !isOpen) {
      setIsOpen(true);
    }
  };

  const handleInputFocus = () => {
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
        title: "Registry Error",
        description: "Failed to fetch company details from registry. The service may be temporarily unavailable.",
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
    setTotalResults(0);
    setHasMore(false);
    setSearchError(null);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const loadMoreResults = async () => {
    if (!hasMore || isLoading) return;
    
    try {
      setIsLoading(true);
      
      const searchOptions: SearchOptions = {
        query: debouncedQuery,
        limit: 5,
        offset: results.length
      };
      
      const { companies, hasMore: moreResults } = await searchCompanies(searchOptions);
      
      setResults(prev => [...prev, ...companies]);
      setHasMore(moreResults);
    } catch (error) {
      console.error("Error loading more results:", error);
      toast({
        title: "Error",
        description: "Failed to load more results. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto relative" ref={containerRef}>
      <div className="glass-panel rounded-xl overflow-hidden flex flex-col">
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
            placeholder="Search for companies in Canada Business Registry..."
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
        
        {isOpen && (
          <div className="border-t border-gray-100 dark:border-gray-800 max-h-[320px] overflow-y-auto overscroll-contain">
            {isLoading && results.length === 0 ? (
              <SearchSkeleton count={3} />
            ) : searchError ? (
              <div className="py-6 text-center text-red-500">
                {searchError}
              </div>
            ) : results.length > 0 ? (
              <>
                <div className="px-4 py-2 text-xs text-gray-500 bg-gray-50 dark:bg-gray-800/50">
                  <div className="flex justify-between items-center">
                    <span>Showing {results.length} of {totalResults} results</span>
                    <div className="flex items-center gap-1">
                      <Filter className="h-3.5 w-3.5" />
                      <span>Canada Business Registry</span>
                    </div>
                  </div>
                </div>
                {results.map(result => (
                  <SearchResult
                    key={result.id}
                    result={result}
                    searchQuery={searchQuery}
                    onSelect={handleSelectResult}
                  />
                ))}
                {hasMore && (
                  <button 
                    onClick={loadMoreResults} 
                    className="w-full py-2 text-sm text-primary hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-1">
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        Loading...
                      </span>
                    ) : (
                      'Load more results'
                    )}
                  </button>
                )}
              </>
            ) : searchQuery.trim().length >= 2 ? (
              <div className="py-6 text-center text-gray-500">
                No companies found matching your search.
              </div>
            ) : null}
          </div>
        )}
      </div>
      
      {selectedCompany && (
        <div className="mt-8 glass-panel rounded-xl p-6 animate-fade-in">
          <h2 className="text-xl font-semibold mb-4">{selectedCompany.name}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="text-sm text-gray-500 w-32">Jurisdiction:</span>
                <span className="font-medium">{selectedCompany.jurisdiction.replace('_', ' ')}</span>
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
                  {selectedCompany.status.replace('_', ' ')}
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
              {selectedCompany.businessNumber && (
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 w-32">Business #:</span>
                  <span className="font-medium">{selectedCompany.businessNumber}</span>
                </div>
              )}
            </div>
          </div>
          
          {selectedCompany.address && (
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
              <h3 className="text-sm font-medium mb-2">Registered Address</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {selectedCompany.address.street}, {selectedCompany.address.city}, {selectedCompany.address.province}, {selectedCompany.address.postalCode}
              </p>
            </div>
          )}
          
          {selectedCompany.directors && selectedCompany.directors.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
              <h3 className="text-sm font-medium mb-2">Directors</h3>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                {selectedCompany.directors.map((director, index) => (
                  <li key={index} className="flex">
                    <span className="font-medium">{director.name}</span>
                    {director.position && (
                      <span className="ml-2 text-gray-500">({director.position})</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-500">
            <p>
              Source: {selectedCompany.source === 'ISED_FEDERAL' 
                ? 'Federal Corporate Registry (ISED-ISDE)' 
                : selectedCompany.source === 'ONTARIO_REGISTRY'
                  ? 'Ontario Business Registry'
                  : "Canada's Business Registries"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CorporateSearch;
