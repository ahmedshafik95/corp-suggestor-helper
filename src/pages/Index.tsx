
import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  Box,
  Container,
  Heading,
  Text,
  Flex,
  Button,
} from "@chakra-ui/react";
import { ArrowLeft } from "lucide-react";
import CorporateSearch from "@/components/CorporateSearch";
import ProgressBar from "@/components/ProgressBar";
import { Company } from "@/types/company";

const Index = () => {
  const navigate = useNavigate();
  const borderColor = "gray.200";
  const textColor = "gray.600";
  const footerBgColor = "white";
  
  const handleCompanySelect = (company: Company) => {
    console.log("Selected company:", company);
    if (company.directors && company.directors.length > 0) {
      console.log("Company directors:", company.directors);
    } else {
      console.log("No directors found for this company");
    }
  };

  const handleBack = () => {
    navigate("/");
  };

  return (
    <Box display="flex" flexDirection="column" minH="100vh" bg="white">
      <ProgressBar currentStep={2} totalSteps={3} />
      
      <Container px={{ base: 4, md: 6 }} maxW="5xl" mx="auto" pb={12} flex="1">
        <Flex alignItems="center" mb={6}>
          <Button 
            onClick={handleBack}
            variant="ghost"
            size="sm"
            leftIcon={<ArrowLeft size={16} />}
            color="gray.600"
            ml="-2"
          >
            Back
          </Button>
        </Flex>
        
        <Box mb={6}>
          <Box mb={6}>
            <Heading as="h1" fontSize="3xl" fontWeight="bold" mb={2}>
              Tell us about your company
            </Heading>
            
            <Text color={textColor} maxW="3xl">
              You'll need the legal name or Corporation number to find your company below. 
              We'll automatically retrieve all the information needed for the next steps.
            </Text>
          </Box>
          
          <CorporateSearch onCompanySelect={handleCompanySelect} onBack={handleBack} />
        </Box>
      </Container>
      
      <Box as="footer" py={6} borderTop="1px" borderColor={borderColor} mt="auto" bg={footerBgColor}>
        <Container px={{ base: 4, md: 6 }} maxW="5xl" mx="auto">
          <Text fontSize="sm" color="gray.500">
            © {new Date().getFullYear()} Canada Business Registry Search. All rights reserved.
          </Text>
        </Container>
      </Box>
    </Box>
  );
};

export default Index;
