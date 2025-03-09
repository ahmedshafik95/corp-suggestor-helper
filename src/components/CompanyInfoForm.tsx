
import React, { useState } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Text,
  VStack,
  Grid,
  GridItem,
  FormControl,
  FormLabel,
  Divider,
  Badge,
  useToast,
  Tooltip,
} from "@chakra-ui/react";
import { ArrowLeft, Info } from "lucide-react";
import { Company } from "@/types/company";

interface CompanyInfoFormProps {
  company: Company;
  onBack: () => void;
}

const CompanyInfoForm: React.FC<CompanyInfoFormProps> = ({ company, onBack }) => {
  const toast = useToast();
  
  // Initialize form state with company data
  const [formData, setFormData] = useState({
    legalName: company.name || "",
    operatingName: "",
    corporationNumber: company.registrationNumber || "",
    incorporationDate: company.incorporationDate ? new Date(company.incorporationDate).toISOString().split('T')[0] : "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here you would typically send the data to your backend
    console.log("Submitting company information:", formData);
    
    toast({
      title: "Information Submitted",
      description: "Your company information has been successfully submitted.",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
    
    // You can add navigation logic here if needed
  };

  // Check if company has directors
  const hasDirectors = company.directors && company.directors.length > 0;
  console.log("Company directors in form:", company.directors);

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="white">
      <Box px={{ base: 6, md: 8, lg: 12 }} pb={12} maxW="4xl" mx="auto" w="full">
        <Flex alignItems="center" mb={8}>
          <Button 
            onClick={onBack}
            variant="ghost"
            leftIcon={<ArrowLeft size={20} />}
            color="gray.600"
            _hover={{ color: "gray.900" }}
            transition="colors 0.3s"
          >
            Back
          </Button>
        </Flex>
        
        <Heading as="h1" fontSize={{ base: "3xl", md: "4xl" }} fontWeight="bold" mb={4}>
          Tell us about your business
        </Heading>
        
        <Text fontSize="lg" color="gray.600" mb={8}>
          Venn does not perform any credit checks or require personal guarantees
        </Text>
        
        <Box bg="white" rounded="xl" p={6} borderWidth="1px" borderColor="gray.100" shadow="sm" mb={6}>
          <Flex alignItems="center" gap={2} fontSize="sm" fontWeight="medium" color="blue.700" mb={2}>
            <Box h="1.5px" w="1.5px" rounded="full" bg="blue.700" />
            <Text>Business Information</Text>
          </Flex>
          
          <form onSubmit={handleSubmit}>
            <VStack spacing={6}>
              <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6} w="full">
                <GridItem>
                  <FormControl>
                    <FormLabel fontSize="sm" fontWeight="medium" color="gray.700">
                      Business legal name
                    </FormLabel>
                    <Input
                      type="text"
                      id="legalName"
                      name="legalName"
                      value={formData.legalName}
                      onChange={handleInputChange}
                      w="full"
                      required
                    />
                  </FormControl>
                </GridItem>
                
                <GridItem>
                  <FormControl>
                    <FormLabel fontSize="sm" fontWeight="medium" color="gray.700">
                      Operating name
                    </FormLabel>
                    <Input
                      type="text"
                      id="operatingName"
                      name="operatingName"
                      value={formData.operatingName}
                      onChange={handleInputChange}
                      w="full"
                    />
                  </FormControl>
                </GridItem>
              </Grid>
              
              <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6} w="full">
                <GridItem>
                  <FormControl>
                    <FormLabel fontSize="sm" fontWeight="medium" color="gray.700">
                      Corporation number
                    </FormLabel>
                    <Input
                      type="text"
                      id="corporationNumber"
                      name="corporationNumber"
                      value={formData.corporationNumber}
                      onChange={handleInputChange}
                      w="full"
                      required
                    />
                  </FormControl>
                </GridItem>
                
                <GridItem>
                  <FormControl>
                    <FormLabel fontSize="sm" fontWeight="medium" color="gray.700">
                      Date of incorporation
                    </FormLabel>
                    <Input
                      type="date"
                      id="incorporationDate"
                      name="incorporationDate"
                      value={formData.incorporationDate}
                      onChange={handleInputChange}
                      w="full"
                      required
                    />
                  </FormControl>
                </GridItem>
              </Grid>
            </VStack>
          </form>
        </Box>
        
        {hasDirectors && (
          <Box bg="white" rounded="xl" p={6} borderWidth="1px" borderColor="gray.100" shadow="sm" mb={6}>
            <Flex alignItems="center" gap={2} fontSize="sm" fontWeight="medium" color="blue.700" mb={4}>
              <Box h="1.5px" w="1.5px" rounded="full" bg="blue.700" />
              <Text>Company Directors</Text>
              <Tooltip label="Directors information is retrieved from the official corporate registry.">
                <Box as="span" cursor="help">
                  <Info size={16} color="gray.400" />
                </Box>
              </Tooltip>
            </Flex>
            
            <VStack spacing={4} align="stretch">
              {company.directors && company.directors.length > 0 ? (
                <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4}>
                  {company.directors.map((director, index) => (
                    <Box key={index} bg="gray.50" p={4} rounded="lg" borderWidth="1px" borderColor="gray.200">
                      <Flex flexDirection="column">
                        <Text fontWeight="medium" color="gray.900">{director.name}</Text>
                        {director.position && (
                          <Text fontSize="sm" color="gray.600">{director.position}</Text>
                        )}
                      </Flex>
                    </Box>
                  ))}
                </Grid>
              ) : (
                <Box py={4} textAlign="center" color="gray.500">
                  <Text>No director information available for this company.</Text>
                </Box>
              )}
            </VStack>
          </Box>
        )}
        
        <Button 
          type="submit" 
          onClick={handleSubmit}
          w="full" 
          bg="gray.900" 
          _hover={{ bg: "gray.700" }} 
          color="white" 
          px={8} 
          py={6} 
          h="auto" 
          fontSize="lg" 
          fontWeight="medium" 
          rounded="lg" 
          mt={8}
        >
          Continue
        </Button>
      </Box>
      
      <Box as="footer" mt="auto" py={8} textAlign="center" color="gray.500" fontSize="sm">
        <Text>© {new Date().getFullYear()} Canada Business Registry Search. All rights reserved.</Text>
      </Box>
    </Box>
  );
};

export default CompanyInfoForm;
