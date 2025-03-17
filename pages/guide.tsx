import {
  Box,
  Container,
  Heading,
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  OrderedList,
  ListItem,
  Image,
  Divider,
  Flex,
  Icon,
  Badge,
  useColorModeValue
} from '@chakra-ui/react';
import { FaSearch, FaMap, FaBuilding, FaLeaf, FaChartLine, FaLightbulb } from 'react-icons/fa';
import Head from 'next/head';
import Layout from '../components/Layout';

export default function UserGuide() {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Layout>
      <Head>
        <title>User Guide - SiteScout</title>
        <meta name="description" content="Learn how to use SiteScout for site analysis" />
      </Head>

      <Container maxW="container.lg" py={10}>
        <Box mb={10} textAlign="center">
          <Heading as="h1" size="2xl" mb={4}>
            SiteScout User Guide
          </Heading>
          <Text fontSize="xl" color="gray.600">
            Learn how to leverage SiteScout for comprehensive site analysis
          </Text>
        </Box>

        <Box bg={bgColor} p={8} borderRadius="lg" boxShadow="md" mb={10}>
          <Heading as="h2" size="lg" mb={6}>
            Getting Started
          </Heading>
          
          <Box mb={8}>
            <Flex align="center" mb={4}>
              <Icon as={FaSearch} color="brand.500" boxSize={6} mr={3} />
              <Heading as="h3" size="md">
                Searching for a Site
              </Heading>
            </Flex>
            <Text mb={4}>
              The first step in using SiteScout is to search for your site of interest. You can do this by:
            </Text>
            <OrderedList spacing={3} pl={6}>
              <ListItem>
                Enter a complete address in the search bar on the homepage (e.g., "123 Main St, New York, NY")
              </ListItem>
              <ListItem>
                Enter geographic coordinates (e.g., "40.7128° N, 74.0060° W")
              </ListItem>
              <ListItem>
                Click the "Analyze Site" button to begin the analysis
              </ListItem>
            </OrderedList>
            <Box mt={6} borderRadius="md" overflow="hidden" borderWidth="1px" borderColor={borderColor}>
              <Image 
                src="/images/search-example.jpg" 
                alt="Site search example"
                fallbackSrc="https://via.placeholder.com/800x400?text=Site+Search+Example" 
              />
            </Box>
          </Box>

          <Divider my={8} />

          <Box mb={8}>
            <Flex align="center" mb={4}>
              <Icon as={FaMap} color="brand.500" boxSize={6} mr={3} />
              <Heading as="h3" size="md">
                Exploring the Map View
              </Heading>
            </Flex>
            <Text mb={4}>
              The interactive map provides a visual context for your site:
            </Text>
            <OrderedList spacing={3} pl={6}>
              <ListItem>
                Use the mouse to pan and zoom around the map
              </ListItem>
              <ListItem>
                The site location is marked with a pin
              </ListItem>
              <ListItem>
                Toggle different map layers using the controls in the top-right corner
              </ListItem>
            </OrderedList>
          </Box>

          <Divider my={8} />

          <Accordion allowMultiple>
            <AccordionItem border="none">
              <h2>
                <AccordionButton px={0} _hover={{ bg: 'transparent' }}>
                  <Flex align="center" flex="1">
                    <Icon as={FaBuilding} color="brand.500" boxSize={6} mr={3} />
                    <Heading as="h3" size="md" textAlign="left">
                      Zoning Analysis
                    </Heading>
                  </Flex>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4} pl={9}>
                <Text mb={4}>
                  The Zoning Analysis tab provides detailed information about zoning regulations and building code requirements for your site:
                </Text>
                <OrderedList spacing={3}>
                  <ListItem>
                    <Text fontWeight="medium">Zoning District:</Text> 
                    <Text>Identifies the zoning classification and permitted uses</Text>
                  </ListItem>
                  <ListItem>
                    <Text fontWeight="medium">Building Envelope:</Text> 
                    <Text>Shows maximum height, FAR (Floor Area Ratio), and setback requirements</Text>
                  </ListItem>
                  <ListItem>
                    <Text fontWeight="medium">Compliance Analysis:</Text> 
                    <Text>Evaluates potential development scenarios against zoning regulations</Text>
                  </ListItem>
                </OrderedList>
              </AccordionPanel>
            </AccordionItem>

            <AccordionItem border="none">
              <h2>
                <AccordionButton px={0} _hover={{ bg: 'transparent' }}>
                  <Flex align="center" flex="1">
                    <Icon as={FaLeaf} color="brand.500" boxSize={6} mr={3} />
                    <Heading as="h3" size="md" textAlign="left">
                      Environmental Insights
                    </Heading>
                  </Flex>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4} pl={9}>
                <Text mb={4}>
                  The Environmental Insights tab provides climate data and sustainability information:
                </Text>
                <OrderedList spacing={3}>
                  <ListItem>
                    <Text fontWeight="medium">Climate Analysis:</Text> 
                    <Text>Shows temperature ranges, precipitation, and climate zone classification</Text>
                  </ListItem>
                  <ListItem>
                    <Text fontWeight="medium">Solar Potential:</Text> 
                    <Text>Analyzes sun exposure, optimal building orientation, and solar energy potential</Text>
                  </ListItem>
                  <ListItem>
                    <Text fontWeight="medium">Site Conditions:</Text> 
                    <Text>Provides information on flood risk, soil type, and biodiversity opportunities</Text>
                  </ListItem>
                </OrderedList>
              </AccordionPanel>
            </AccordionItem>

            <AccordionItem border="none">
              <h2>
                <AccordionButton px={0} _hover={{ bg: 'transparent' }}>
                  <Flex align="center" flex="1">
                    <Icon as={FaChartLine} color="brand.500" boxSize={6} mr={3} />
                    <Heading as="h3" size="md" textAlign="left">
                      Feasibility Estimation
                    </Heading>
                  </Flex>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4} pl={9}>
                <Text mb={4}>
                  The Feasibility Estimation tab helps evaluate the financial viability of your project:
                </Text>
                <OrderedList spacing={3}>
                  <ListItem>
                    <Text fontWeight="medium">Cost Calculator:</Text> 
                    <Text>Adjust building parameters to estimate construction and development costs</Text>
                  </ListItem>
                  <ListItem>
                    <Text fontWeight="medium">Financial Metrics:</Text> 
                    <Text>View ROI, payback period, and other key financial indicators</Text>
                  </ListItem>
                  <ListItem>
                    <Text fontWeight="medium">Scenario Analysis:</Text> 
                    <Text>Compare different development scenarios with varying assumptions</Text>
                  </ListItem>
                </OrderedList>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </Box>

        <Box bg={bgColor} p={8} borderRadius="lg" boxShadow="md">
          <Flex align="center" mb={6}>
            <Icon as={FaLightbulb} color="brand.500" boxSize={6} mr={3} />
            <Heading as="h2" size="lg">
              Tips & Best Practices
            </Heading>
          </Flex>
          
          <OrderedList spacing={4}>
            <ListItem>
              <Text fontWeight="medium">Start with accurate location data</Text>
              <Text>Ensure you have the correct address or precise coordinates for the most accurate analysis</Text>
            </ListItem>
            <ListItem>
              <Text fontWeight="medium">Consider multiple scenarios</Text>
              <Text>Use the feasibility calculator to compare different building sizes and quality levels</Text>
            </ListItem>
            <ListItem>
              <Text fontWeight="medium">Review all analysis tabs</Text>
              <Text>Each tab provides unique insights that can inform your design decisions</Text>
            </ListItem>
            <ListItem>
              <Text fontWeight="medium">Export reports for team collaboration</Text>
              <Text>Share analysis results with colleagues and clients using the export feature</Text>
            </ListItem>
            <ListItem>
              <Text fontWeight="medium">Check for updates regularly</Text>
              <Text>Zoning regulations and building codes can change, so verify the information for critical decisions</Text>
            </ListItem>
          </OrderedList>
          
          <Box mt={8} p={4} bg="blue.50" borderRadius="md">
            <Flex>
              <Badge colorScheme="blue" fontSize="0.8em" p={1} mr={3} mt={1}>
                PRO TIP
              </Badge>
              <Text>
                For the most comprehensive analysis, consider using SiteScout early in your design process to inform key decisions about building orientation, massing, and program distribution.
              </Text>
            </Flex>
          </Box>
        </Box>
      </Container>
    </Layout>
  );
} 