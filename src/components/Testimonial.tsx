
import React, { useState, useEffect, useCallback } from "react";
import { Box, Text, Flex, Image, VStack } from "@chakra-ui/react";
import { Star } from "lucide-react";

interface TestimonialProps {
  quote: string;
  author: string;
  position: string;
  company: string;
  rating?: number;
  logoSrc?: string;
}

interface TestimonialsCarouselProps {
  testimonials: TestimonialProps[];
  autoRotateInterval?: number;
}

const Testimonial: React.FC<TestimonialProps> = ({ 
  quote, 
  author, 
  position, 
  company, 
  rating = 5,
  logoSrc
}) => {
  return (
    <Box 
      bg="whiteAlpha.200" 
      backdropFilter="blur(10px)" 
      borderRadius="md" 
      p={5} 
      position="relative" 
      overflow="hidden"
    >
      <Text fontSize="md" fontWeight="medium" mb={4} color="white">
        "{quote}"
      </Text>
      
      <Flex justify="space-between" align="flex-end">
        <Box>
          <Flex gap={1} mb={2}>
            {Array.from({ length: rating }).map((_, i) => (
              <Star key={i} size={16} fill="#FF8C00" color="#FF8C00" />
            ))}
          </Flex>
          
          <Text fontSize="sm" color="whiteAlpha.800">
            — {author}, {position},
          </Text>
          <Text fontSize="sm" color="whiteAlpha.800">
            {company}
          </Text>
        </Box>
        
        {logoSrc && (
          <Image src={logoSrc} alt={company} h="12px" objectFit="contain" />
        )}
      </Flex>
    </Box>
  );
};

const TestimonialsCarousel: React.FC<TestimonialsCarouselProps> = ({ 
  testimonials,
  autoRotateInterval = 5000
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  const rotateTestimonial = useCallback(() => {
    setActiveIndex(prevIndex => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  }, [testimonials.length]);
  
  useEffect(() => {
    const intervalId = setInterval(rotateTestimonial, autoRotateInterval);
    
    return () => clearInterval(intervalId);
  }, [rotateTestimonial, autoRotateInterval]);
  
  const handleDotClick = (index: number) => {
    setActiveIndex(index);
  };
  
  return (
    <VStack gap={4} width="100%">
      <Box width="100%">
        {testimonials.map((testimonial, index) => (
          <Box 
            key={index}
            display={index === activeIndex ? "block" : "none"}
            transition="opacity 0.3s"
          >
            <Testimonial {...testimonial} />
          </Box>
        ))}
      </Box>
      
      <Flex justify="center" mt={2}>
        <Flex gap={1}>
          {testimonials.map((_, index) => (
            <Box
              key={index}
              as="button"
              onClick={() => handleDotClick(index)}
              w="8px"
              h="8px"
              borderRadius="full"
              bg={index === activeIndex ? "white" : "whiteAlpha.400"}
              transition="background-color 0.3s"
              _hover={{ bg: "white" }}
            />
          ))}
        </Flex>
      </Flex>
    </VStack>
  );
};

export default TestimonialsCarousel;
