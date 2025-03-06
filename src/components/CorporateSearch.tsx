import React, { useState, useRef, useEffect } from "react";
import { Search, X, ChevronDown, Loader2, Filter, ArrowLeft, RefreshCw, ShieldOff } from "lucide-react";
import { CompanySuggestion, Company, SearchOptions } from "@/types/company";
import { searchCompanies, getCompanyById, resetFallbackMode } from "@/services/searchService";
import SearchResult from "./SearchResult";
import SearchSkeleton from "./SearchSkeleton";
import MagicalLoader from "./MagicalLoader";
import { useToast } from "@/components/ui/use-toast";
import { useDebounce } from '@/hooks/use-debounce';
import CompanyInfoForm from "./CompanyInfoForm";
import { useNavigate } from "react-router-dom";
import { 
  Box, 
  Flex, 
  Heading, 
  Input, 
  InputGroup, 
  InputLeftElement, 
  Button, 
  Spinner,
  Text,
  VStack,
  Divider,
  IconButton,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
  Badge,
  Tooltip
} from "@chakra-ui/react";

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
        
        const { companies, total, hasMore } = await searchCompanies(searchOptions);
        
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
          setIsOpen(false);
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
        description: "Failed to fetch company details. Using demonstration data instead.",
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
    searchCompanies({
      query: searchQuery,
      limit: 5,
      offset: 0
    }).then(result => {
      setResults(result.companies);
      setTotalResults(result.total);
      setHasMore(result.hasMore);
      
      if (result.companies.length > 0) {
        setIsOpen(true);
      } else {
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
    <Box w="full" maxW="4xl" mx="auto" position="relative" ref={containerRef}>
      <Flex justify="space-between" align="center" mb={4}>
        <Heading as="h2" fontSize="xl" fontWeight="semibold">Search for your company</Heading>
        
        <Tooltip label={antiBlockingMode ? "Anti-Blocking Enabled" : "Anti-Blocking Disabled"}>
          <Button
            size="sm"
            leftIcon={antiBlockingMode ? <ShieldOff size={14} /> : <ShieldOff size={14} />}
            variant={antiBlockingMode ? "solid" : "outline"}
            colorScheme={antiBlockingMode ? "green" : "gray"}
            onClick={toggleAntiBlockingMode}
          >
            {antiBlockingMode ? "Anti-Block" : "Standard"}
          </Button>
        </Tooltip>
      </Flex>
      
      {usingFallbackMode && (
        <Alert status="info" mb={4} borderRadius="md">
          <AlertIcon />
          <Box flex="1">
            <AlertTitle>Using Demonstration Mode</AlertTitle>
            <AlertDescription>
              Registry services are currently unavailable. The API may be blocking requests based on cookies, sessions, or IP address.
            </AlertDescription>
          </Box>
          <Flex>
            <Button 
              leftIcon={<RefreshCw size={16} />}
              size="sm"
              colorScheme="blue"
              mr={2}
              onClick={handleRetryRealAPI}
              isLoading={isLoading}
            >
              New Session
            </Button>
            <CloseButton 
              onClick={() => setUsingFallbackMode(false)} 
            />
          </Flex>
        </Alert>
      )}
      
      <Flex w="full" gap={3} mb={4}>
        <Box flex="1" borderWidth="1px" borderColor="gray.300" borderRadius="lg" overflow="hidden" bg="white" position="relative">
          <InputGroup size="lg">
            <InputLeftElement pointerEvents="none">
              <Search size={20} color="gray.400" />
            </InputLeftElement>
            <Input
              ref={inputRef}
              type="search"
              placeholder="Legal name or Corporation number 1234567890"
              value={searchQuery}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              border="none"
              _focus={{ outline: "none", ring: 0 }}
              py={4}
            />
          </InputGroup>
          {searchQuery && (
            <IconButton
              aria-label="Clear search"
              icon={<X size={16} />}
              size="sm"
              variant="ghost"
              position="absolute"
              right="2"
              top="50%"
              transform="translateY(-50%)"
              onClick={handleClearSearch}
              zIndex={2}
            />
          )}
        </Box>
        
        <button
          onClick={handleSearch}
          className="relative h-14 px-8 overflow-hidden rounded-full group"
          style={{
            background: 'linear-gradient(to right, #0F172A, #1E293B)',
            boxShadow: '0 10px 25px -3px rgba(15, 23, 42, 0.5)'
          }}
        >
          <div className="absolute inset-0 w-full h-full transition duration-300 ease-out opacity-0 bg-gradient-to-r from-[#1a2436] to-[#2d3a4f] group-hover:opacity-100"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-black/25 opacity-0 group-hover:opacity-100"></div>
          <div className="absolute bottom-0 left-0 w-full h-[1px] bg-white/10"></div>
          <div className="absolute top-[-1px] left-0 w-full h-[1px] bg-white/20"></div>
          
          <div className="absolute inset-0 rounded-full overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute top-0 left-0 right-0 h-[40%] bg-gradient-to-b from-white/10 to-transparent"></div>
            <div className="absolute -left-1/4 -top-1/2 w-1/2 h-1/2 bg-white/5 rounded-full blur-xl group-hover:animate-pulse"></div>
          </div>
          
          <div className="relative flex items-center justify-center gap-2">
            {isLoading ? (
              <>
                <Spinner size="sm" color="white" />
                <span className="text-white font-medium text-base">Searching</span>
              </>
            ) : (
              <span className="text-white font-medium text-base">Search</span>
            )}
          </div>
          
          <div className="absolute inset-0 w-full h-full transition duration-300 ease-out opacity-0 group-hover:opacity-30 pointer-events-none" 
               style={{
                 backgroundImage: 'radial-gradient(circle at top, rgba(255,255,255,0.1) 0%, transparent 70%)',
               }}></div>
        </button>
      </Flex>
      
      {isOpen && !selectedCompany && (
        <Box
          borderWidth="1px"
          borderColor="gray.200"
          borderRadius="lg"
          bg="white"
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
                leftIcon={<RefreshCw size={16} />}
                size="sm"
                colorScheme="blue"
                onClick={handleRetryRealAPI}
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
                    {usingFallbackMode ? (
                      <Text>Demonstration Data</Text>
                    ) : (
                      <Flex alignItems="center">
                        <Text>Registry API</Text>
                        <Badge ml={1} colorScheme="green" variant="solid" size="xs">Live</Badge>
                      </Flex>
                    )}
                  </Flex>
                </Flex>
              </Box>
              <VStack spacing={0} align="stretch" divider={<Divider />}>
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
                  w="full" 
                  variant="ghost" 
                  py={2} 
                  fontSize="sm" 
                  color="blue.600" 
                  _hover={{ bg: "gray.50" }}
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
              {!usingFallbackMode ? (
                <Button 
                  mt={4} 
                  size="sm" 
                  colorScheme="blue"
                  variant="outline"
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
              ) : null}
            </Box>
          ) : null}
        </Box>
      )}
    </Box>
  );
};

export default CorporateSearch;
