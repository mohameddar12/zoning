import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Divider,
  Progress,
  Flex,
  Icon,
  Image,
  Button,
  Tooltip,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { FaLeaf, FaBuilding, FaRoad, FaTree, FaWater } from 'react-icons/fa';
import satelliteAnalysisService from '../services/satelliteAnalysisService';

interface SurfaceAnalysisProps {
  lat: number;
  lng: number;
  radius?: number;
}

const SurfaceAnalysis = ({ lat, lng, radius = 100 }: SurfaceAnalysisProps) => {
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showOverlay, setShowOverlay] = useState<boolean>(false);
  
  useEffect(() => {
    const fetchAnalysis = async () => {
      setIsLoading(true);
      try {
        const result = await satelliteAnalysisService.analyzeSurfaces(lat, lng, radius);
        setAnalysisData(result);
      } catch (error) {
        console.error('Error fetching surface analysis:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAnalysis();
  }, [lat, lng, radius]);
  
  if (isLoading) {
    return (
      <Box p={4}>
        <Heading size="md" mb={4}>Surface Analysis</Heading>
        <Text>Loading surface analysis...</Text>
      </Box>
    );
  }
  
  if (!analysisData) {
    return (
      <Box p={4}>
        <Heading size="md" mb={4}>Surface Analysis</Heading>
        <Text>Unable to analyze surfaces for this location.</Text>
      </Box>
    );
  }
  
  return (
    <Box>
      <Heading as="h3" size="md" mb={4}>
        Surface Permeability Analysis
      </Heading>
      
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={6}>
        <Box>
          <Box position="relative" borderRadius="md" overflow="hidden" boxShadow="md">
            <Image 
              src={showOverlay ? analysisData.analysisOverlayUrl : analysisData.imageUrl} 
              alt="Satellite view of site"
              width="100%"
              height="300px"
              objectFit="cover"
            />
            <Button 
              position="absolute" 
              bottom="4" 
              right="4"
              size="sm"
              onClick={() => setShowOverlay(!showOverlay)}
            >
              {showOverlay ? "Show Satellite" : "Show Analysis"}
            </Button>
          </Box>
        </Box>
        
        <Box>
          <Heading as="h4" size="sm" mb={4}>
            Surface Breakdown
          </Heading>
          
          <Flex align="center" mb={4}>
            <Box w="100px" textAlign="right" mr={4}>
              <Text fontWeight="bold" color="green.500">Permeable</Text>
            </Box>
            <Progress 
              value={analysisData.permeablePercentage} 
              colorScheme="green" 
              size="lg" 
              flex="1" 
              borderRadius="full"
            />
            <Box w="40px" textAlign="right" ml={2}>
              <Text fontWeight="bold">{analysisData.permeablePercentage}%</Text>
            </Box>
          </Flex>
          
          <Flex align="center" mb={6}>
            <Box w="100px" textAlign="right" mr={4}>
              <Text fontWeight="bold" color="red.500">Impermeable</Text>
            </Box>
            <Progress 
              value={analysisData.impermeablePercentage} 
              colorScheme="red" 
              size="lg" 
              flex="1" 
              borderRadius="full"
            />
            <Box w="40px" textAlign="right" ml={2}>
              <Text fontWeight="bold">{analysisData.impermeablePercentage}%</Text>
            </Box>
          </Flex>
          
          <Divider my={4} />
          
          <SimpleGrid columns={2} spacing={4}>
            <Stat>
              <Flex align="center">
                <Icon as={FaBuilding} color="gray.500" mr={2} />
                <StatLabel>Buildings</StatLabel>
              </Flex>
              <StatNumber>{Math.round(analysisData.breakdown.buildings * 100)}%</StatNumber>
            </Stat>
            
            <Stat>
              <Flex align="center">
                <Icon as={FaRoad} color="gray.500" mr={2} />
                <StatLabel>Pavement</StatLabel>
              </Flex>
              <StatNumber>{Math.round(analysisData.breakdown.pavement * 100)}%</StatNumber>
            </Stat>
            
            <Stat>
              <Flex align="center">
                <Icon as={FaTree} color="green.500" mr={2} />
                <StatLabel>Vegetation</StatLabel>
              </Flex>
              <StatNumber>{Math.round(analysisData.breakdown.vegetation * 100)}%</StatNumber>
            </Stat>
            
            <Stat>
              <Flex align="center">
                <Icon as={FaWater} color="blue.500" mr={2} />
                <StatLabel>Water</StatLabel>
              </Flex>
              <StatNumber>{Math.round(analysisData.breakdown.water * 100)}%</StatNumber>
            </Stat>
          </SimpleGrid>
        </Box>
      </SimpleGrid>
      
      <Box p={4} bg="blue.50" borderRadius="md">
        <Heading as="h4" size="sm" mb={2}>
          Environmental Impact
        </Heading>
        <Text>
          This site has {analysisData.permeablePercentage}% permeable surfaces, which {analysisData.permeablePercentage > 50 ? 'helps with' : 'may limit'} natural water infiltration and groundwater recharge. 
          {analysisData.permeablePercentage < 40 ? ' Consider incorporating green infrastructure like permeable pavement, rain gardens, or green roofs to improve stormwater management.' : ''}
        </Text>
      </Box>
    </Box>
  );
};

export default SurfaceAnalysis; 