
import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Button,
  Text,
  VStack,
  Divider,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
  useToast,
  IconButton,
  Spinner,
  useColorModeValue,
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
  const toast = useToast();
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
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

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
            status: "info",
            duration: 6000,
            isClosable: true,
          });
        } else if (!isFallbackData && usingFallbackMode) {
          setUsingFallbackMode(false);
          toast({
            title: "Connected to Registry Services",
            description: "Successfully connected to the real company registry API.",
            status: "success",
            duration: 3000,
            isClosable: true,
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
          status: "error",
          duration: 6000,
          isClosable: true,
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
      toast({
        title: "Registry Error",
        description: "Failed to fetch company details. Using demonstration data.",
        status: "error",
        isClosable: true,
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
        status: "error",
        isClosable: true,
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
        status: "error",
        isClosable: true,
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
          status: "info",
          duration: 3000,
          isClosable: true,
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
      status: "info",
      duration: 3000,
      isClosable: true,
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
            status: "success",
            duration: 3000,
            isClosable: true,
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
          status: "error",
          isClosable: true,
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
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  if (showMagicalLoader) {
    return (
      <Box w="full" maxW="4xl" mx="auto" position="relative">
        <Heading as="h2" fontSize="2xl" fontWeight="semibold" mb={8}>Processing</Heading>
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
        <Heading as="h2" fontSize="xl" fontWeight="semibold">Search for your company</Heading>
      </Flex>
      
      {usingFallbackMode && (
        <Alert status="info" variant="left-accent" mb={4} rounded="md">
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
                isDisabled={isLoading}
                leftIcon={<RefreshCw size={14} />}
              >
                {isLoading ? "Trying..." : "Try New Session"}
              </Button>
              <IconButton 
                aria-label="Close"
                icon={<X size={14} />}
                size="sm"
                variant="ghost"
                onClick={() => setUsingFallbackMode(false)}
              />
            </Flex>
          </Flex>
        </Alert>
      )}
      
      <Flex w="full" gap={3} mb={4}>
        <Box position="relative" flex="1">
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <Search color="gray.400" size={20} />
            </InputLeftElement>
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
                  icon={<X size={16} />}
                  variant="ghost"
                  size="sm"
                  color="gray.400"
                  onClick={handleClearSearch}
                />
              </Box>
            )}
          </InputGroup>
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
          isDisabled={isLoading}
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
                leftIcon={<RefreshCw size={16} />}
              >
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
              <VStack spacing={0} divider={<Divider />} align="stretch">
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
                  isDisabled={isLoading}
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
                    toast({
                      title: "Switched to Demonstration Mode",
                      description: "Now using sample company data for searching.",
                      status: "info",
                      duration: 3000,
                      isClosable: true,
                    });
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
