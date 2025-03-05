import React, { useState, useRef, useEffect } from "react";
import { Search, X, ChevronDown, Loader2, Filter, ArrowLeft } from "lucide-react";
import { CompanySuggestion, Company, SearchOptions } from "@/types/company";
import { searchCompanies, getCompanyById } from "@/services/searchService";
import SearchResult from "./SearchResult";
import SearchSkeleton from "./SearchSkeleton";
import MagicalLoader from "./MagicalLoader";
import { useToast } from "@/components/ui/use-toast";
import { useDebounce } from '@/hooks/use-debounce';
import { Button } from "@/components/ui/button";
import CompanyInfoForm from "./CompanyInfoForm";

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
  const [showCompanyForm, setShowCompanyForm] = useState(false);
  const [showMagicalLoader, setShowMagicalLoader] = useState(false);
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
    if (selectedCompany) return;
    
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
  }, [debouncedQuery, toast, selectedCompany]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (selectedCompany && value !== selectedCompany.name) {
      setSelectedCompany(null);
      setShowCompanyForm(false);
    }
    
    if (!value.trim()) {
      setSelectedCompany(null);
      setResults([]);
      setTotalResults(0);
      setHasMore(false);
      setSearchError(null);
      setShowCompanyForm(false);
    }
    
    if (value.trim() && !isOpen && !selectedCompany) {
      setIsOpen(true);
    }
  };

  const handleInputFocus = () => {
    if (searchQuery.trim() && results.length > 0 && !selectedCompany) {
      setIsOpen(true);
    }
  };

  const handleSelectResult = async (result: CompanySuggestion) => {
    try {
      setIsLoading(true);
      setShowMagicalLoader(true);
      setIsOpen(false);
      
      const company = await getCompanyById(result.id);
      
      if (company) {
        setSelectedCompany(company);
        setSearchQuery(company.name);
        onCompanySelect?.(company);
        setResults([]);
        
        setTimeout(() => {
          setShowMagicalLoader(false);
          setShowCompanyForm(true);
        }, 1500);
      }
    } catch (error) {
      console.error("Error fetching company details:", error);
      setShowMagicalLoader(false);
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
    setShowCompanyForm(false);
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

  const handleSearch = () => {
    if (searchQuery.trim().length >= 2) {
      return;
    } else {
      toast({
        title: "Search Error",
        description: "Please enter at least 2 characters to search.",
        variant: "destructive",
      });
    }
  };

  if (showMagicalLoader) {
    return (
      <div className="w-full max-w-4xl mx-auto relative">
        <h2 className="text-2xl font-semibold mb-8">Processing</h2>
        <MagicalLoader />
      </div>
    );
  }

  if (showCompanyForm && selectedCompany) {
    return <CompanyInfoForm company={selectedCompany} onBack={() => {
      setShowCompanyForm(false);
      setSelectedCompany(null);
      setSearchQuery("");
    }} />;
  }

  return (
    <div className="w-full max-w-4xl mx-auto relative" ref={containerRef}>
      <h2 className="text-xl font-semibold mb-4">Search for your company</h2>
      
      <div className="flex w-full gap-3 mb-4">
        <div className="flex-1 border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-900">
          <input
            ref={inputRef}
            type="search"
            placeholder="Legal name or Corporation number 1234567890"
            value={searchQuery}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            className="block w-full px-4 py-4 focus:outline-none focus:ring-0 border-0 bg-transparent text-base placeholder:text-gray-400"
            aria-label="Search for a company"
            autoComplete="off"
          />
        </div>
        
        <Button 
          onClick={handleSearch}
          className="bg-[#0F172A] hover:bg-[#1E293B] text-white px-8 py-4 h-auto text-lg font-medium rounded-lg"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
          ) : (
            "Search"
          )}
        </Button>
      </div>
      
      {isOpen && !selectedCompany && (
        <div className="border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 shadow-lg max-h-[320px] overflow-y-auto overscroll-contain">
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
  );
};

export default CorporateSearch;
