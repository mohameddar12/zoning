import { useEffect, useRef, useState } from 'react';
import { Box } from '@chakra-ui/react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Set your Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1IjoibWRhcndpY2hlIiwiYSI6ImNtOGNkeHMwNjFxcDQyanE1c3dzNjM2OTYifQ.M5XYRMVhKgQS8_jXQTncrw';

interface MapViewProps {
  coordinates: {
    lat: number;
    lng: number;
  };
}

const MapView = ({ coordinates }: MapViewProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [zoom, setZoom] = useState(15);

  useEffect(() => {
    if (!map.current && mapContainer.current) {
      // Initialize map
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [coordinates.lng, coordinates.lat],
        zoom: zoom
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
      
      // Add marker
      new mapboxgl.Marker()
        .setLngLat([coordinates.lng, coordinates.lat])
        .addTo(map.current);
    } else if (map.current) {
      // Update map if coordinates change
      map.current.flyTo({
        center: [coordinates.lng, coordinates.lat],
        zoom: zoom
      });
    }
  }, [coordinates, zoom]);

  return (
    <Box
      ref={mapContainer}
      height="100%"
      width="100%"
      position="relative"
      borderRadius="lg"
    />
  );
};

export default MapView; 