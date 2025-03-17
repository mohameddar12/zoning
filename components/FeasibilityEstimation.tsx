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
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Flex,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Icon,
  Progress,
  HStack,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { useState } from 'react';
import { FaDownload, FaChartBar, FaBuilding, FaCoins } from 'react-icons/fa';

const FeasibilityEstimation = () => {
  const [buildingSize, setBuildingSize] = useState(50000);
  const [qualityLevel, setQualityLevel] = useState(2);
  
  // Calculate estimated costs based on inputs
  const baseCostPerSqFt = 250 + (qualityLevel * 50);
  const totalConstructionCost = buildingSize * baseCostPerSqFt;
  const softCosts = totalConstructionCost * 0.25;
  const contingency = totalConstructionCost * 0.1;
  const totalProjectCost = totalConstructionCost + softCosts + contingency;
  
  const qualityLevels = [
    "Basic (Code minimum)",
    "Standard (Market rate)",
    "Premium (High-end finishes)",
    "Luxury (Custom details)"
  ];
  
  const cardBg = useColorModeValue('white', 'gray.700');
  
  return (
    <Box>
      <Heading as="h3" size="md" mb={4}>
        Feasibility Estimation
      </Heading>
      
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={6}>
        <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg" bg={cardBg}>
          <Heading as="h4" size="sm" mb={4}>
            <Flex align="center">
              <Icon as={FaBuilding} mr={2} />
              Building Parameters
            </Flex>
          </Heading>
          
          <VStack spacing={6} align="stretch">
            <Box>
              <Flex justify="space-between" mb={2}>
                <Text>Building Size</Text>
                <Text fontWeight="bold">{buildingSize.toLocaleString()} sq ft</Text>
              </Flex>
              <Slider 
                aria-label="building-size-slider" 
                defaultValue={50000}
                min={10000}
                max={200000}
                step={5000}
                onChange={(val) => setBuildingSize(val)}
                colorScheme="brand"
              >
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb boxSize={6} />
              </Slider>
            </Box>
            
            <Box>
              <Flex justify="space-between" mb={2}>
                <Text>Quality Level</Text>
                <Text fontWeight="bold">{qualityLevels[qualityLevel]}</Text>
              </Flex>
              <Slider 
                aria-label="quality-level-slider" 
                defaultValue={2}
                min={0}
                max={3}
                step={1}
                onChange={(val) => setQualityLevel(val)}
                colorScheme="brand"
              >
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb boxSize={6} />
              </Slider>
            </Box>
          </VStack>
        </Box>
        
        <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg" bg={cardBg}>
          <Heading as="h4" size="sm" mb={4}>
            <Flex align="center">
              <Icon as={FaCoins} mr={2} />
              Cost Estimation
            </Flex>
          </Heading>
          
          <VStack spacing={3} align="stretch">
            <Flex justify="space-between">
              <Text>Base Cost per Sq Ft:</Text>
              <Text fontWeight="bold">${baseCostPerSqFt.toLocaleString()}</Text>
            </Flex>
            <Flex justify="space-between">
              <Text>Construction Cost:</Text>
              <Text fontWeight="bold">${totalConstructionCost.toLocaleString()}</Text>
            </Flex>
            <Flex justify="space-between">
              <Text>Soft Costs (25%):</Text>
              <Text fontWeight="bold">${softCosts.toLocaleString()}</Text>
            </Flex>
            <Flex justify="space-between">
              <Text>Contingency (10%):</Text>
              <Text fontWeight="bold">${contingency.toLocaleString()}</Text>
            </Flex>
            <Divider />
            <Flex justify="space-between">
              <Text fontWeight="bold">Total Project Cost:</Text>
              <Text fontWeight="bold" fontSize="lg" color="brand.500">
                ${totalProjectCost.toLocaleString()}
              </Text>
            </Flex>
          </VStack>
        </Box>
      </SimpleGrid>
      
      <Divider my={6} />
      
      <Box mb={6}>
        <Heading as="h4" size="sm" mb={4}>
          Financial Feasibility
        </Heading>
        
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} mb={6}>
          <Box>
            <Text mb={1}>Return on Investment</Text>
            <Progress value={65} colorScheme="green" borderRadius="full" height="8px" mb={1} />
            <Flex justify="space-between">
              <Text fontSize="sm" color="gray.500">Estimated: 6.5%</Text>
              <Text fontSize="sm" color="gray.500">Target: 7.0%</Text>
            </Flex>
          </Box>
          
          <Box>
            <Text mb={1}>Payback Period</Text>
            <Progress value={80} colorScheme="blue" borderRadius="full" height="8px" mb={1} />
            <Flex justify="space-between">
              <Text fontSize="sm" color="gray.500">Estimated: 12 years</Text>
              <Text fontSize="sm" color="gray.500">Target: 10 years</Text>
            </Flex>
          </Box>
          
          <Box>
            <Text mb={1}>Market Alignment</Text>
            <Progress value={90} colorScheme="purple" borderRadius="full" height="8px" mb={1} />
            <Flex justify="space-between">
              <Text fontSize="sm" color="gray.500">Strong demand</Text>
              <Text fontSize="sm" color="gray.500">90%</Text>
            </Flex>
          </Box>
        </SimpleGrid>
        
        <Table variant="simple" size="sm">
          <Thead>
            <Tr>
              <Th>Scenario</Th>
              <Th>Total Cost</Th>
              <Th>ROI</Th>
              <Th>Payback Period</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>Base Case</Td>
              <Td>${totalProjectCost.toLocaleString()}</Td>
              <Td>6.5%</Td>
              <Td>12 years</Td>
            </Tr>
            <Tr>
              <Td>Optimistic</Td>
              <Td>${(totalProjectCost * 0.95).toLocaleString()}</Td>
              <Td>7.8%</Td>
              <Td>10 years</Td>
            </Tr>
            <Tr>
              <Td>Conservative</Td>
              <Td>${(totalProjectCost * 1.1).toLocaleString()}</Td>
              <Td>5.2%</Td>
              <Td>15 years</Td>
            </Tr>
          </Tbody>
        </Table>
      </Box>
      
      <HStack spacing={4} justify="flex-end">
        <Button leftIcon={<FaChartBar />} variant="outline">
          Detailed Analysis
        </Button>
        <Button leftIcon={<FaDownload />} colorScheme="brand">
          Export Report
        </Button>
      </HStack>
    </Box>
  );
};

export default FeasibilityEstimation; 