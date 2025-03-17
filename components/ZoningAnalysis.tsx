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
  List,
  ListItem,
  ListIcon,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
} from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';

interface ZoningData {
  district: string;
  maxHeight: string;
  far: number;
  setbacks: {
    front: string;
    side: string;
    rear: string;
  };
  allowedUses: string[];
}

interface ZoningAnalysisProps {
  data: {
    district: string;
    description?: string;
    maxHeight: string;
    far: number | string;
    setbacks: {
      front: string;
      side: string;
      rear: string;
    };
    allowedUses: string | string[];
    parkingRequirements?: string;
  };
}

const ZoningAnalysis = ({ data }: ZoningAnalysisProps) => {
  // Ensure allowedUses is always an array
  const allowedUses = Array.isArray(data.allowedUses) 
    ? data.allowedUses 
    : [data.allowedUses];

  return (
    <Box>
      <Heading as="h3" size="md" mb={4}>
        Zoning District: {data.district}
      </Heading>
      
      {data.description && (
        <Text mb={4}>{data.description}</Text>
      )}
      
      <Divider my={4} />
      
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={6}>
        <Box>
          <Heading as="h4" size="sm" mb={3}>
            Building Envelope
          </Heading>
          <Box pl={4}>
            <Text mb={2}>
              <Text as="span" fontWeight="bold">Maximum Height:</Text> {data.maxHeight}
            </Text>
            <Text mb={2}>
              <Text as="span" fontWeight="bold">Floor Area Ratio (FAR):</Text> {data.far}
            </Text>
            <Text fontWeight="bold" mb={1}>Setbacks:</Text>
            <Box pl={4}>
              <Text mb={1}>Front: {data.setbacks.front}</Text>
              <Text mb={1}>Side: {data.setbacks.side}</Text>
              <Text mb={1}>Rear: {data.setbacks.rear}</Text>
            </Box>
          </Box>
        </Box>
        
        <Box>
          <Heading as="h4" size="sm" mb={3}>
            Allowed Uses
          </Heading>
          <List spacing={2}>
            {allowedUses.map((use, index) => (
              <ListItem key={index}>
                <ListIcon as={CheckCircleIcon} color="green.500" />
                {use}
              </ListItem>
            ))}
          </List>
          
          {data.parkingRequirements && (
            <Box mt={4}>
              <Text fontWeight="bold" mb={1}>Parking Requirements:</Text>
              <Text>{data.parkingRequirements}</Text>
            </Box>
          )}
        </Box>
      </SimpleGrid>
      
      <Divider my={4} />
      
      <Box>
        <Heading as="h4" size="sm" mb={3}>
          Compliance Analysis
        </Heading>
        <Text mb={4}>
          Based on the zoning regulations for {data.district}, your site has the following development potential:
        </Text>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
          <Box p={4} borderWidth="1px" borderRadius="md">
            <Heading as="h5" size="xs" mb={2}>
              Maximum Building Height
            </Heading>
            <Text fontSize="xl" fontWeight="bold" color="brand.500">
              {data.maxHeight}
            </Text>
          </Box>
          <Box p={4} borderWidth="1px" borderRadius="md">
            <Heading as="h5" size="xs" mb={2}>
              Maximum Floor Area
            </Heading>
            <Text fontSize="xl" fontWeight="bold" color="brand.500">
              {typeof data.far === 'number' ? `${data.far.toFixed(1)}x lot area` : data.far}
            </Text>
          </Box>
          <Box p={4} borderWidth="1px" borderRadius="md">
            <Heading as="h5" size="xs" mb={2}>
              Primary Use Category
            </Heading>
            <Badge colorScheme="green" fontSize="md" p={1}>
              {Array.isArray(allowedUses) && allowedUses.length > 0 ? allowedUses[0] : 'N/A'}
            </Badge>
          </Box>
        </SimpleGrid>
      </Box>
    </Box>
  );
};

export default ZoningAnalysis; 