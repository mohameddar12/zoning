import {
  Box,
  Container,
  Heading,
  Text,
  Stack,
  Flex,
  Image,
  SimpleGrid,
  Icon,
  Button,
  useColorModeValue
} from '@chakra-ui/react';
import { FaMapMarkerAlt, FaBuilding, FaLeaf, FaChartLine } from 'react-icons/fa';
import Head from 'next/head';
import SiteSearchForm from '../components/SiteSearchForm';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const Feature = ({ title, text, icon }) => {
  return (
    <Stack align={'center'} textAlign={'center'}>
      <Flex
        w={16}
        h={16}
        align={'center'}
        justify={'center'}
        color={'white'}
        rounded={'full'}
        bg={'brand.500'}
        mb={1}
      >
        <Icon as={icon} w={10} h={10} />
      </Flex>
      <Text fontWeight={600} fontSize="lg">{title}</Text>
      <Text color={'gray.600'}>{text}</Text>
    </Stack>
  );
};

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>SiteScout - AI-Assisted Site Analysis</title>
        <meta name="description" content="Streamline architectural site analysis with AI" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box 
        bg={useColorModeValue('gray.50', 'gray.900')}
        position="relative"
        overflow="hidden"
      >
        {/* Hero Section */}
        <Container maxW={'7xl'} py={16}>
          <Stack
            align={'center'}
            spacing={{ base: 8, md: 10 }}
            direction={{ base: 'column', md: 'row' }}
          >
            <Stack flex={1} spacing={{ base: 5, md: 10 }}>
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Heading
                  lineHeight={1.1}
                  fontWeight={600}
                  fontSize={{ base: '3xl', sm: '4xl', lg: '6xl' }}
                >
                  <Text
                    as={'span'}
                    position={'relative'}
                    color={'brand.500'}
                  >
                    SiteScout
                  </Text>
                  <br />
                  <Text as={'span'} fontSize={{ base: '2xl', sm: '3xl', lg: '4xl' }}>
                    AI-Powered Site Analysis
                  </Text>
                </Heading>
                <Text color={'gray.600'} maxW={'3xl'} mt={4} fontSize="lg">
                  Transform your architectural workflow with intelligent site analysis. 
                  SiteScout combines zoning data, environmental insights, and feasibility 
                  metrics to help you make informed design decisions.
                </Text>
              </MotionBox>
            </Stack>
            <Flex
              flex={1}
              justify={'center'}
              align={'center'}
              position={'relative'}
              w={'full'}
            >
              <Box
                position={'relative'}
                height={'400px'}
                rounded={'2xl'}
                boxShadow={'2xl'}
                width={'full'}
                overflow={'hidden'}
              >
                <Image
                  alt={'Hero Image'}
                  fit={'cover'}
                  align={'center'}
                  w={'100%'}
                  h={'100%'}
                  src={
                    'https://images.unsplash.com/photo-1524758631624-e2822e304c36?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80'
                  }
                />
              </Box>
            </Flex>
          </Stack>
        </Container>

        {/* Search Form Section */}
        <Box py={10} bg={useColorModeValue('white', 'gray.800')}>
          <Container maxW={'7xl'}>
            <Heading
              textAlign={'center'}
              fontSize={'3xl'}
              py={10}
              fontWeight={'bold'}
            >
              Start Your Site Analysis
            </Heading>
            <SiteSearchForm />
          </Container>
        </Box>

        {/* Features Section */}
        <Box py={20}>
          <Container maxW={'7xl'}>
            <Heading
              textAlign={'center'}
              fontSize={'3xl'}
              py={10}
              fontWeight={'bold'}
            >
              Comprehensive Site Intelligence
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 4 }} spacing={10} px={{ base: 4, md: 10 }}>
              <Feature
                icon={FaMapMarkerAlt}
                title={'Zoning Analysis'}
                text={
                  'Instantly access zoning regulations, building codes, and development constraints for any site.'
                }
              />
              <Feature
                icon={FaBuilding}
                title={'3D Visualization'}
                text={
                  'Visualize your site in context with interactive 3D models and surrounding buildings.'
                }
              />
              <Feature
                icon={FaLeaf}
                title={'Environmental Insights'}
                text={
                  'Analyze climate data, solar exposure, and sustainability factors to inform your design.'
                }
              />
              <Feature
                icon={FaChartLine}
                title={'Feasibility Metrics'}
                text={
                  'Evaluate project costs, ROI, and development potential to make data-driven decisions.'
                }
              />
            </SimpleGrid>
          </Container>
        </Box>

        {/* CTA Section */}
        <Box bg={'brand.500'} py={16}>
          <Container maxW={'7xl'}>
            <Stack
              direction={{ base: 'column', md: 'row' }}
              spacing={4}
              align={'center'}
              justify={'center'}
              textAlign={'center'}
            >
              <Stack spacing={4} w={{ base: 'full', md: '50%' }} color={'white'}>
                <Heading fontSize={'3xl'}>Ready to transform your site analysis workflow?</Heading>
                <Text fontSize={'lg'}>
                  Join architects and developers who are using SiteScout to streamline their design process.
                </Text>
                <Stack direction={{ base: 'column', md: 'row' }} spacing={4} justify={'center'}>
                  <Button
                    rounded={'full'}
                    bg={'white'}
                    color={'brand.500'}
                    _hover={{
                      bg: 'gray.100',
                    }}
                    size={'lg'}
                    fontWeight={'normal'}
                    px={6}
                  >
                    Get Started
                  </Button>
                  <Button
                    rounded={'full'}
                    bg={'whiteAlpha.300'}
                    color={'white'}
                    _hover={{
                      bg: 'whiteAlpha.500',
                    }}
                    size={'lg'}
                    fontWeight={'normal'}
                    px={6}
                  >
                    Learn More
                  </Button>
                </Stack>
              </Stack>
            </Stack>
          </Container>
        </Box>
      </Box>
    </Layout>
  );
} 