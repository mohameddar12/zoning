import axios from 'axios';

// Types for zoning data
export interface ZoningData {
  district: string;
  description: string;
  maxHeight: string;
  far: number | string;
  setbacks: {
    front: string;
    side: string;
    rear: string;
  };
  allowedUses: string[];
  parkingRequirements?: string;
  overlays?: string[];
  specialDistricts?: string[];
  source: string;
}

// Michigan-focused mock zoning provider
export class MichiganZoningProvider {
  // Check if coordinates are in Michigan
  isInMichigan(lat: number, lng: number): boolean {
    // Rough bounding box for Michigan
    const michiganBounds = {
      north: 48.3, // Upper Peninsula
      south: 41.7, // Southern border
      east: -82.1, // Eastern border
      west: -90.4  // Western UP border
    };
    
    return (
      lat <= michiganBounds.north &&
      lat >= michiganBounds.south &&
      lng <= michiganBounds.east &&
      lng >= michiganBounds.west
    );
  }
  
  // Get city based on coordinates
  getCityFromCoordinates(lat: number, lng: number): string | null {
    // Detroit area
    if (lat >= 42.25 && lat <= 42.45 && lng >= -83.3 && lng <= -82.9) {
      return 'Detroit';
    }
    
    // Dearborn/Dearborn Heights area
    if (lat >= 42.28 && lat <= 42.38 && lng >= -83.32 && lng <= -83.15) {
      // Dearborn Heights is slightly north of Dearborn
      if (lat >= 42.33) {
        return 'Dearborn Heights';
      }
      return 'Dearborn';
    }
    
    // Ann Arbor
    if (lat >= 42.22 && lat <= 42.33 && lng >= -83.8 && lng <= -83.67) {
      return 'Ann Arbor';
    }
    
    // Grand Rapids
    if (lat >= 42.9 && lat <= 43.0 && lng >= -85.75 && lng <= -85.57) {
      return 'Grand Rapids';
    }
    
    // Lansing
    if (lat >= 42.7 && lat <= 42.8 && lng >= -84.65 && lng <= -84.5) {
      return 'Lansing';
    }
    
    return null;
  }
  
  async getZoningData(lat: number, lng: number): Promise<ZoningData | null> {
    // Check if location is in Michigan
    const inMichigan = this.isInMichigan(lat, lng);
    
    if (!inMichigan) {
      return null;
    }
    
    // Get city
    const city = this.getCityFromCoordinates(lat, lng);
    
    if (!city) {
      // Generic Michigan zoning if we can't identify the city
      return this.getGenericMichiganZoning(lat, lng);
    }
    
    // Return city-specific zoning
    switch (city) {
      case 'Detroit':
        return this.getDetroitZoning(lat, lng);
      case 'Dearborn':
        return this.getDearbornZoning(lat, lng);
      case 'Dearborn Heights':
        return this.getDearbornHeightsZoning(lat, lng);
      case 'Ann Arbor':
        return this.getAnnArborZoning(lat, lng);
      case 'Grand Rapids':
        return this.getGrandRapidsZoning(lat, lng);
      case 'Lansing':
        return this.getLansingZoning(lat, lng);
      default:
        return this.getGenericMichiganZoning(lat, lng);
    }
  }
  
