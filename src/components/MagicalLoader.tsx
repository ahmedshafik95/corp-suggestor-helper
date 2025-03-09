
import React from "react";
import {
  Box,
  Flex,
  Text,
  Heading,
  Spinner,
  VStack,
  HStack,
} from "@chakra-ui/react";

interface MagicalLoaderProps {
  message?: string;
}

const MagicalLoader: React.FC<MagicalLoaderProps> = ({ 
  message = "Processing company information..." 
}) => {
  const spinnerColor = "blue.600";
  const borderColor = "gray.200";
  const textColor = "gray.800";
  const subTextColor = "gray.500";

  return (
    <Flex flexDirection="column" alignItems="center" justifyContent="center" py={16} gap={8}>
      <Box position="relative">
        <Box 
          w="80px" 
          h="80px" 
          borderRadius="full" 
          borderWidth="4px" 
          borderColor={borderColor}
          style={{ animation: "spin 2s linear infinite" }}
        />
        <Flex 
          position="absolute" 
          inset={0} 
          alignItems="center" 
          justifyContent="center"
        >
          <Spinner size="xl" color={spinnerColor} />
        </Flex>
      </Box>
      
      <VStack gap={3} textAlign="center">
        <Heading as="h3" fontSize="xl" fontWeight="semibold" color={textColor}>
          {message}
        </Heading>
        <Text color={subTextColor} maxW="md">
          We're retrieving and preparing all available information
        </Text>
      </VStack>
      
      <HStack gap={1} mt={2}>
        <Box 
          w="3px" 
          h="3px" 
          borderRadius="full" 
          bg="gray.300" 
          style={{ animation: "pulse 1.5s ease-in-out infinite" }}
        />
        <Box 
          w="3px" 
          h="3px" 
          borderRadius="full" 
          bg="gray.400" 
          style={{ animation: "pulse 1.5s ease-in-out infinite", animationDelay: "0.1s" }}
        />
        <Box 
          w="3px" 
          h="3px" 
          borderRadius="full" 
          bg="gray.500" 
          style={{ animation: "pulse 1.5s ease-in-out infinite", animationDelay: "0.2s" }}
        />
      </HStack>
      
      <style>
{`
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`}
      </style>
    </Flex>
  );
};

export default MagicalLoader;
