
import React from "react";
import { Menu } from "lucide-react";
import { Box, Flex, Text, Button, HStack, useColorModeValue } from "@chakra-ui/react";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
  const progressWidth = `${(currentStep / totalSteps) * 100}%`;
  const bgColor = useColorModeValue('gray.200', 'gray.700');
  const progressColor = useColorModeValue('blue.600', 'blue.400');

  return (
    <Box w="full" mb={8}>
      <Flex w="full" alignItems="center" justifyContent="space-between" mb={6}>
        <Flex alignItems="center" gap={2}>
          <Button variant="ghost" size="md" p={2} color="gray.600">
            <Menu size={20} />
            <Text srOnly>Toggle menu</Text>
          </Button>
          <Text fontSize="lg" fontWeight="medium">Venn</Text>
        </Flex>
        <Flex alignItems="center" gap={4}>
          <Text fontSize="sm" fontWeight="medium">Steps</Text>
          <Button variant="outline" size="sm" borderRadius="full" px={4} h={9}>
            Help
          </Button>
        </Flex>
      </Flex>
      
      <Box w="full" h="1px" bg={bgColor} mb={8} position="relative">
        <Box 
          h="full" 
          bg={progressColor} 
          transition="width 0.3s ease-in-out" 
          w={progressWidth}
          position="absolute"
          left={0}
          top={0}
        />
      </Box>
    </Box>
  );
};

export default ProgressBar;
