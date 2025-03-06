import React, { useState, useRef, useEffect } from "react";
import { Search, X, ChevronDown, Loader2, Filter, ArrowLeft, RefreshCw, ShieldOff } from "lucide-react";
import { CompanySuggestion, Company, SearchOptions } from "@/types/company";
import { searchCompanies, getCompanyById, resetFallbackMode } from "@/services/searchService";
import SearchResult from "./SearchResult";
import SearchSkeleton from "./SearchSkeleton";
import MagicalLoader from "./MagicalLoader";
import { useToast } from "@/hooks/use-toast";
import { useDebounce } from '@/hooks/use-debounce';
import CompanyInfoForm from "./CompanyInfoForm";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface CorporateSearchProps {
  onCompanySelect?: (company: Company) => void;
  onBack?: () => void;
}

const CorporateSearch: React.FC<CorporateSearchProps> = ({ onCompanySelect, onBack }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
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
          toast({
            title: "Using Demonstration Mode",
            description: "Registry services are currently unavailable. Using demonstration data instead.",
            duration: 6000,
          });
        } else if (!isFallbackData && usingFallbackMode) {
          setUsingFallbackMode(false);
          toast({
            title: "Connected to Registry Services",
            description: "Successfully connected to the real company registry API.",
            duration: 3000,
          });
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
        toast({
          title: "Search Error",
          description: "Failed to connect to registry services. Using demonstration data instead.",
          variant: "destructive",
          duration: 6000,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [debouncedQuery, toast, selectedCompany, usingFallbackMode]);

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
        description: "Failed to fetch company details. Using demonstration data.",
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
    if (searchQuery.trim().length < 2) {
      toast({
        title: "Search Error",
        description: "Please enter at least 2 characters to search.",
        variant: "destructive",
      });
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
        toast({
          title: "No Results",
          description: "No companies found matching your search criteria.",
          duration: 3000,
        });
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
    
    toast({
      title: "Retrying API Connection",
      description: `Attempting to connect with fresh session data (attempt #${retryCount + 1})`,
      duration: 3000,
    });
    
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
        
        if (usingRealData) {
          toast({
            title: "Success!",
            description: "Connected to real registry services.",
            duration: 3000,
          });
        }
        
        if (result.companies.length > 0) {
          setIsOpen(true);
        } else {
          setIsOpen(true); // Show empty state
        }
      }).catch(error => {
        toast({
          title: "Error",
          description: "Failed to connect to registry services. Using demonstration data.",
          variant: "destructive",
        });
      }).finally(() => {
        setIsLoading(false);
      });
    }
  };

  const toggleAntiBlockingMode = () => {
    setAntiBlockingMode(!antiBlockingMode);
    toast({
      title: antiBlockingMode ? "Anti-Blocking Disabled" : "Anti-Blocking Enabled",
      description: antiBlockingMode 
        ? "Disabled session rotation and header randomization" 
        : "Enabled session rotation and header randomization",
      duration: 3000,
    });
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
        <div className="flex items-center gap-3 p-4 mb-4 text-blue-800 border-l-4 border-blue-500 bg-blue-50 rounded">
          <div className="flex-1">
            <p className="font-semibold">Using Demonstration Mode</p>
            <p className="text-sm">
              Registry services are currently unavailable. The API may be blocking requests.
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              size="sm"
              variant="outline"
              className="text-blue-600 border-blue-600 hover:bg-blue-50"
              onClick={handleRetryRealAPI}
              disabled={isLoading}
            >
              <RefreshCw size={14} className="mr-2" />
              {isLoading ? "Trying..." : "Try New Session"}
            </Button>
            <Button 
              size="sm"
              variant="ghost"
              onClick={() => setUsingFallbackMode(false)}
            >
              <X size={14} />
            </Button>
          </div>
        </div>
      )}
      
      <div className="flex w-full gap-3 mb-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            ref={inputRef}
            type="search"
            placeholder="Legal name or Corporation number 1234567890"
            value={searchQuery}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            className="pl-10 h-14 border-gray-300 rounded-lg"
          />
          {searchQuery && (
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3"
              onClick={handleClearSearch}
            >
              <X className="h-4 w-4 text-gray-400" />
            </button>
          )}
        </div>
        
        <Button
          onClick={handleSearch}
          className="h-14 px-8 bg-[#0F172A] hover:bg-[#1E293B] rounded-lg relative overflow-hidden group"
          disabled={isLoading}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#1E293B] to-[#0F172A] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="absolute inset-x-0 top-0 h-px bg-white/20"></div>
          <div className="absolute inset-x-0 bottom-0 h-px bg-black/20"></div>
          <span className="relative flex items-center gap-2 text-white">
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Searching</span>
              </>
            ) : (
              <span>Search</span>
            )}
          </span>
        </Button>
      </div>
      
      {isOpen && !selectedCompany && (
        <div className="border border-gray-200 rounded-lg bg-white shadow-lg max-h-[320px] overflow-y-auto">
          {isLoading && results.length === 0 ? (
            <SearchSkeleton count={3} />
          ) : searchError ? (
            <div className="py-6 text-center">
              <p className="text-red-500 mb-3">{searchError}</p>
              <Button 
                variant="outline"
                size="sm"
                onClick={handleRetryRealAPI}
                className="text-blue-600"
              >
                <RefreshCw size={16} className="mr-2" />
                Try New Session
              </Button>
            </div>
          ) : results.length > 0 ? (
            <>
              <div className="px-4 py-2 text-xs text-gray-500 bg-gray-50">
                <div className="flex justify-between items-center">
                  <span>Showing {results.length} of {totalResults} results</span>
                  <div className="flex items-center gap-1">
                    <Filter size={14} />
                    {usingFallbackMode ? (
                      <span>Demonstration Data</span>
                    ) : (
                      <div className="flex items-center">
                        <span>Registry API</span>
                        <span className="ml-1 px-1.5 py-0.5 text-xs font-semibold rounded-full bg-green-100 text-green-800">Live</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="divide-y divide-gray-100">
                {results.map(result => (
                  <SearchResult
                    key={result.id}
                    result={result}
                    searchQuery={searchQuery}
                    onSelect={(result) => {
                      setIsLoading(true);
                      setShowMagicalLoader(true);
                      setIsOpen(false);
                      
                      getCompanyById(result.id).then(company => {
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
                      }).catch(error => {
                        setShowMagicalLoader(false);
                        toast({
                          title: "Registry Error",
                          description: "Failed to fetch company details. Using demonstration data.",
                          variant: "destructive",
                        });
                      }).finally(() => {
                        setIsLoading(false);
                      });
                    }}
                  />
                ))}
              </div>
              {hasMore && (
                <Button 
                  onClick={loadMoreResults} 
                  variant="ghost"
                  className="w-full py-2 text-sm text-blue-600 hover:bg-gray-50"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-1">
                      <Loader2 size={14} className="animate-spin" />
                      <span>Loading...</span>
                    </div>
                  ) : (
                    'Load more results'
                  )}
                </Button>
              )}
            </>
          ) : searchQuery.trim().length >= 2 ? (
            <div className="py-6 text-center text-gray-500">
              <p className="mb-2">No companies found matching your search.</p>
              <p className="text-sm text-gray-400">Try a different company name or registration number.</p>
              {!usingFallbackMode && (
                <Button 
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => {
                    setUsingFallbackMode(true);
                    toast({
                      title: "Switched to Demonstration Mode",
                      description: "Now using sample company data for searching.",
                      duration: 3000,
                    });
                  }}
                >
                  Try Demonstration Data
                </Button>
              )}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default CorporateSearch;
