
import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Flex,
  Input,
  Button,
  Text,
  VStack,
  Alert as ChakraAlert,
  AlertTitle,
  AlertDescription,
  CloseButton,
  IconButton,
  Spinner,
} from "@chakra-ui/react";
import { Search, X, ChevronRight, RefreshCw, Filter, ArrowLeft, ShieldOff } from "lucide-react";
import { CompanySuggestion, Company, SearchOptions } from "@/types/company";
import { searchCompanies, getCompanyById, resetFallbackMode } from "@/services/searchService";
import SearchResult from "./SearchResult";
import SearchSkeleton from "./SearchSkeleton";
import MagicalLoader from "./MagicalLoader";
import { useDebounce } from '@/hooks/use-debounce';
import CompanyInfoForm from "./CompanyInfoForm";
import { useNavigate } from "react-router-dom";

interface CorporateSearchProps {
  onCompanySelect?: (company: Company) => void;
  onBack?: () => void;
}

const CorporateSearch: React.FC<CorporateSearchProps> = ({ onCompanySelect, onBack }) => {
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
  const bgColor = "white";
  const borderColor = "gray.200";

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
          // Toast will be handled in UI alert component instead
        } else if (!isFallbackData && usingFallbackMode) {
          setUsingFallbackMode(false);
          // Toast will be handled in UI alert component instead
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
      <Box w="full" maxW="4xl" mx="auto" position="relative">
        <Box as="h2" fontSize="2xl" fontWeight="semibold" mb={8}>Processing</Box>
        <MagicalLoader />
      </Box>
    );
  }

  if (showCompanyForm && selectedCompany) {
    return <CompanyInfoForm company={selectedCompany} onBack={handleCompanyFormBack} />;
  }

  return (
    <Box w="full" position="relative" ref={containerRef}>
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <Box as="h2" fontSize="xl" fontWeight="semibold">Search for your company</Box>
      </Flex>
      
      {usingFallbackMode && (
        <ChakraAlert status="info" variant="left-accent" mb={4} rounded="md">
          <Flex alignItems="center" gap={3} width="full">
            <Box flex="1">
              <AlertTitle fontWeight="semibold">Using Demonstration Mode</AlertTitle>
              <AlertDescription fontSize="sm">
                Registry services are currently unavailable. The API may be blocking requests.
              </AlertDescription>
            </Box>
            <Flex gap={2}>
              <Button 
                size="sm"
                variant="outline"
                colorScheme="blue"
                onClick={handleRetryRealAPI}
                disabled={isLoading}
              >
                <RefreshCw size={14} style={{ marginRight: '4px' }} />
                {isLoading ? "Trying..." : "Try New Session"}
              </Button>
              <IconButton 
                aria-label="Close"
                onClick={() => setUsingFallbackMode(false)}
                size="sm"
                variant="ghost"
              >
                <X size={14} />
              </IconButton>
            </Flex>
          </Flex>
        </ChakraAlert>
      )}
      
      <Flex w="full" gap={3} mb={4}>
        <Box position="relative" flex="1">
          <Flex position="relative">
            <Box position="absolute" left={3} top="50%" transform="translateY(-50%)" zIndex={1}>
              <Search color="gray.400" size={20} />
            </Box>
            <Input
              ref={inputRef}
              type="search"
              placeholder="Legal name or Corporation number 1234567890"
              value={searchQuery}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              pl={10}
              h={14}
              borderColor="gray.300"
              rounded="lg"
            />
            {searchQuery && (
              <Box position="absolute" right={3} top="50%" transform="translateY(-50%)">
                <IconButton
                  aria-label="Clear search"
                  onClick={handleClearSearch}
                  variant="ghost"
                  size="sm"
                  color="gray.400"
                >
                  <X size={16} />
                </IconButton>
              </Box>
            )}
          </Flex>
        </Box>
        
        <Button
          onClick={handleSearch}
          h={14}
          px={8}
          bg="gray.900"
          _hover={{ bg: "gray.700" }}
          rounded="lg"
          position="relative"
          overflow="hidden"
          disabled={isLoading}
          color="white"
        >
          {isLoading ? (
            <Flex alignItems="center" gap={2}>
              <Spinner size="sm" />
              <Text>Searching</Text>
            </Flex>
          ) : (
            <Text>Search</Text>
          )}
        </Button>
      </Flex>
      
      {isOpen && !selectedCompany && (
        <Box 
          borderWidth="1px" 
          borderColor={borderColor} 
          rounded="lg" 
          bg={bgColor} 
          shadow="lg" 
          maxH="320px" 
          overflowY="auto"
        >
          {isLoading && results.length === 0 ? (
            <SearchSkeleton count={3} />
          ) : searchError ? (
            <Box py={6} textAlign="center">
              <Text color="red.500" mb={3}>{searchError}</Text>
              <Button 
                variant="outline"
                size="sm"
                onClick={handleRetryRealAPI}
                colorScheme="blue"
              >
                <RefreshCw size={16} style={{ marginRight: '4px' }} />
                Try New Session
              </Button>
            </Box>
          ) : results.length > 0 ? (
            <>
              <Box px={4} py={2} fontSize="xs" color="gray.500" bg="gray.50">
                <Flex justifyContent="space-between" alignItems="center">
                  <Text>Showing {results.length} of {totalResults} results</Text>
                  <Flex alignItems="center" gap={1}>
                    <Filter size={14} />
                    <Text>{usingFallbackMode ? "Demonstration Data" : "Registry API"}</Text>
                  </Flex>
                </Flex>
              </Box>
              <VStack divider={<Box h="1px" w="100%" bg="gray.200" />} align="stretch">
                {results.map(result => (
                  <SearchResult
                    key={result.id}
                    result={result}
                    searchQuery={searchQuery}
                    onSelect={handleSelectResult}
                  />
                ))}
              </VStack>
              {hasMore && (
                <Button 
                  onClick={loadMoreResults} 
                  variant="ghost"
                  w="full" 
                  py={2} 
                  fontSize="sm" 
                  colorScheme="blue"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Flex alignItems="center" gap={1}>
                      <Spinner size="xs" />
                      <Text>Loading...</Text>
                    </Flex>
                  ) : (
                    'Load more results'
                  )}
                </Button>
              )}
            </>
          ) : searchQuery.trim().length >= 2 ? (
            <Box py={6} textAlign="center" color="gray.500">
              <Text mb={2}>No companies found matching your search.</Text>
              <Text fontSize="sm" color="gray.400">Try a different company name or registration number.</Text>
              {!usingFallbackMode && (
                <Button 
                  variant="outline"
                  size="sm"
                  mt={4}
                  onClick={() => {
                    setUsingFallbackMode(true);
                  }}
                >
                  Try Demonstration Data
                </Button>
              )}
            </Box>
          ) : null}
        </Box>
      )}
    </Box>
  );
};

export default CorporateSearch;
