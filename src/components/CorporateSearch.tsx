import React, { useState, useRef, useEffect } from "react";
import { Search, X, ChevronDown, Loader2, Filter, ArrowLeft } from "lucide-react";
import { CompanySuggestion, Company, SearchOptions } from "@/types/company";
import { searchCompanies, getCompanyById } from "@/services/searchService";
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
  IconButton
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
      <Heading as="h2" fontSize="xl" fontWeight="semibold" mb={4}>Search for your company</Heading>
      
      <Flex w="full" gap={3} mb={4}>
        <Box flex="1" borderWidth="1px" borderColor="gray.300" borderRadius="lg" overflow="hidden" bg="white">
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
        </Box>
        
        <Button
          onClick={handleSearch}
          bg="#0F172A"
          _hover={{ bg: "#1E293B" }}
          color="white"
          px={8}
          py={4}
          h="auto"
          fontSize="lg"
          fontWeight="medium"
          borderRadius="lg"
          isLoading={isLoading}
          loadingText="Searching"
          spinner={<Spinner size="sm" />}
        >
          Search
        </Button>
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
            <Box py={6} textAlign="center" color="red.500">
              {searchError}
            </Box>
          ) : results.length > 0 ? (
            <>
              <Box px={4} py={2} fontSize="xs" color="gray.500" bg="gray.50">
                <Flex justifyContent="space-between" alignItems="center">
                  <Text>Showing {results.length} of {totalResults} results</Text>
                  <Flex alignItems="center" gap={1}>
                    <Filter size={14} />
                    <Text>Canada Business Registry</Text>
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
              No companies found matching your search.
            </Box>
          ) : null}
        </Box>
      )}
    </Box>
  );
};

export default CorporateSearch;
