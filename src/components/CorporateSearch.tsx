import React, { useState, useRef, useEffect } from "react";
import { Search, X, RefreshCw, Filter, ArrowLeft } from "lucide-react";
import { CompanySuggestion, Company, SearchOptions } from "@/types/company";
import { searchCompanies, getCompanyById, resetFallbackMode } from "@/services/searchService";
import SearchResult from "./SearchResult";
import SearchSkeleton from "./SearchSkeleton";
import MagicalLoader from "./MagicalLoader";
import { useDebounce } from '@/hooks/use-debounce';
import CompanyInfoForm from "./CompanyInfoForm";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface CorporateSearchProps {
  onCompanySelect?: (company: Company) => void;
  onBack?: () => void;
}

const CorporateSearch: React.FC<CorporateSearchProps> = ({ onCompanySelect, onBack }) => {
  const navigate = useNavigate();
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
  const [usingFallbackMode, setUsingFallbackMode] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [antiBlockingMode, setAntiBlockingMode] = useState(true);
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
        
        console.log("Sending search request for:", debouncedQuery);
        const { companies, total, hasMore } = await searchCompanies(searchOptions);
        
        console.log("Received companies:", companies);
        
        const isFallbackData = companies.some(c => 
          c.id === "13281230" || c.id === "13281229" || c.id === "9867543" || 
          c.id.startsWith("54321")
        );
        
        if (isFallbackData && !usingFallbackMode) {
          setUsingFallbackMode(true);
        } else if (!isFallbackData && usingFallbackMode) {
          setUsingFallbackMode(false);
        }
        
        setResults(companies);
        setTotalResults(total);
        setHasMore(hasMore);
        
        if (companies.length > 0) {
          setIsOpen(true);
        } else if (debouncedQuery.trim().length > 0) {
          setIsOpen(true); // Show empty results message
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
        setSearchError("Unable to connect to registry services. Using demonstration data instead.");
        setUsingFallbackMode(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [debouncedQuery, selectedCompany, usingFallbackMode]);

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
      
      console.log("Getting details for company:", result);
      const company = await getCompanyById(result.id);
      
      if (company) {
        console.log("Company details received:", company);
        setSelectedCompany(company);
        setSearchQuery(company.name);
        
        if (company.directors && company.directors.length > 0) {
          console.log("Company has directors:", company.directors);
        } else {
          console.log("No directors found for company");
        }
        
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim().length < 2) {
      return;
    }
    
    setIsLoading(true);
    resetFallbackMode();
    
    searchCompanies({
      query: searchQuery,
      limit: 5,
      offset: 0
    }).then(result => {
      setResults(result.companies);
      setTotalResults(result.total);
      setHasMore(result.hasMore);
      
      console.log("Search results:", result);
      
      if (result.companies.length > 0) {
        setIsOpen(true);
        const usingFallbackData = result.companies.some(c => 
          c.id === "13281230" || c.id === "13281229" || c.id === "9867543" || 
          c.id.startsWith("54321")
        );
        
        if (usingFallbackData) {
          setUsingFallbackMode(true);
        }
      } else {
        setIsOpen(true); // Show empty results message
      }
    }).catch(error => {
      console.error("Search error:", error);
      setSearchError("Failed to search. Using demonstration data.");
      setUsingFallbackMode(true);
    }).finally(() => {
      setIsLoading(false);
    });
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate("/");
    }
  };

  const handleCompanyFormBack = () => {
    setShowCompanyForm(false);
    setSelectedCompany(null);
    setSearchQuery("");
  };

  const handleCloseAlert = () => {
    setSearchError(null);
  };

  const handleRetryRealAPI = () => {
    resetFallbackMode();
    setUsingFallbackMode(false);
    setSearchError(null);
    setRetryCount(prev => prev + 1);
    
    if (searchQuery.trim().length >= 2) {
      setIsLoading(true);
      searchCompanies({
        query: searchQuery,
        limit: 5,
        offset: 0
      }).then(result => {
        setResults(result.companies);
        setTotalResults(result.total);
        setHasMore(result.hasMore);
        
        console.log("Retry search results:", result);
        
        const usingRealData = !result.companies.some(c => 
          c.id === "13281230" || c.id === "13281229" || c.id === "9867543" || 
          c.id.startsWith("54321")
        );
        
        if (result.companies.length > 0) {
          setIsOpen(true);
        } else {
          setIsOpen(true); // Show empty state
        }
      }).catch(error => {
      }).finally(() => {
        setIsLoading(false);
      });
    }
  };

  const toggleAntiBlockingMode = () => {
    setAntiBlockingMode(!antiBlockingMode);
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
    return <CompanyInfoForm company={selectedCompany} onBack={handleCompanyFormBack} />;
  }

  return (
    <div className="w-full relative" ref={containerRef}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Search for your company</h2>
      </div>
      
      {usingFallbackMode && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4 rounded-md">
          <div className="flex items-center gap-3 w-full">
            <div className="flex-1">
              <div className="font-semibold">Using Demonstration Mode</div>
              <div className="text-sm text-gray-600">
                Registry services are currently unavailable. The API may be blocking requests.
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                className="text-sm px-3 py-1 border border-blue-400 rounded text-blue-600 hover:bg-blue-100 transition-colors flex items-center gap-1"
                onClick={handleRetryRealAPI}
                disabled={isLoading}
              >
                <RefreshCw size={14} />
                {isLoading ? "Trying..." : "Try New Session"}
              </button>
              <button 
                aria-label="Close"
                onClick={() => setUsingFallbackMode(false)}
                className="text-gray-500 hover:text-gray-700 p-1"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="w-full flex gap-3 mb-4">
        <div className="relative flex-1">
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 text-gray-400">
              <Search size={20} />
            </div>
            <input
              ref={inputRef}
              type="search"
              placeholder="Legal name or Corporation number 1234567890"
              value={searchQuery}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              className="pl-10 h-14 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchQuery && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <button
                  aria-label="Clear search"
                  onClick={handleClearSearch}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
        
        <button
          onClick={handleSearch}
          className={`h-14 px-8 bg-gray-900 hover:bg-gray-700 rounded-lg relative overflow-hidden text-white ${isLoading ? 'opacity-80' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
              <span>Searching</span>
            </div>
          ) : (
            <span>Search</span>
          )}
        </button>
      </div>
      
      {isOpen && !selectedCompany && (
        <div 
          className="border border-gray-200 rounded-lg bg-white shadow-lg max-h-80 overflow-y-auto"
        >
          {isLoading && results.length === 0 ? (
            <SearchSkeleton count={3} />
          ) : searchError ? (
            <div className="py-6 text-center">
              <div className="text-red-500 mb-3">{searchError}</div>
              <button 
                className="px-4 py-1 border border-blue-500 rounded text-blue-600 hover:bg-blue-50 text-sm flex items-center gap-1 mx-auto"
                onClick={handleRetryRealAPI}
              >
                <RefreshCw size={16} />
                Try New Session
              </button>
            </div>
          ) : results.length > 0 ? (
            <>
              <div className="px-4 py-2 text-xs text-gray-500 bg-gray-50">
                <div className="flex justify-between items-center">
                  <span>Showing {results.length} of {totalResults} results</span>
                  <div className="flex items-center gap-1">
                    <Filter size={14} />
                    <span>{usingFallbackMode ? "Demonstration Data" : "Registry API"}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col">
                {results.map(result => (
                  <SearchResult
                    key={result.id}
                    result={result}
                    searchQuery={searchQuery}
                    onSelect={handleSelectResult}
                  />
                ))}
              </div>
              {hasMore && (
                <button 
                  onClick={loadMoreResults} 
                  className="w-full py-2 text-sm text-blue-600 hover:bg-gray-50 transition-colors"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-1 justify-center">
                      <div className="animate-spin h-3 w-3 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                      <span>Loading...</span>
                    </div>
                  ) : (
                    'Load more results'
                  )}
                </button>
              )}
            </>
          ) : searchQuery.trim().length >= 2 ? (
            <div className="py-6 text-center text-gray-500">
              <p className="mb-2">No companies found matching your search.</p>
              <p className="text-sm text-gray-400">Try a different company name or registration number.</p>
              {!usingFallbackMode && (
                <button 
                  className="px-4 py-1 border border-gray-300 rounded mt-4 text-sm hover:bg-gray-50"
                  onClick={() => {
                    setUsingFallbackMode(true);
                  }}
                >
                  Try Demonstration Data
                </button>
              )}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default CorporateSearch;
