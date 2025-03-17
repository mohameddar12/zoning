import { Box, Flex, Spinner, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const LoadingSpinner = ({ message = 'Loading site data...' }) => {
  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      height="100%"
      width="100%"
      p={10}
    >
      <MotionBox
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.8, 1, 0.8]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse"
        }}
        mb={6}
      >
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="brand.500"
          size="xl"
        />
      </MotionBox>
      <Text fontSize="lg" color="gray.600" textAlign="center">
        {message}
      </Text>
    </Flex>
  );
};

export default LoadingSpinner; 