import { useState, useEffect, useRef } from 'react';
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
  List,
  ListItem,
  Spinner,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/router';
import axios from 'axios';
import { debounce } from 'lodash';

// Define the type for autocomplete suggestions
interface Suggestion {
  id: string;
  place_name: string;
  center: [number, number]; // [longitude, latitude]
}

const SiteSearchForm = () => {
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const toast = useToast();
  const router = useRouter();
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Mapbox token from environment variables
  const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 'pk.eyJ1IjoibWRhcndpY2hlIiwiYSI6ImNtOGNkeHMwNjFxcDQyanE1c3dzNjM2OTYifQ.M5XYRMVhKgQS8_jXQTncrw';

  // Function to fetch address suggestions from Mapbox
  const fetchSuggestions = async (query: string) => {
    if (!query || query.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsLoadingSuggestions(true);
    try {
      const response = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json`,
        {
          params: {
            access_token: MAPBOX_TOKEN,
            autocomplete: true,
            limit: 5,
            types: 'address,place,locality,neighborhood',
          },
        }
      );

      if (response.data.features) {
        setSuggestions(response.data.features.map((feature: any) => ({
          id: feature.id,
          place_name: feature.place_name,
          center: feature.center,
        })));
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error('Error fetching address suggestions:', error);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  // Debounce the fetchSuggestions function to avoid too many API calls
  const debouncedFetchSuggestions = useRef(
    debounce(fetchSuggestions, 300)
  ).current;

  // Effect to fetch suggestions when address changes
  useEffect(() => {
    debouncedFetchSuggestions(address);
    
    // Cleanup function
    return () => {
      debouncedFetchSuggestions.cancel();
    };
  }, [address, debouncedFetchSuggestions]);

  // Effect to handle clicks outside the suggestions list
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

  const handleSuggestionClick = (suggestion: Suggestion) => {
    setAddress(suggestion.place_name);
    setShowSuggestions(false);
  };

  return (
    <Box
      bg="white"
      p={8}
      borderRadius="lg"
      boxShadow="lg"
      maxW="800px"
      mx="auto"
      position="relative"
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
            <FormControl isRequired position="relative">
              <FormLabel>Site Address</FormLabel>
              <InputGroup size="lg">
                <Input
                  placeholder="Enter full address or coordinates"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  focusBorderColor="brand.500"
                  onFocus={() => {
                    if (suggestions.length > 0) {
                      setShowSuggestions(true);
                    }
                  }}
                />
                <InputRightElement>
                  {isLoadingSuggestions ? (
                    <Spinner size="sm" color="gray.400" />
                  ) : (
                    <Icon as={SearchIcon} color="gray.500" />
                  )}
                </InputRightElement>
              </InputGroup>
              
              {/* Suggestions dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <Box
                  ref={suggestionsRef}
                  position="absolute"
                  width="100%"
                  bg="white"
                  mt={1}
                  borderWidth="1px"
                  borderRadius="md"
                  boxShadow="md"
                  zIndex={10}
                  maxH="300px"
                  overflowY="auto"
                >
                  <List spacing={0}>
                    {suggestions.map((suggestion) => (
                      <ListItem
                        key={suggestion.id}
                        p={3}
                        cursor="pointer"
                        _hover={{ bg: 'gray.100' }}
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        {suggestion.place_name}
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
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