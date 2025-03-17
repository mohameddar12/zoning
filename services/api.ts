import axios from 'axios';
import zoningService from './zoningService';

// Add type declaration for window.originalAddress
declare global {
  interface Window {
    originalAddress?: string;
  }
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 'pk.eyJ1IjoibWRhcndpY2hlIiwiYSI6ImNtOGNkeHMwNjFxcDQyanE1c3dzNjM2OTYifQ.M5XYRMVhKgQS8_jXQTncrw';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Mock data for development
const useMockData = true; // Set to false when backend is working

// Function to get coordinates for an address using Mapbox Geocoding API
const getCoordinatesForAddress = async (address: string): Promise<{ lat: number, lng: number }> => {
  try {
    // URL encode the address
    const encodedAddress = encodeURIComponent(address);
    
    // Make request to Mapbox Geocoding API
    const response = await axios.get(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?access_token=${MAPBOX_TOKEN}&limit=1`
    );
    
    // Check if we got results
    if (response.data.features && response.data.features.length > 0) {
      // Mapbox returns coordinates as [longitude, latitude]
      const [lng, lat] = response.data.features[0].center;
      return { lat, lng };
    }
    
    // Return default coordinates if no results
    console.warn('No geocoding results found for address:', address);
    return { lat: 40.7128, lng: -74.0060 }; // Default to New York
  } catch (error) {
    console.error('Error geocoding address:', error);
    return { lat: 40.7128, lng: -74.0060 }; // Default to New York on error
  }
};

// Site API
export const searchSite = async (query: string) => {
  if (useMockData) {
    try {
      // Get coordinates for the address using real geocoding
      const { lat, lng } = await getCoordinatesForAddress(query);
      
      // Generate a unique ID based on the address
      const addressSeed = query.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      
      // Store the original query in a global variable
      window.originalAddress = query;
      
      // Return mock data with real coordinates
      return {
        data: {
          id: 'mock-site-id-' + addressSeed,
          address: query,
          originalAddress: query,
          coordinates: {
            lat: lat,
            lng: lng
          },
          createdAt: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('Error in searchSite:', error);
      throw error;
    }
  }
  
  const response = await api.get(`/sites/search?address=${encodeURIComponent(query)}`);
  return response.data;
};

export const getSiteById = async (siteId: string) => {
  if (useMockData) {
    try {
      // Try to get the original address from the global variable
      const originalAddress = window.originalAddress || '';
      
      // Extract the address seed from the site ID
      const addressSeedStr = siteId.replace('mock-site-id-', '');
      const addressSeed = parseInt(addressSeedStr) || 0;
      
      // Get coordinates for the address using real geocoding
      const { lat, lng } = originalAddress ? 
        await getCoordinatesForAddress(originalAddress) : 
        { lat: 40.7128, lng: -74.0060 }; // Default to New York if no address
      
      // Get real zoning data from Regrid
      let zoningData = await zoningService.getZoningData(lat, lng);
      
      // Fallback to mock zoning data if real data isn't available
      if (!zoningData) {
        zoningData = {
          district: ['R6', 'C2', 'M1', 'B3', 'D4'][addressSeed % 5],
          description: 'Zoning district description',
          maxHeight: `${100 + (addressSeed % 100)} ft`,
          far: (2 + (addressSeed % 10) / 10),
          setbacks: { front: '10 ft', side: '5 ft', rear: '30 ft' },
          allowedUses: ['Residential', 'Commercial', 'Mixed-Use', 'Community Facility'][addressSeed % 4],
          source: 'Mock Data'
        };
      }
      
      // Determine state name based on the address (simplified)
      let stateName = "New York";
      if (originalAddress.toLowerCase().includes('mi') || 
          originalAddress.toLowerCase().includes('michigan')) {
        stateName = "Michigan";
      } else if (originalAddress.toLowerCase().includes('ca') || 
                originalAddress.toLowerCase().includes('california')) {
        stateName = "California";
      }
      // Add more state detection as needed
      
      return {
        data: {
          id: siteId,
          address: originalAddress || `${123 + (addressSeed % 900)} ${['Main', 'Oak', 'Maple', 'Washington', 'Broadway'][addressSeed % 5]} St, ${stateName}`,
          originalAddress: originalAddress,
          coordinates: {
            lat: lat,
            lng: lng
          },
          zoning: zoningData,
          environmental: {
            climate: ['Humid subtropical', 'Mediterranean', 'Continental', 'Arid'][addressSeed % 4],
            annualSunHours: 2000 + (addressSeed % 1000),
            prevailingWinds: ['SW', 'NE', 'NW', 'SE'][addressSeed % 4],
            floodZone: ['Zone X', 'Zone A', 'Zone B', 'Zone C'][addressSeed % 4],
            soilType: ['Sandy loam', 'Clay', 'Silt', 'Loam'][addressSeed % 4],
          },
          recommendations: [
            'Optimize building orientation for solar gain',
            'Consider setback requirements for outdoor spaces',
            'Explore mixed-use development options',
            'Implement rainwater harvesting systems',
            'Utilize passive cooling strategies',
            'Incorporate green roof systems',
            'Design for natural ventilation',
            'Consider geothermal heating/cooling'
          ].slice(0, 4 + (addressSeed % 4))
        }
      };
    } catch (error) {
      console.error('Error in getSiteById:', error);
      throw error;
    }
  }
  
  const response = await api.get(`/sites/${siteId}`);
  return response.data;
};

// Zoning API
export const getZoningInfo = async (lat: number, lng: number) => {
  if (useMockData) {
    return {
      data: {
        district: 'R6',
        description: 'Medium-density residential district',
        maxHeight: '120 ft',
        far: 3.0,
        setbacks: {
          front: '10 ft',
          side: '5 ft',
          rear: '30 ft'
        },
        allowedUses: [
          'Residential',
          'Community Facility'
        ],
        parkingRequirements: '0.5 spaces per dwelling unit'
      }
    };
  }
  
  const response = await api.get(`/zoning/info?lat=${lat}&lng=${lng}`);
  return response.data;
};

export const getZoningRegulations = async (zoneId: string) => {
  const response = await api.get(`/zoning/regulations/${zoneId}`);
  return response.data;
};

// Environmental API
export const getClimateData = async (lat: number, lng: number) => {
  if (useMockData) {
    return {
      data: {
        climate: 'Humid subtropical',
        climateZone: 'ASHRAE 4A',
        annualSunHours: 2535,
        annualPrecipitation: 49.9,
        averageTemperatures: {
          annual: 55.7,
          summer: 76.5,
          winter: 35.2
        },
        prevailingWinds: 'SW',
        heatingDegreeDays: 4750,
        coolingDegreeDays: 1289
      }
    };
  }
  
  const response = await api.get(`/environmental/climate?lat=${lat}&lng=${lng}`);
  return response.data;
};

export const getSolarAnalysis = async (lat: number, lng: number) => {
  if (useMockData) {
    return {
      data: {
        solarExposure: 75,
        annualSolarRadiation: 4.2,
        optimalRoofAngle: 35,
        solsticeData: {
          summer: {
            sunriseTime: '05:25',
            sunsetTime: '20:31',
            daylightHours: 14.8,
            noonSunAngle: 73
          },
          winter: {
            sunriseTime: '07:16',
            sunsetTime: '16:32',
            daylightHours: 9.2,
            noonSunAngle: 26
          }
        }
      }
    };
  }
  
  const response = await api.get(`/environmental/solar?lat=${lat}&lng=${lng}`);
  return response.data;
};

export const getFloodRiskData = async (lat: number, lng: number) => {
  if (useMockData) {
    return {
      data: {
        floodZone: 'Zone X',
        floodZoneDescription: 'Area of minimal flood hazard',
        annualFloodRisk: 0.2,
        historicalFlooding: {
          events: 2,
          lastEvent: '2012-10-29',
          maxRecordedDepth: 0.5
        }
      }
    };
  }
  
  const response = await api.get(`/environmental/flood-risk?lat=${lat}&lng=${lng}`);
  return response.data;
};

// Feasibility API
export const calculateCosts = async (data: {
  buildingSize: number;
  qualityLevel: number;
  location?: string;
  buildingType?: string;
}) => {
  if (useMockData) {
    const baseCostPerSqFt = 250 + (data.qualityLevel * 50);
    const totalConstructionCost = data.buildingSize * baseCostPerSqFt;
    const softCosts = totalConstructionCost * 0.25;
    const contingency = totalConstructionCost * 0.1;
    const totalProjectCost = totalConstructionCost + softCosts + contingency;
    
    return {
      data: {
        inputs: {
          buildingSize: data.buildingSize,
          qualityLevel: ["Basic", "Standard", "Premium", "Luxury"][data.qualityLevel],
          location: data.location || 'National Average',
          buildingType: data.buildingType || 'Residential'
        },
        costs: {
          baseCostPerSqFt,
          adjustedCostPerSqFt: baseCostPerSqFt,
          totalConstructionCost,
          softCosts,
          contingency,
          totalProjectCost
        },
        financials: {
          estimatedAnnualRevenue: data.buildingSize * 30,
          annualOperatingCosts: data.buildingSize * 30 * 0.35,
          netOperatingIncome: data.buildingSize * 30 * 0.65,
          propertyValue: (data.buildingSize * 30 * 0.65) / 0.05,
          roi: 6.5,
          paybackPeriod: 12
        },
        scenarios: {
          base: {
            totalCost: totalProjectCost,
            roi: 6.5,
            paybackPeriod: 12
          },
          optimistic: {
            totalCost: totalProjectCost * 0.95,
            roi: 7.8,
            paybackPeriod: 10
          },
          conservative: {
            totalCost: totalProjectCost * 1.1,
            roi: 5.2,
            paybackPeriod: 15
          }
        }
      }
    };
  }
  
  const response = await api.post('/feasibility/calculate-costs', data);
  return response.data;
};

export const getCostIndices = async () => {
  if (useMockData) {
    return {
      data: {
        national: {
          average: 1.0,
          trend: '+2.5% YoY'
        },
        regional: [
          { region: 'Northeast', index: 1.35, trend: '+3.2% YoY' },
          { region: 'Midwest', index: 0.95, trend: '+1.8% YoY' },
          { region: 'South', index: 0.85, trend: '+2.1% YoY' },
          { region: 'West', index: 1.25, trend: '+3.5% YoY' }
        ],
        cities: [
          { city: 'New York', index: 1.5, trend: '+3.8% YoY' },
          { city: 'Chicago', index: 1.2, trend: '+2.0% YoY' },
          { city: 'Los Angeles', index: 1.3, trend: '+3.2% YoY' },
          { city: 'Houston', index: 0.9, trend: '+1.5% YoY' },
          { city: 'Miami', index: 1.1, trend: '+2.7% YoY' },
          { city: 'San Francisco', index: 1.7, trend: '+4.1% YoY' }
        ]
      }
    };
  }
  
  const response = await api.get('/feasibility/cost-indices');
  return response.data;
};

export default api; 