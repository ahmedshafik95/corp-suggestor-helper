
import React from "react";
import {
  Box,
  Flex,
  Text,
  Heading,
  Spinner,
  VStack,
  HStack,
  keyframes,
  useColorModeValue,
} from "@chakra-ui/react";

interface MagicalLoaderProps {
  message?: string;
}

const MagicalLoader: React.FC<MagicalLoaderProps> = ({ 
  message = "Processing company information..." 
}) => {
  const pulse = keyframes`
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  `;

  const pulseAnimation = `${pulse} 1.5s ease-in-out infinite`;
  const spinnerColor = useColorModeValue("blue.600", "blue.400");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const textColor = useColorModeValue("gray.800", "white");
  const subTextColor = useColorModeValue("gray.500", "gray.400");

  return (
    <Flex flexDir="column" alignItems="center" justifyContent="center" py={16} gap={8}>
      <Box position="relative">
        <Box 
          w="80px" 
          h="80px" 
          borderRadius="full" 
          borderWidth="4px" 
          borderColor={borderColor}
          animation="spin 2s linear infinite"
        />
        <Flex 
          position="absolute" 
          inset={0} 
          alignItems="center" 
          justifyContent="center"
        >
          <Spinner size="xl" color={spinnerColor} thickness="4px" />
        </Flex>
      </Box>
      
      <VStack spacing={3} textAlign="center">
        <Heading as="h3" fontSize="xl" fontWeight="semibold" color={textColor}>
          {message}
        </Heading>
        <Text color={subTextColor} maxW="md">
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
