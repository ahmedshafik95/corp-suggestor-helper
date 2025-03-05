
import React from "react";
import { Loader2 } from "lucide-react";
import { Box, Flex, Text, Heading, Spinner, VStack, HStack, keyframes } from "@chakra-ui/react";

interface MagicalLoaderProps {
  message?: string;
}

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const MagicalLoader: React.FC<MagicalLoaderProps> = ({ 
  message = "Processing company information..." 
}) => {
  const pulseAnimation = `${pulse} 1.5s ease-in-out infinite`;

  return (
    <Flex flexDir="column" alignItems="center" justifyContent="center" py={16} gap={8}>
      <Box position="relative">
        <Box 
          w="80px" 
          h="80px" 
          borderRadius="full" 
          borderWidth="4px" 
          borderColor="gray.200" 
          animation="spin 2s linear infinite"
        />
        <Flex 
          position="absolute" 
          inset={0} 
          alignItems="center" 
          justifyContent="center"
        >
          <Spinner size="xl" color="blue.600" thickness="4px" />
        </Flex>
      </Box>
      
      <VStack spacing={3} textAlign="center">
        <Heading as="h3" fontSize="xl" fontWeight="semibold" color="gray.800">
          {message}
        </Heading>
        <Text color="gray.500" maxW="md">
          We're retrieving and preparing all available information
        </Text>
      </VStack>
      
      <HStack spacing={1} mt={2}>
        <Box 
          w="3px" 
          h="3px" 
          borderRadius="full" 
          bg="gray.300" 
          sx={{ animation: pulseAnimation }}
        />
        <Box 
          w="3px" 
          h="3px" 
          borderRadius="full" 
          bg="gray.400" 
          sx={{ animation: pulseAnimation, animationDelay: "0.1s" }}
        />
        <Box 
          w="3px" 
          h="3px" 
          borderRadius="full" 
          bg="gray.500" 
          sx={{ animation: pulseAnimation, animationDelay: "0.2s" }}
        />
      </HStack>
    </Flex>
  );
};

export default MagicalLoader;
