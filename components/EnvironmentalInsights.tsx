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
  Badge,
  HStack,
} from '@chakra-ui/react';
import { 
  SunIcon, 
  MoonIcon,
  WarningIcon,
} from '@chakra-ui/icons';
import { FaWind, FaWater, FaSeedling } from 'react-icons/fa';

interface EnvironmentalData {
  climate: string;
  annualSunHours: number;
  prevailingWinds: string;
  floodZone: string;
  soilType: string;
}

interface EnvironmentalInsightsProps {
  data: EnvironmentalData;
}

const EnvironmentalInsights = ({ data }: EnvironmentalInsightsProps) => {
  return (
    <Box>
      <Heading as="h3" size="md" mb={4}>
        Environmental Insights
      </Heading>
      
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={6}>
        <Stat>
          <StatLabel>Climate Zone</StatLabel>
          <StatNumber>{data.climate}</StatNumber>
          <StatHelpText>ASHRAE Climate Zone 4A</StatHelpText>
        </Stat>
        
        <Stat>
          <StatLabel>Annual Sun Hours</StatLabel>
          <StatNumber>{data.annualSunHours}</StatNumber>
          <StatHelpText>Hours of direct sunlight per year</StatHelpText>
        </Stat>
      </SimpleGrid>
      
      <Divider my={6} />
      
      <Box mb={6}>
        <Heading as="h4" size="sm" mb={4}>
          Solar Potential
        </Heading>
        <Flex align="center" mb={3}>
          <Icon as={SunIcon} mr={2} color="yellow.500" />
          <Text fontWeight="medium" mr={3}>Solar Exposure:</Text>
          <Progress value={75} colorScheme="yellow" flex="1" borderRadius="full" />
          <Text ml={3} fontWeight="medium">75%</Text>
        </Flex>
        <Text fontSize="sm" color="gray.600" mb={4}>
          This site receives excellent solar exposure, making it ideal for passive solar design and photovoltaic systems.
        </Text>
        
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          <Box p={3} borderWidth="1px" borderRadius="md">
            <Heading as="h5" size="xs" mb={2}>
              Summer Solstice
            </Heading>
            <Text fontSize="sm">
              14.8 hours of daylight
            </Text>
            <Text fontSize="sm">
              Sun angle: 73° at noon
            </Text>
          </Box>
          <Box p={3} borderWidth="1px" borderRadius="md">
            <Heading as="h5" size="xs" mb={2}>
              Winter Solstice
            </Heading>
            <Text fontSize="sm">
              9.2 hours of daylight
            </Text>
            <Text fontSize="sm">
              Sun angle: 26° at noon
            </Text>
          </Box>
        </SimpleGrid>
      </Box>
      
      <Box mb={6}>
        <Heading as="h4" size="sm" mb={4}>
          Wind Analysis
        </Heading>
        <Flex align="center" mb={3}>
          <Icon as={FaWind} mr={2} color="blue.500" />
          <Text fontWeight="medium" mr={3}>Prevailing Winds:</Text>
          <Text>{data.prevailingWinds}</Text>
        </Flex>
        <Text fontSize="sm" color="gray.600">
          Prevailing winds from the southwest can be leveraged for natural ventilation strategies. Consider building orientation to maximize cross-ventilation.
        </Text>
      </Box>
      
      <Divider my={6} />
      
      <Box mb={6}>
        <Heading as="h4" size="sm" mb={3}>
          Site Conditions
        </Heading>
        
        <HStack spacing={4} mb={4}>
          <Badge colorScheme="blue" p={2} borderRadius="md">
            Flood Zone: {data.floodZone}
          </Badge>
          <Badge colorScheme="green" p={2} borderRadius="md">
            Soil: {data.soilType}
          </Badge>
        </HStack>
        
        <Box p={4} bg="yellow.50" borderRadius="md" mb={4}>
          <Flex>
            <Icon as={WarningIcon} color="yellow.500" mr={3} mt={1} />
            <Box>
              <Text fontWeight="medium">Flood Risk Assessment</Text>
              <Text fontSize="sm">
                While this site is in Zone X (minimal flood risk), consider implementing stormwater management strategies to mitigate potential flooding from extreme weather events.
              </Text>
            </Box>
          </Flex>
        </Box>
        
        <Box p={4} bg="green.50" borderRadius="md">
          <Flex>
            <Icon as={FaSeedling} color="green.500" mr={3} mt={1} />
            <Box>
              <Text fontWeight="medium">Biodiversity Opportunities</Text>
              <Text fontSize="sm">
                The site offers opportunities for native plantings and green infrastructure. Consider incorporating green roofs, rain gardens, or bioswales to enhance biodiversity and manage stormwater.
              </Text>
            </Box>
          </Flex>
        </Box>
      </Box>
    </Box>
  );
};

export default EnvironmentalInsights; 