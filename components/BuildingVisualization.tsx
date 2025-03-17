import { useEffect, useRef, useState } from 'react';
import { Box, Heading, Text, Flex, Slider, SliderTrack, SliderFilledTrack, SliderThumb, Select, FormControl, FormLabel, HStack, Button, Icon, Tooltip, Box as ChakraBox } from '@chakra-ui/react';
import { FaBuilding, FaRuler, FaRulerVertical, FaRulerHorizontal, FaRulerCombined, FaInfoCircle } from 'react-icons/fa';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Import the correct version of BufferGeometryUtils
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';

interface BuildingVisualizationProps {
  zoning?: {
    maxHeight?: string;
    far?: number | string;
    setbacks?: {
      front?: string;
      side?: string;
      rear?: string;
    };
  };
  siteWidth?: number; // in feet
  siteDepth?: number; // in feet
}

const BuildingVisualization = ({ zoning = {}, siteWidth = 100, siteDepth = 150 }: BuildingVisualizationProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const buildingRef = useRef<THREE.Mesh | null>(null);
  
  // Ensure zoning object has all required properties with defaults
  const safeZoning = {
    maxHeight: zoning?.maxHeight || '60 ft',
    far: zoning?.far || 2.0,
    setbacks: {
      front: zoning?.setbacks?.front || '10 ft',
      side: zoning?.setbacks?.side || '5 ft',
      rear: zoning?.setbacks?.rear || '10 ft'
    }
  };
  
  // Building parameters state
  const [buildingType, setBuildingType] = useState<string>('box');
  const [buildingHeight, setBuildingHeight] = useState<number>(parseMaxHeight(safeZoning.maxHeight));
  const [buildingWidth, setBuildingWidth] = useState<number>(siteWidth - parseSetback(safeZoning.setbacks.side) * 2);
  const [buildingDepth, setBuildingDepth] = useState<number>(siteDepth - parseSetback(safeZoning.setbacks.front) - parseSetback(safeZoning.setbacks.rear));
  const [floors, setFloors] = useState<number>(Math.floor(buildingHeight / 12));
  
  // Helper functions to parse zoning values
  function parseMaxHeight(height: string): number {
    const match = height.match(/(\d+)/);
    return match ? parseInt(match[1]) : 60;
  }
  
  function parseSetback(setback: string): number {
    const match = setback.match(/(\d+)/);
    return match ? parseInt(match[1]) : 10;
  }
  
  function parseFAR(far: number | string): number {
    if (typeof far === 'number') return far;
    const parsed = parseFloat(far);
    return isNaN(parsed) ? 2.0 : parsed;
  }
  
  // Calculate maximum buildable area based on FAR
  const siteArea = siteWidth * siteDepth;
  const maxBuildableArea = siteArea * parseFAR(safeZoning.far);
  const currentBuildableArea = buildingWidth * buildingDepth * floors;
  const farUtilization = (currentBuildableArea / maxBuildableArea) * 100;
  
  // Initialize Three.js scene
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Create scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    sceneRef.current = scene;
    
    // Create camera
    const camera = new THREE.PerspectiveCamera(
      45,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      1,
      1000
    );
    camera.position.set(200, 200, 200);
    cameraRef.current = camera;
    
    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // Add orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controlsRef.current = controls;
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(100, 100, 50);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    
    // Add ground plane (site)
    const groundGeometry = new THREE.PlaneGeometry(siteWidth, siteDepth);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0x7ec850,
      side: THREE.DoubleSide,
      roughness: 0.8
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);
    
    // Add grid for scale reference
    const gridHelper = new THREE.GridHelper(300, 30);
    scene.add(gridHelper);
    
    // Add axes helper
    const axesHelper = new THREE.AxesHelper(50);
    scene.add(axesHelper);
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      
      if (rendererRef.current && cameraRef.current && sceneRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    
    animate();
    
    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      
      cameraRef.current.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (containerRef.current && rendererRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, [siteWidth, siteDepth]);
  
  // Create or update building based on parameters
  useEffect(() => {
    if (!sceneRef.current) return;
    
    // Remove existing building if any
    if (buildingRef.current) {
      sceneRef.current.remove(buildingRef.current);
      buildingRef.current = null;
    }
    
    // Create building based on type and parameters
    let geometry;
    
    // Simple function to create a merged geometry or fall back to a box
    const createMergedGeometry = (geometries: THREE.BufferGeometry[]) => {
      try {
        // Use the correct method from BufferGeometryUtils
        return BufferGeometryUtils.mergeGeometries(geometries);
      } catch (error) {
        console.error('Error merging geometries:', error);
        return new THREE.BoxGeometry(buildingWidth, buildingHeight, buildingDepth);
      }
    };
    
    switch (buildingType) {
      case 'box':
        geometry = new THREE.BoxGeometry(buildingWidth, buildingHeight, buildingDepth);
        break;
      case 'lShape':
        // Create L-shaped building using merged geometries
        const mainBlock = new THREE.BoxGeometry(buildingWidth * 0.7, buildingHeight, buildingDepth);
        const sideBlock = new THREE.BoxGeometry(buildingWidth * 0.3, buildingHeight, buildingDepth * 0.6);
        
        // Position the geometries
        mainBlock.translate(buildingWidth * 0.15, 0, 0);
        sideBlock.translate(-buildingWidth * 0.35, 0, -buildingDepth * 0.2);
        
        // Merge geometries
        geometry = createMergedGeometry([mainBlock, sideBlock]);
        break;
      case 'uShape':
        // Create U-shaped building
        const frontBlock = new THREE.BoxGeometry(buildingWidth, buildingHeight, buildingDepth * 0.3);
        const leftWing = new THREE.BoxGeometry(buildingWidth * 0.3, buildingHeight, buildingDepth * 0.7);
        const rightWing = new THREE.BoxGeometry(buildingWidth * 0.3, buildingHeight, buildingDepth * 0.7);
        
        // Position the geometries
        frontBlock.translate(0, 0, -buildingDepth * 0.35);
        leftWing.translate(-buildingWidth * 0.35, 0, buildingDepth * 0.15);
        rightWing.translate(buildingWidth * 0.35, 0, buildingDepth * 0.15);
        
        // Merge geometries
        geometry = createMergedGeometry([frontBlock, leftWing, rightWing]);
        break;
      case 'tower':
        // Create tower with setback
        const base = new THREE.BoxGeometry(buildingWidth, buildingHeight * 0.3, buildingDepth);
        const tower = new THREE.BoxGeometry(buildingWidth * 0.6, buildingHeight * 0.7, buildingDepth * 0.6);
        
        // Position the geometries
        base.translate(0, buildingHeight * 0.15, 0);
        tower.translate(0, buildingHeight * 0.65, 0);
        
        // Merge geometries
        geometry = createMergedGeometry([base, tower]);
        break;
      default:
        geometry = new THREE.BoxGeometry(buildingWidth, buildingHeight, buildingDepth);
    }
    
    // Create building material
    const material = new THREE.MeshStandardMaterial({
      color: 0x4a90e2,
      metalness: 0.2,
      roughness: 0.5
    });
    
    // Create building mesh
    const building = new THREE.Mesh(geometry, material);
    
    // Position building with setbacks
    const frontSetback = parseSetback(safeZoning.setbacks.front);
    const sideSetback = parseSetback(safeZoning.setbacks.side);
    
    building.position.set(
      0, // Centered on x-axis
      buildingHeight / 2, // Half height to place on ground
      0 // Centered on z-axis
    );
    
    building.castShadow = true;
    building.receiveShadow = true;
    
    // Add building to scene
    sceneRef.current.add(building);
    buildingRef.current = building;
    
  }, [buildingType, buildingHeight, buildingWidth, buildingDepth, floors, safeZoning]);
  
  return (
    <Box>
      <Heading size="md" mb={4}>3D Building Visualization</Heading>
      <Text mb={4}>
        Explore potential building configurations based on zoning parameters. Adjust the sliders to see how different dimensions affect the building.
      </Text>
      
      <Flex direction={{ base: 'column', lg: 'row' }} gap={6}>
        {/* 3D Visualization */}
        <Box 
          ref={containerRef} 
          width={{ base: '100%', lg: '60%' }} 
          height="400px" 
          borderRadius="md" 
          overflow="hidden"
          boxShadow="md"
        />
        
        {/* Controls */}
        <Box width={{ base: '100%', lg: '40%' }}>
          <FormControl mb={4}>
            <FormLabel>Building Type</FormLabel>
            <Select 
              value={buildingType} 
              onChange={(e) => setBuildingType(e.target.value)}
            >
              <option value="box">Simple Box</option>
              <option value="lShape">L-Shaped Building</option>
              <option value="uShape">U-Shaped Building</option>
              <option value="tower">Tower with Base</option>
            </Select>
          </FormControl>
          
          <FormControl mb={4}>
            <HStack justify="space-between">
              <FormLabel mb={0}>Building Height</FormLabel>
              <Text>{buildingHeight} ft</Text>
            </HStack>
            <Slider 
              min={10} 
              max={parseMaxHeight(safeZoning.maxHeight)} 
              step={1} 
              value={buildingHeight} 
              onChange={(val) => {
                setBuildingHeight(val);
                setFloors(Math.floor(val / 12));
              }}
              colorScheme="blue"
            >
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb boxSize={6}>
                <Icon as={FaRulerVertical} color="blue.500" />
              </SliderThumb>
            </Slider>
            <Text fontSize="sm" color="gray.500">
              Max allowed: {safeZoning.maxHeight}
            </Text>
          </FormControl>
          
          <FormControl mb={4}>
            <HStack justify="space-between">
              <FormLabel mb={0}>Building Width</FormLabel>
              <Text>{buildingWidth} ft</Text>
            </HStack>
            <Slider 
              min={10} 
              max={siteWidth - parseSetback(safeZoning.setbacks.side) * 2} 
              step={1} 
              value={buildingWidth} 
              onChange={(val) => setBuildingWidth(val)}
              colorScheme="blue"
            >
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb boxSize={6}>
                <Icon as={FaRulerHorizontal} color="blue.500" />
              </SliderThumb>
            </Slider>
          </FormControl>
          
          <FormControl mb={4}>
            <HStack justify="space-between">
              <FormLabel mb={0}>Building Depth</FormLabel>
              <Text>{buildingDepth} ft</Text>
            </HStack>
            <Slider 
              min={10} 
              max={siteDepth - parseSetback(safeZoning.setbacks.front) - parseSetback(safeZoning.setbacks.rear)} 
              step={1} 
              value={buildingDepth} 
              onChange={(val) => setBuildingDepth(val)}
              colorScheme="blue"
            >
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb boxSize={6}>
                <Icon as={FaRulerHorizontal} color="blue.500" />
              </SliderThumb>
            </Slider>
          </FormControl>
          
          <FormControl mb={4}>
            <HStack justify="space-between">
              <FormLabel mb={0}>Number of Floors</FormLabel>
              <Text>{floors}</Text>
            </HStack>
            <Slider 
              min={1} 
              max={Math.floor(parseMaxHeight(safeZoning.maxHeight) / 10)} 
              step={1} 
              value={floors} 
              onChange={(val) => {
                setFloors(val);
                setBuildingHeight(val * 12); // Assuming 12 feet per floor
              }}
              colorScheme="blue"
            >
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb boxSize={6}>
                <Icon as={FaBuilding} color="blue.500" />
              </SliderThumb>
            </Slider>
          </FormControl>
          
          <Box 
            p={4} 
            bg="blue.50" 
            borderRadius="md" 
            borderLeft="4px solid" 
            borderColor="blue.500"
          >
            <HStack mb={2}>
              <Icon as={FaInfoCircle} color="blue.500" />
              <Text fontWeight="bold">FAR Utilization</Text>
              <ChakraBox as="span">
                <Tooltip label="Floor Area Ratio (FAR) is the ratio of a building's total floor area to the size of the land upon which it is built.">
                  <span>
                    <Icon as={FaInfoCircle} color="gray.500" cursor="help" />
                  </span>
                </Tooltip>
              </ChakraBox>
            </HStack>
            <Text>Current: {Math.round(currentBuildableArea).toLocaleString()} sq ft</Text>
            <Text>Maximum: {Math.round(maxBuildableArea).toLocaleString()} sq ft</Text>
            <Text>Utilization: {Math.round(farUtilization)}%</Text>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
};

export default BuildingVisualization; 