  // Detroit zoning
  private getDetroitZoning(lat: number, lng: number): ZoningData {
    // Downtown Detroit
    if (lat >= 42.32 && lat <= 42.34 && lng >= -83.06 && lng <= -83.03) {
      return {
        district: 'B4',
        description: 'General Business District',
        maxHeight: '80 ft',
        far: 4.0,
        setbacks: {
          front: '0 ft',
          side: '0 ft',
          rear: '10 ft'
        },
        allowedUses: ['Commercial', 'Office', 'Retail', 'Residential', 'Mixed-Use'],
        parkingRequirements: '1 space per 1,000 sq ft',
        source: 'Detroit Zoning Ordinance (Mock)'
      };
    }
    
    // Midtown
    if (lat >= 42.34 && lat <= 42.36 && lng >= -83.07 && lng <= -83.05) {
      return {
        district: 'SD1',
        description: 'Special Development District - Midtown',
        maxHeight: '120 ft',
        far: 5.0,
        setbacks: {
          front: '0 ft',
          side: '0 ft',
          rear: '15 ft'
        },
        allowedUses: ['Mixed-Use', 'Residential', 'Commercial', 'Educational', 'Cultural'],
        parkingRequirements: '1 space per unit or 1,000 sq ft',
        source: 'Detroit Zoning Ordinance (Mock)'
      };
    }
    
    // Residential areas
    return {
      district: 'R1',
      description: 'Single-Family Residential District',
      maxHeight: '35 ft',
      far: 0.5,
      setbacks: {
        front: '20 ft',
        side: '5 ft',
        rear: '30 ft'
      },
      allowedUses: ['Single-Family Residential', 'Religious', 'Educational'],
      parkingRequirements: '2 spaces per dwelling unit',
      source: 'Detroit Zoning Ordinance (Mock)'
    };
  }
  
  // Dearborn zoning
  private getDearbornZoning(lat: number, lng: number): ZoningData {
    // Downtown Dearborn
    if (lat >= 42.32 && lat <= 42.33 && lng >= -83.18 && lng <= -83.16) {
      return {
        district: 'BC',
        description: 'Business Center District',
        maxHeight: '60 ft',
        far: 3.0,
        setbacks: {
          front: '0 ft',
          side: '0 ft',
          rear: '10 ft'
        },
        allowedUses: ['Commercial', 'Office', 'Retail', 'Mixed-Use'],
        parkingRequirements: '1 space per 300 sq ft',
        source: 'Dearborn Zoning Ordinance (Mock)'
      };
    }
    
    // Ford Research & Engineering Campus area
    if (lat >= 42.31 && lat <= 42.32 && lng >= -83.23 && lng <= -83.21) {
      return {
        district: 'IR',
        description: 'Industrial Research District',
        maxHeight: '75 ft',
        far: 2.0,
        setbacks: {
          front: '50 ft',
          side: '30 ft',
          rear: '50 ft'
        },
        allowedUses: ['Research', 'Office', 'Light Manufacturing'],
        parkingRequirements: '1 space per 500 sq ft',
        source: 'Dearborn Zoning Ordinance (Mock)'
      };
    }
    
    // Residential areas
    return {
      district: 'RA',
      description: 'Residential A District',
      maxHeight: '30 ft',
      far: 0.4,
      setbacks: {
        front: '25 ft',
        side: '5 ft',
        rear: '35 ft'
      },
      allowedUses: ['Single-Family Residential'],
      parkingRequirements: '2 spaces per dwelling unit',
      source: 'Dearborn Zoning Ordinance (Mock)'
    };
  }
  
