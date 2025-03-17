import { Box, Container, Heading, Text } from '@chakra-ui/react';
import Head from 'next/head';
import SiteSearchForm from '../components/SiteSearchForm';
import Layout from '../components/Layout';

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>SiteScout - AI-Assisted Site Analysis</title>
        <meta name="description" content="Streamline architectural site analysis with AI" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container maxW="container.xl" py={10}>
        <Box textAlign="center" mb={10}>
          <Heading as="h1" size="2xl" mb={4}>
            SiteScout
          </Heading>
          <Text fontSize="xl" color="gray.600">
            AI-Assisted Site Analysis and Feasibility Tool for Architects
          </Text>
        </Box>

        <SiteSearchForm />
      </Container>
    </Layout>
  );
} 