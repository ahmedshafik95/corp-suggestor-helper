
import React from "react";
import {
  Box,
  Skeleton,
  VStack,
  Divider,
} from "@chakra-ui/react";

interface SearchSkeletonProps {
  count?: number;
}

const SearchSkeleton: React.FC<SearchSkeletonProps> = ({ count = 3 }) => {
  return (
    <Box w="full">
      {Array.from({ length: count }).map((_, index) => (
        <Box key={index} p={4} borderBottomWidth={index < count - 1 ? "1px" : 0}>
          <VStack align="start" spacing={2}>
            <Skeleton height="20px" width="75%" />
            <Skeleton height="16px" width="50%" />
          </VStack>
        </Box>
      ))}
    </Box>
  );
};

export default SearchSkeleton;