  // Dearborn Heights zoning - with extra detail since you mentioned focusing on this area
  private getDearbornHeightsZoning(lat: number, lng: number): ZoningData {
    // North Dearborn Heights (north of Joy Road)
    if (lat >= 42.35) {
      // Commercial corridor along Telegraph Road
      if (lng >= -83.29 && lng <= -83.27) {
        return {
          district: 'C-2',
          description: 'General Commercial District',
          maxHeight: '45 ft',
          far: 1.5,
          setbacks: {
            front: '10 ft',
            side: '10 ft',
            rear: '20 ft'
          },
          allowedUses: ['Retail', 'Office', 'Restaurant', 'Service', 'Automotive'],
          parkingRequirements: '1 space per 250 sq ft',
          overlays: ['Corridor Improvement'],
          source: 'Dearborn Heights Zoning Ordinance (Mock)'
        };
      }
      
      // Residential areas in north Dearborn Heights
      return {
        district: 'R-1B',
        description: 'Single-Family Residential District',
        maxHeight: '30 ft',
        far: 0.35,
        setbacks: {
          front: '25 ft',
          side: '5 ft',
          rear: '35 ft'
        },
        allowedUses: ['Single-Family Residential'],
        parkingRequirements: '2 spaces per dwelling unit',
        source: 'Dearborn Heights Zoning Ordinance (Mock)'
      };
    }
    
    // Central Dearborn Heights
    if (lat >= 42.33 && lat <= 42.35) {
      // City center near city hall
      if (lng >= -83.28 && lng <= -83.26) {
        return {
          district: 'CBD',
          description: 'Central Business District',
          maxHeight: '50 ft',
          far: 2.0,
          setbacks: {
            front: '5 ft',
            side: '5 ft',
            rear: '15 ft'
          },
          allowedUses: ['Retail', 'Office', 'Civic', 'Mixed-Use', 'Restaurant'],
          parkingRequirements: '1 space per 300 sq ft',
          source: 'Dearborn Heights Zoning Ordinance (Mock)'
        };
      }
      
      // Residential areas in central Dearborn Heights
      return {
        district: 'R-1C',
        description: 'Single-Family Residential District',
        maxHeight: '30 ft',
        far: 0.4,
        setbacks: {
          front: '20 ft',
          side: '5 ft',
          rear: '30 ft'
        },
        allowedUses: ['Single-Family Residential'],
        parkingRequirements: '2 spaces per dwelling unit',
        source: 'Dearborn Heights Zoning Ordinance (Mock)'
      };
    }
    
    // South Dearborn Heights
    // Commercial corridor along Ford Road
    if (lng >= -83.3 && lng <= -83.25 && lat >= 42.315 && lat <= 42.325) {
      return {
        district: 'C-1',
        description: 'Local Business District',
        maxHeight: '35 ft',
        far: 1.0,
        setbacks: {
          front: '15 ft',
          side: '10 ft',
          rear: '20 ft'
        },
        allowedUses: ['Retail', 'Office', 'Personal Service', 'Restaurant'],
        parkingRequirements: '1 space per 200 sq ft',
        source: 'Dearborn Heights Zoning Ordinance (Mock)'
      };
    }
    
    // Default residential for south Dearborn Heights
    return {
      district: 'R-1D',
      description: 'Single-Family Residential District',
      maxHeight: '30 ft',
      far: 0.45,
      setbacks: {
        front: '20 ft',
        side: '5 ft',
        rear: '25 ft'
      },
      allowedUses: ['Single-Family Residential'],
      parkingRequirements: '2 spaces per dwelling unit',
      source: 'Dearborn Heights Zoning Ordinance (Mock)'
    };
  }
  
  // Ann Arbor zoning
  private getAnnArborZoning(lat: number, lng: number): ZoningData {
    // Downtown Ann Arbor
    if (lat >= 42.27 && lat <= 42.29 && lng >= -83.75 && lng <= -83.74) {
      return {
        district: 'D1',
        description: 'Downtown Core District',
        maxHeight: '180 ft',
        far: 6.0,
        setbacks: {
          front: '0 ft',
          side: '0 ft',
          rear: '0 ft'
        },
        allowedUses: ['Mixed-Use', 'Commercial', 'Office', 'Residential', 'Retail'],
        parkingRequirements: 'Varies by use',
        source: 'Ann Arbor Zoning Ordinance (Mock)'
      };
    }
    
    // University of Michigan area
    if (lat >= 42.275 && lat <= 42.285 && lng >= -83.74 && lng <= -83.73) {
      return {
        district: 'PL',
        description: 'Public Land District',
        maxHeight: '120 ft',
        far: 4.0,
        setbacks: {
          front: '10 ft',
          side: '10 ft',
          rear: '10 ft'
        },
        allowedUses: ['Educational', 'Institutional', 'Recreational', 'Cultural'],
        parkingRequirements: 'Determined by Planning Commission',
        source: 'Ann Arbor Zoning Ordinance (Mock)'
      };
    }
    
    // Residential areas
    return {
      district: 'R1A',
      description: 'Single-Family Dwelling District',
      maxHeight: '30 ft',
      far: 0.35,
      setbacks: {
        front: '40 ft',
        side: '8 ft',
        rear: '30 ft'
      },
      allowedUses: ['Single-Family Residential'],
      parkingRequirements: '2 spaces per dwelling unit',
      source: 'Ann Arbor Zoning Ordinance (Mock)'
    };
  }
  
