import { Box, Heading, Text, Button, Flex, Icon } from '@chakra-ui/react';
import { FaMapSigns } from 'react-icons/fa';
import NextLink from 'next/link';
import Layout from '../components/Layout';

export default function Custom404() {
  return (
    <Layout>
      <Flex
        align="center"
        justify="center"
        direction="column"
        minH="70vh"
        p={8}
        textAlign="center"
      >
        <Icon as={FaMapSigns} boxSize={20} color="brand.500" mb={6} />
        <Heading as="h1" size="2xl" mb={4}>
          404 - Site Not Found
        </Heading>
        <Text fontSize="xl" mb={8} maxW="lg">
          It seems you've ventured off the map. The site you're looking for doesn't exist or has been moved.
        </Text>
        <NextLink href="/" passHref>
          <Button
            colorScheme="brand"
            size="lg"
            leftIcon={<FaMapSigns />}
          >
            Back to Home Base
          </Button>
        </NextLink>
      </Flex>
    </Layout>
  );
} 