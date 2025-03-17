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
} from '@chakra-ui/react';
import Head from 'next/head';
import Layout from '../components/Layout';
import MapView from '../components/MapView';
import ZoningAnalysis from '../components/ZoningAnalysis';
import EnvironmentalInsights from '../components/EnvironmentalInsights';
import FeasibilityEstimation from '../components/FeasibilityEstimation';
import { searchSite, getZoningInfo, getClimateData, getSolarAnalysis, getFloodRiskData } from '../services/api';

export default function Analysis() {
  const router = useRouter();
  const { address } = router.query;
  const [isLoading, setIsLoading] = useState(true);
  const [siteData, setSiteData] = useState(null);
  const toast = useToast();

  useEffect(() => {
    if (!address) return;

    const fetchSiteData = async () => {
      try {
        setIsLoading(true);
        
        // Search for the site
        const siteResponse = await searchSite(address as string);
        const site = siteResponse.data;
        
        // Get additional data
        const [zoningResponse, climateResponse, solarResponse, floodResponse] = await Promise.all([
          getZoningInfo(site.coordinates.lat, site.coordinates.lng),
          getClimateData(site.coordinates.lat, site.coordinates.lng),
          getSolarAnalysis(site.coordinates.lat, site.coordinates.lng),
          getFloodRiskData(site.coordinates.lat, site.coordinates.lng)
        ]);
        
        // Combine all data
        const fullSiteData = {
          ...site,
          zoning: zoningResponse.data,
          environmental: {
            ...climateResponse.data,
            solarAnalysis: solarResponse.data,
            floodRisk: floodResponse.data
          }
        };
        
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

      <Container maxW="container.xl" py={6}>
        <Box mb={8}>
          <Skeleton isLoaded={!isLoading}>
            <Heading as="h1" size="xl" mb={2}>
              Site Analysis
            </Heading>
            <Flex align="center" mb={4}>
              <Text fontSize="lg" color="gray.600" mr={3}>
                {address}
              </Text>
              {siteData && (
                <Badge colorScheme="green" fontSize="0.8em">
                  Analysis Complete
                </Badge>
              )}
            </Flex>
          </Skeleton>
        </Box>

        <Grid templateColumns="repeat(12, 1fr)" gap={6}>
          <GridItem colSpan={{ base: 12, md: 8 }}>
            <Box bg="white" borderRadius="lg" boxShadow="md" height="400px" mb={6}>
              <Skeleton isLoaded={!isLoading} height="100%">
                {siteData && <MapView coordinates={siteData.coordinates} />}
              </Skeleton>
            </Box>

            <Box bg="white" borderRadius="lg" boxShadow="md" p={6}>
              <Skeleton isLoaded={!isLoading}>
                <Tabs colorScheme="brand" isLazy>
                  <TabList>
                    <Tab>Zoning Analysis</Tab>
                    <Tab>Environmental</Tab>
                    <Tab>Feasibility</Tab>
                    <Tab>Design Inspiration</Tab>
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
                <Heading as="h3" size="md" mb={4}>
                  Site Summary
                </Heading>
                {siteData && (
                  <>
                    <Text mb={2}>
                      <strong>Zoning District:</strong> {siteData.zoning.district}
                    </Text>
                    <Text mb={2}>
                      <strong>Max Building Height:</strong> {siteData.zoning.maxHeight}
                    </Text>
                    <Text mb={2}>
                      <strong>Floor Area Ratio (FAR):</strong> {siteData.zoning.far}
                    </Text>
                    <Text mb={2}>
                      <strong>Climate:</strong> {siteData.environmental.climate}
                    </Text>
                  </>
                )}
              </Skeleton>
            </Box>

            <Box bg="white" borderRadius="lg" boxShadow="md" p={6}>
              <Skeleton isLoaded={!isLoading}>
                <Heading as="h3" size="md" mb={4}>
                  Recommendations
                </Heading>
                {siteData && (
                  <>
                    <Text mb={2}>
                      • Optimize building orientation for solar gain
                    </Text>
                    <Text mb={2}>
                      • Consider setback requirements for outdoor spaces
                    </Text>
                    <Text mb={2}>
                      • Explore mixed-use development options
                    </Text>
                    <Text mb={2}>
                      • Implement rainwater harvesting systems
                    </Text>
                  </>
                )}
              </Skeleton>
            </Box>
          </GridItem>
        </Grid>
      </Container>
    </Layout>
  );
} 