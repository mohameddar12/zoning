import { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  HStack,
  Text,
  useToast,
  Heading,
  Divider,
  InputGroup,
  InputRightElement,
  Icon,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/router';

const SiteSearchForm = () => {
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!address.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a valid address',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    
    // In a real app, we would call an API here to validate the address
    // For now, we'll simulate a delay and redirect to the analysis page
    setTimeout(() => {
      setIsLoading(false);
      router.push(`/analysis?address=${encodeURIComponent(address)}`);
    }, 1500);
  };

  return (
    <Box
      bg="white"
      p={8}
      borderRadius="lg"
      boxShadow="lg"
      maxW="800px"
      mx="auto"
    >
      <VStack spacing={6} align="stretch">
        <Heading as="h2" size="lg">
          Start Your Site Analysis
        </Heading>
        <Text color="gray.600">
          Enter a site address to begin your comprehensive analysis
        </Text>
        <Divider />
        
        <form onSubmit={handleSubmit}>
          <VStack spacing={6}>
            <FormControl isRequired>
              <FormLabel>Site Address</FormLabel>
              <InputGroup size="lg">
                <Input
                  placeholder="Enter full address or coordinates"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  focusBorderColor="brand.500"
                />
                <InputRightElement>
                  <Icon as={SearchIcon} color="gray.500" />
                </InputRightElement>
              </InputGroup>
            </FormControl>
            
            <HStack width="100%" justify="space-between">
              <Text fontSize="sm" color="gray.500">
                Try: "123 Main St, New York, NY" or "40.7128° N, 74.0060° W"
              </Text>
              <Button
                type="submit"
                colorScheme="brand"
                size="lg"
                isLoading={isLoading}
                loadingText="Analyzing..."
              >
                Analyze Site
              </Button>
            </HStack>
          </VStack>
        </form>
      </VStack>
    </Box>
  );
};

export default SiteSearchForm; 