  // Grand Rapids zoning
  private getGrandRapidsZoning(lat: number, lng: number): ZoningData {
    // Downtown Grand Rapids
    if (lat >= 42.96 && lat <= 42.98 && lng >= -85.68 && lng <= -85.66) {
      return {
        district: 'TN-CC',
        description: 'Traditional Neighborhood - City Center',
        maxHeight: '160 ft',
        far: 5.0,
        setbacks: {
          front: '0 ft',
          side: '0 ft',
          rear: '10 ft'
        },
        allowedUses: ['Mixed-Use', 'Commercial', 'Office', 'Residential', 'Entertainment'],
        parkingRequirements: '1 space per 1,000 sq ft',
        source: 'Grand Rapids Zoning Ordinance (Mock)'
      };
    }
    
    // Medical Mile
    if (lat >= 42.97 && lat <= 42.98 && lng >= -85.66 && lng <= -85.65) {
      return {
        district: 'IC',
        description: 'Institutional Campus',
        maxHeight: '150 ft',
        far: 4.0,
        setbacks: {
          front: '10 ft',
          side: '10 ft',
          rear: '20 ft'
        },
        allowedUses: ['Medical', 'Research', 'Educational', 'Office'],
        parkingRequirements: '1 space per 500 sq ft',
        source: 'Grand Rapids Zoning Ordinance (Mock)'
      };
    }
    
    // Residential areas
    return {
      district: 'LDR',
      description: 'Low Density Residential',
      maxHeight: '35 ft',
      far: 0.4,
      setbacks: {
        front: '25 ft',
        side: '7 ft',
        rear: '25 ft'
      },
      allowedUses: ['Single-Family Residential', 'Two-Family Residential'],
      parkingRequirements: '2 spaces per dwelling unit',
      source: 'Grand Rapids Zoning Ordinance (Mock)'
    };
  }
  
  // Lansing zoning
  private getLansingZoning(lat: number, lng: number): ZoningData {
    // Downtown Lansing
    if (lat >= 42.73 && lat <= 42.74 && lng >= -84.56 && lng <= -84.55) {
      return {
        district: 'F-1',
        description: 'Commercial District',
        maxHeight: '100 ft',
        far: 4.0,
        setbacks: {
          front: '0 ft',
          side: '0 ft',
          rear: '10 ft'
        },
        allowedUses: ['Office', 'Commercial', 'Retail', 'Restaurant', 'Entertainment'],
        parkingRequirements: '1 space per 500 sq ft',
        source: 'Lansing Zoning Ordinance (Mock)'
      };
    }
    
    // Capitol Complex
    if (lat >= 42.733 && lat <= 42.738 && lng >= -84.56 && lng <= -84.55) {
      return {
        district: 'G-1',
        description: 'Governmental District',
        maxHeight: '150 ft',
        far: 5.0,
        setbacks: {
          front: '10 ft',
          side: '10 ft',
          rear: '20 ft'
        },
        allowedUses: ['Governmental', 'Office', 'Institutional'],
        parkingRequirements: '1 space per 500 sq ft',
        source: 'Lansing Zoning Ordinance (Mock)'
      };
    }
    
    // Residential areas
    return {
      district: 'A',
      description: 'Residential District',
      maxHeight: '35 ft',
      far: 0.5,
      setbacks: {
        front: '25 ft',
        side: '8 ft',
        rear: '30 ft'
      },
      allowedUses: ['Single-Family Residential'],
      parkingRequirements: '2 spaces per dwelling unit',
      source: 'Lansing Zoning Ordinance (Mock)'
    };
  }
  
