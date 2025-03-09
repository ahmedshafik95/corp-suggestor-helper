
import React from "react";
import {
  Box,
  Flex,
  Text,
  Button,
  Container,
  useColorModeValue,
  Tooltip,
  IconButton,
} from "@chakra-ui/react";
import { Menu } from "lucide-react";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
  const progressWidth = `${(currentStep / totalSteps) * 100}%`;
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const bgColor = useColorModeValue("gray.100", "gray.700");
  const progressColor = useColorModeValue("blue.600", "blue.400");

  return (
    <Box w="full" borderBottom="1px" borderColor={borderColor}>
      <Container px={{ base: 4, md: 6 }} maxW="5xl" mx="auto">
        <Flex w="full" alignItems="center" justifyContent="space-between" py={4}>
          <Flex alignItems="center" gap={2}>
            <IconButton
              aria-label="Toggle menu"
              icon={<Menu size={20} />}
              variant="ghost"
              size="sm"
              color="gray.600"
            />
            <Text fontSize="lg" fontWeight="medium">Venn</Text>
          </Flex>
          <Flex alignItems="center" gap={4}>
            <Text fontSize="sm" fontWeight="medium">Steps</Text>
            <Button variant="outline" size="sm" borderRadius="full" px={4} h="9">
              Help
            </Button>
          </Flex>
        </Flex>
      </Container>
      
      <Box w="full" h="3px" bg={bgColor} position="relative">
        <Box 
          h="full" 
          bg={progressColor} 
          transition="all 0.3s ease-in-out" 
          position="absolute" 
          left="0" 
          top="0"
          width={progressWidth}
        />
      </Box>
    </Box>
  );
};

export default ProgressBar;
