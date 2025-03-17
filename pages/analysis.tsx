import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Container,
  Heading,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Skeleton,
  Grid,
  GridItem,
  Badge,
  Flex,
  useToast,
  Stack,
  Divider,
  Button,
} from '@chakra-ui/react';
import Head from 'next/head';
import Layout from '../components/Layout';
import MapView from '../components/MapView';
import ZoningAnalysis from '../components/ZoningAnalysis';
import EnvironmentalInsights from '../components/EnvironmentalInsights';
import FeasibilityEstimation from '../components/FeasibilityEstimation';
import { searchSite, getZoningInfo, getClimateData, getSolarAnalysis, getFloodRiskData, getSiteById } from '../services/api';
import { FaMapMarkerAlt, FaBuilding, FaLeaf, FaChartLine, FaInfoCircle, FaDownload, FaCheckCircle, FaLightbulb } from 'react-icons/fa';
import { Icon } from '@chakra-ui/react';

export default function Analysis() {
  const router = useRouter();
  const { address } = router.query;
  const [isLoading, setIsLoading] = useState(true);
  const [siteData, setSiteData] = useState(null);
  const toast = useToast();

  useEffect(() => {
    if (!address) return;

    console.log('URL address:', address);

    const fetchSiteData = async () => {
      try {
        setIsLoading(true);
        
        // Search for the site
        const siteResponse = await searchSite(address as string);
        const site = siteResponse.data;
        console.log('Site from search:', site);
        
        // Get additional data using the site ID
        const siteDetailResponse = await getSiteById(site.id);
        const siteDetail = siteDetailResponse.data;
        console.log('Site detail:', siteDetail);
        
        // Create a new object with the original address explicitly set
        const fullSiteData = {
          ...siteDetail,
          address: address as string, // Force use of the URL query address
          coordinates: site.coordinates
        };
        console.log('Full site data:', fullSiteData);
        
        setSiteData(fullSiteData);
      } catch (error) {
        console.error('Error fetching site data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load site data. Please try again.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSiteData();
  }, [address]);

  if (!address) {
    return (
      <Layout>
        <Container maxW="container.xl" py={10}>
          <Text>No address provided. Please return to the home page.</Text>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>Site Analysis | SiteScout</title>
        <meta name="description" content={`Site analysis for ${address}`} />
      </Head>

      <Container maxW="container.xl" py={8}>
        <Box mb={8}>
          <Heading as="h1" size="xl" mb={2}>
            Site Analysis
          </Heading>
          <Flex align="center">
            <Icon as={FaMapMarkerAlt} color="brand.500" mr={2} />
            <Text fontSize="lg" color="gray.600">
              {typeof address === 'string' ? address : 'No address provided'}
            </Text>
          </Flex>
        </Box>

        <Grid templateColumns="repeat(12, 1fr)" gap={6}>
          <GridItem colSpan={{ base: 12, md: 8 }}>
            <Box bg="white" borderRadius="lg" boxShadow="md" overflow="hidden" mb={6}>
              <Box height="400px" position="relative">
                <Skeleton isLoaded={!isLoading} height="100%">
                  {siteData && (
                    <MapView coordinates={siteData.coordinates} />
                  )}
                </Skeleton>
              </Box>
            </Box>

            <Box bg="white" borderRadius="lg" boxShadow="md" p={6}>
              <Skeleton isLoaded={!isLoading}>
                <Tabs colorScheme="brand" isLazy variant="enclosed">
                  <TabList>
                    <Tab fontWeight="semibold">
                      <Icon as={FaBuilding} mr={2} />
                      Zoning Analysis
                    </Tab>
                    <Tab fontWeight="semibold">
                      <Icon as={FaLeaf} mr={2} />
                      Environmental
                    </Tab>
                    <Tab fontWeight="semibold">
                      <Icon as={FaChartLine} mr={2} />
                      Feasibility
                    </Tab>
                    <Tab fontWeight="semibold">
                      <Icon as={FaLightbulb} mr={2} />
                      Design Inspiration
                    </Tab>
                  </TabList>
                  <TabPanels>
                    <TabPanel>
                      {siteData && <ZoningAnalysis data={siteData.zoning} />}
                    </TabPanel>
                    <TabPanel>
                      {siteData && <EnvironmentalInsights data={siteData.environmental} />}
                    </TabPanel>
                    <TabPanel>
                      {siteData && <FeasibilityEstimation />}
                    </TabPanel>
                    <TabPanel>
                      <Text>Design inspiration content will go here</Text>
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </Skeleton>
            </Box>
          </GridItem>

          <GridItem colSpan={{ base: 12, md: 4 }}>
            <Box bg="white" borderRadius="lg" boxShadow="md" p={6} mb={6}>
              <Skeleton isLoaded={!isLoading}>
                <Heading as="h3" size="md" mb={4} display="flex" alignItems="center">
                  <Icon as={FaInfoCircle} mr={2} color="brand.500" />
                  Site Summary
                </Heading>
                {siteData && (
                  <Stack spacing={4}>
                    <Flex justify="space-between" align="center">
                      <Text fontWeight="medium">Zoning District:</Text>
                      <Badge colorScheme="blue" fontSize="0.9em" p={1}>
                        {siteData.zoning.district}
                      </Badge>
                    </Flex>
                    <Flex justify="space-between" align="center">
                      <Text fontWeight="medium">Max Building Height:</Text>
                      <Text>{siteData.zoning.maxHeight}</Text>
                    </Flex>
                    <Flex justify="space-between" align="center">
                      <Text fontWeight="medium">Floor Area Ratio (FAR):</Text>
                      <Text>{siteData.zoning.far}</Text>
                    </Flex>
                    <Flex justify="space-between" align="center">
                      <Text fontWeight="medium">Climate:</Text>
                      <Text>{siteData.environmental.climate}</Text>
                    </Flex>
                    <Divider />
                    <Button 
                      rightIcon={<FaDownload />} 
                      colorScheme="brand" 
                      variant="outline" 
                      size="sm"
                    >
                      Download Report
                    </Button>
                  </Stack>
                )}
              </Skeleton>
            </Box>

            <Box bg="white" borderRadius="lg" boxShadow="md" p={6}>
              <Skeleton isLoaded={!isLoading}>
                <Heading as="h3" size="md" mb={4} display="flex" alignItems="center">
                  <Icon as={FaLightbulb} mr={2} color="brand.500" />
                  Recommendations
                </Heading>
                {siteData && (
                  <Stack spacing={3}>
                    {siteData.recommendations.map((rec, index) => (
                      <Flex key={index} align="flex-start">
                        <Icon as={FaCheckCircle} color="green.500" mt={1} mr={2} />
                        <Text>{rec}</Text>
                      </Flex>
                    ))}
                  </Stack>
                )}
              </Skeleton>
            </Box>
          </GridItem>
        </Grid>
      </Container>
    </Layout>
  );
} 