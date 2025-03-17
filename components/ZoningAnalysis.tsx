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
  data: ZoningData;
}

const ZoningAnalysis = ({ data }: ZoningAnalysisProps) => {
  return (
    <Box>
      <Heading as="h3" size="md" mb={4}>
        Zoning Analysis
      </Heading>
      
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={6}>
        <Stat>
          <StatLabel>Zoning District</StatLabel>
          <StatNumber>{data.district}</StatNumber>
          <StatHelpText>Residential Medium Density</StatHelpText>
        </Stat>
        
        <Stat>
          <StatLabel>Maximum Height</StatLabel>
          <StatNumber>{data.maxHeight}</StatNumber>
          <StatHelpText>From street level</StatHelpText>
        </Stat>
        
        <Stat>
          <StatLabel>Floor Area Ratio (FAR)</StatLabel>
          <StatNumber>{data.far}</StatNumber>
          <StatHelpText>Maximum buildable area</StatHelpText>
        </Stat>
      </SimpleGrid>
      
      <Divider my={6} />
      
      <Box mb={6}>
        <Heading as="h4" size="sm" mb={3}>
          Required Setbacks
        </Heading>
        <Table variant="simple" size="sm">
          <Thead>
            <Tr>
              <Th>Location</Th>
              <Th>Requirement</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>Front</Td>
              <Td>{data.setbacks.front}</Td>
            </Tr>
            <Tr>
              <Td>Side</Td>
              <Td>{data.setbacks.side}</Td>
            </Tr>
            <Tr>
              <Td>Rear</Td>
              <Td>{data.setbacks.rear}</Td>
            </Tr>
          </Tbody>
        </Table>
      </Box>
      
      <Box>
        <Heading as="h4" size="sm" mb={3}>
          Allowed Uses
        </Heading>
        <List spacing={2}>
          {data.allowedUses.map((use, index) => (
            <ListItem key={index}>
              <ListIcon as={CheckCircleIcon} color="green.500" />
              {use}
            </ListItem>
          ))}
        </List>
      </Box>
      
      <Divider my={6} />
      
      <Box>
        <Heading as="h4" size="sm" mb={3}>
          Zoning Compliance Analysis
        </Heading>
        <Text mb={4}>
          Based on the zoning regulations for this site, here are the key compliance considerations:
        </Text>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          <Box p={3} borderWidth="1px" borderRadius="md">
            <Badge colorScheme="green" mb={2}>Compliant</Badge>
            <Text fontWeight="medium">Building Height</Text>
            <Text fontSize="sm">
              The proposed building height of 110 ft is within the maximum allowed height of {data.maxHeight}.
            </Text>
          </Box>
          <Box p={3} borderWidth="1px" borderRadius="md">
            <Badge colorScheme="green" mb={2}>Compliant</Badge>
            <Text fontWeight="medium">Floor Area Ratio</Text>
            <Text fontSize="sm">
              The proposed FAR of 2.8 is within the maximum allowed FAR of {data.far}.
            </Text>
          </Box>
          <Box p={3} borderWidth="1px" borderRadius="md">
            <Badge colorScheme="yellow" mb={2}>Review Needed</Badge>
            <Text fontWeight="medium">Parking Requirements</Text>
            <Text fontSize="sm">
              Minimum parking requirements may apply based on the number of residential units.
            </Text>
          </Box>
          <Box p={3} borderWidth="1px" borderRadius="md">
            <Badge colorScheme="green" mb={2}>Compliant</Badge>
            <Text fontWeight="medium">Setbacks</Text>
            <Text fontSize="sm">
              The proposed building setbacks comply with the minimum requirements.
            </Text>
          </Box>
        </SimpleGrid>
      </Box>
    </Box>
  );
};

export default ZoningAnalysis; 