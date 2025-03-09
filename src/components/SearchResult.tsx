
import React from "react";
import {
  Box,
  Flex,
  Text,
  VStack,
  HStack,
} from "@chakra-ui/react";
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
  const hoverBgColor = "gray.50";
  
  // Highlight matching text
  const getHighlightedText = (text: string, highlight: string) => {
    if (!highlight.trim()) return text;
    
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    
    return (
      <>
        {parts.map((part, index) => 
          part.toLowerCase() === highlight.toLowerCase() ? 
            <Text as="span" key={index} fontWeight="medium" color="blue.600">{part}</Text> : 
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
        return 'green';
      case 'FEDERAL':
        return 'blue';
      case 'BRITISH_COLUMBIA':
        return 'purple';
      case 'ALBERTA':
        return 'red';
      default:
        return 'blue';
    }
  };

  // Format jurisdiction for display if available
  const getJurisdictionDisplay = () => {
    if (!jurisdiction) return null;
    
    return (
      <Flex alignItems="center">
        <Box 
          w="2px" 
          h="2px" 
          borderRadius="full" 
          mr={1.5} 
          bg={`${getJurisdictionColor()}.500`} 
          opacity={0.7}
        />
        <Text>{jurisdiction.replace(/_/g, ' ')}</Text>
      </Flex>
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
    <Box 
      p={4} 
      transition="all 0.3s" 
      _hover={{ bg: hoverBgColor }}
      cursor="pointer"
      onClick={() => onSelect(result)}
    >
      <Text fontWeight="medium" fontSize="base" mb={1}>
        {getHighlightedText(name, searchQuery)}
      </Text>
      <Flex alignItems="center" gap={3} fontSize="sm" color="gray.500">
        {getJurisdictionDisplay()}
        {registrationNumber && <Text>#{registrationNumber}</Text>}
        {incorporationDate && <Text fontSize="xs">Reg: {formatDate(incorporationDate)}</Text>}
        <Flex alignItems="center" gap={1} fontSize="xs">
          <Box color="blue.600" opacity={0.7}>
            {getSourceIcon()}
          </Box>
          <Text>{getSourceName()}</Text>
        </Flex>
      </Flex>
    </Box>
  );
};

export default SearchResult;
