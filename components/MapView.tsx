import { useEffect, useRef } from 'react';
import { Box } from '@chakra-ui/react';

interface MapViewProps {
  coordinates: {
    lat: number;
    lng: number;
  };
}

const MapView = ({ coordinates }: MapViewProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);

  useEffect(() => {
    // In a real app, we would initialize Mapbox GL here
    // For now, we'll just display a placeholder
    console.log('Map would be initialized with coordinates:', coordinates);
  }, [coordinates]);

  return (
    <Box
      ref={mapContainer}
      height="100%"
      width="100%"
      position="relative"
      bg="gray.100"
      borderRadius="lg"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Box textAlign="center" p={4}>
        <Box as="h3" fontSize="lg" fontWeight="bold" mb={2}>
          Interactive Map View
        </Box>
        <Box>
          Coordinates: {coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)}
        </Box>
        <Box mt={2} fontSize="sm" color="gray.500">
          (Mapbox integration would be implemented here)
        </Box>
      </Box>
    </Box>
  );
};

export default MapView; 