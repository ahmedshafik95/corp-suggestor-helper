
import React from "react";
import { useNavigate } from "react-router-dom";
import CorporateSearch from "@/components/CorporateSearch";
import ProgressBar from "@/components/ProgressBar";
import { Company } from "@/types/company";
import { ArrowLeft } from "lucide-react";
import { Box, Container, Flex, Heading, Text, Button } from "@chakra-ui/react";

const Index = () => {
  const navigate = useNavigate();
  
  const handleCompanySelect = (company: Company) => {
    console.log("Selected company:", company);
  };

  const handleBack = () => {
    navigate("/");
  };

  return (
    <Flex direction="column" minH="100vh" bg="white">
      <ProgressBar currentStep={2} totalSteps={3} />
      
      <Container px={{ base: 6, md: 8, lg: 12 }} pb={12} maxW="4xl">
        <Flex alignItems="center" mb={8}>
          <Button 
            onClick={handleBack}
            variant="ghost"
            leftIcon={<ArrowLeft size={20} />}
            color="gray.600"
            _hover={{ color: "gray.900" }}
          >
            Back
          </Button>
        </Flex>
        
        <Heading as="h1" fontSize={{ base: "3xl", md: "4xl" }} fontWeight="bold" mb={6}>
          Tell us about your company
        </Heading>
        
        <Text fontSize="lg" color="gray.700" mb={8} lineHeight="relaxed">
          You'll need the legal name or Corporation number to find your company below. 
          We'll automatically retrieve all the information needed for the next steps.
        </Text>
        
        <CorporateSearch onCompanySelect={handleCompanySelect} onBack={handleBack} />
      </Container>
      
      <Box as="footer" mt="auto" py={8} textAlign="center" color="gray.500" fontSize="sm">
        <Text>© {new Date().getFullYear()} Canada Business Registry Search. All rights reserved.</Text>
      </Box>
    </Flex>
  );
};

export default Index;