  // Generic Michigan zoning for other areas
  private getGenericMichiganZoning(lat: number, lng: number): ZoningData {
    // Generate a deterministic but seemingly random district based on coordinates
    const seed = Math.abs(Math.floor((lat * 1000 + lng * 1000) % 5));
    
    const districts = ['R-1', 'R-2', 'C-1', 'C-2', 'I-1'];
    const descriptions = [
      'Single-Family Residential District',
      'Multiple-Family Residential District',
      'Local Business District',
      'General Business District',
      'Light Industrial District'
    ];
    const heights = ['35 ft', '45 ft', '40 ft', '50 ft', '60 ft'];
    const fars = [0.4, 0.6, 1.0, 2.0, 1.5];
    const uses = [
      ['Single-Family Residential'],
      ['Multiple-Family Residential', 'Townhouses', 'Duplexes'],
      ['Retail', 'Office', 'Personal Service'],
      ['Commercial', 'Retail', 'Office', 'Restaurant', 'Entertainment'],
      ['Light Manufacturing', 'Warehouse', 'Research', 'Office']
    ];
    
    return {
      district: districts[seed],
      description: descriptions[seed],
      maxHeight: heights[seed],
      far: fars[seed],
      setbacks: {
        front: '25 ft',
        side: '8 ft',
        rear: '30 ft'
      },
      allowedUses: uses[seed],
      parkingRequirements: seed < 2 ? '2 spaces per dwelling unit' : '1 space per 300 sq ft',
      source: 'Michigan Zoning (Mock)'
    };
  }
}

// Generic mock provider for non-Michigan locations
export class GenericZoningProvider {
  async getZoningData(lat: number, lng: number): Promise<ZoningData> {
    // Generate deterministic mock data based on coordinates
    const seed = Math.floor((lat * 1000 + lng * 1000) % 5);
    
    const districts = ['R6', 'C2', 'M1', 'B3', 'D4'];
    const descriptions = [
      'Medium-density residential district',
      'General commercial district',
      'Light manufacturing district',
      'Central business district',
      'Downtown mixed-use district'
    ];
    const heights = ['120 ft', '80 ft', '60 ft', '200 ft', '150 ft'];
    const fars = [3.0, 6.0, 5.0, 10.0, 8.0];
    const uses = [
      ['Residential', 'Community Facility'],
      ['Commercial', 'Residential', 'Mixed-Use'],
      ['Manufacturing', 'Commercial', 'Industrial'],
      ['Office', 'Retail', 'Residential', 'Hotel'],
      ['Residential', 'Office', 'Retail', 'Entertainment']
    ];
    
    return {
      district: districts[seed],
      description: descriptions[seed],
      maxHeight: heights[seed],
      far: fars[seed],
      setbacks: {
        front: '10 ft',
        side: '5 ft',
        rear: '30 ft'
      },
      allowedUses: uses[seed],
      parkingRequirements: '0.5 spaces per dwelling unit',
      source: 'Mock Data'
    };
  }
}

// Main Zoning Service class
export class ZoningService {
  private michiganProvider: MichiganZoningProvider;
  private genericProvider: GenericZoningProvider;
  
  constructor() {
    this.michiganProvider = new MichiganZoningProvider();
    this.genericProvider = new GenericZoningProvider();
  }
  
  async getZoningData(lat: number, lng: number): Promise<ZoningData> {
    try {
      // Try Michigan provider first
      const michiganData = await this.michiganProvider.getZoningData(lat, lng);
      
      if (michiganData) {
        console.log('Got Michigan zoning data');
        return michiganData;
      }
      
      // Fall back to generic provider
      console.log('Using generic zoning data');
      return await this.genericProvider.getZoningData(lat, lng);
    } catch (error) {
      console.error('Error in ZoningService:', error);
      // Return generic data as fallback
      return this.genericProvider.getZoningData(lat, lng);
    }
  }
}

export default new ZoningService(); 