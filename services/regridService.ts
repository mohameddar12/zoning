import axios from 'axios';
import { ZoningData } from './zoningService';

interface RegridParcel {
  id: string;
  properties: {
    id: string;
    address: string;
    zoning_code?: string;
    zoning_description?: string;
    zoning?: {
      code?: string;
      description?: string;
      setbacks?: {
        front?: number;
        side?: number;
        rear?: number;
      };
      height_limit?: number;
      far?: number;
      allowed_uses?: string[];
    };
    [key: string]: any;
  };
  geometry: any;
}

interface RegridResponse {
  type: string;
  features: RegridParcel[];
  parcels?: {
    type: string;
    features: any[];
  };
  buildings?: {
    type: string;
    features: any[];
  };
  zoning?: {
    type: string;
    features: any[];
  };
}

class RegridService {
  private apiKey: string;
  private baseUrl: string;
  private isEnabled: boolean = true;

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_REGRID_API_KEY || '';
    this.baseUrl = 'https://app.regrid.com/api/v2'; // This is the correct base URL from the docs
    
    if (this.apiKey) {
      console.log(`Regrid API key loaded: ${this.apiKey.substring(0, 10)}...`);
    } else {
      console.warn('No Regrid API key found in environment variables');
      this.isEnabled = false;
    }
  }

  async getParcelData(lat: number, lng: number): Promise<RegridParcel | null> {
    if (!this.isEnabled) {
      console.log('Regrid service is disabled');
      return null;
    }
    
    try {
      // Ensure we're using full precision by converting to string with 6 decimal places
      const preciseLatStr = lat.toFixed(6);
      const preciseLngStr = lng.toFixed(6);
      const preciseLat = parseFloat(preciseLatStr);
      const preciseLng = parseFloat(preciseLngStr);
      
      console.log(`Fetching Regrid data for coordinates: ${preciseLat}, ${preciseLng}`);
      
      // Use the correct endpoint from the documentation
      const url = `${this.baseUrl}/parcels/point`;
      console.log(`Regrid API URL: ${url}`);
      
      const response = await axios.get<RegridResponse>(url, {
        params: {
          token: this.apiKey,
          lat: preciseLat,
          lon: preciseLng,
          returnZoning: true,
          returnGeometry: true,
          radius: 10 // Small radius in meters to increase chances of finding a parcel
        }
      });

      console.log('Regrid API response status:', response.status);
      
      // Check if we got any features in the response
      if (response.data.features && response.data.features.length > 0) {
        console.log(`Found ${response.data.features.length} parcels`);
        return response.data.features[0];
      }
      
      // Check if we have nested parcels structure
      if (response.data.parcels && response.data.parcels.features && 
          response.data.parcels.features.length > 0) {
        console.log(`Found ${response.data.parcels.features.length} parcels in nested structure`);
        return response.data.parcels.features[0];
      }
      
      console.log('No parcels found in response');
      return null;
      
    } catch (error) {
      console.error('Error fetching parcel data from Regrid:', error);
      
      if (axios.isAxiosError(error)) {
        console.error('Axios error details:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data
        });
      }
      
      return null;
    }
  }

  async getZoningData(lat: number, lng: number): Promise<ZoningData | null> {
    try {
      const parcel = await this.getParcelData(lat, lng);
      
      if (!parcel || !parcel.properties) {
        console.log('No parcel data available');
        return null;
      }
      
      // Prioritize the structured zoning object as recommended
      if (parcel.properties.zoning) {
        const zoning = parcel.properties.zoning;
        console.log('Found structured zoning property:', zoning);
        
        return {
          district: zoning.code || 'Unknown',
          description: zoning.description || 'Zoning from Regrid',
          maxHeight: zoning.height_limit ? `${zoning.height_limit} ft` : '35 ft',
          far: zoning.far || 1.0,
          setbacks: {
            front: zoning.setbacks?.front ? `${zoning.setbacks.front} ft` : '25 ft',
            side: zoning.setbacks?.side ? `${zoning.setbacks.side} ft` : '10 ft',
            rear: zoning.setbacks?.rear ? `${zoning.setbacks.rear} ft` : '30 ft'
          },
          allowedUses: zoning.allowed_uses || ['Residential'],
          source: 'Regrid API'
        };
      }
      
      // Fall back to direct property fields if structured zoning is not available
      const zoningCode = parcel.properties.zoning_code || 
                         parcel.properties.zone_code || 
                         parcel.properties.zoning_district;
      
      if (zoningCode) {
        console.log(`Found zoning code: ${zoningCode}`);
        
        // For Detroit addresses, we can provide more accurate setbacks based on zoning code
        if (zoningCode === 'B4' || zoningCode.startsWith('R4')) {
          return {
            district: zoningCode,
            description: parcel.properties.zoning_description || 'Detroit Zoning',
            maxHeight: '60 ft',
            far: 4.0,
            setbacks: {
              front: '0 ft',
              side: '0 ft',
              rear: '10 ft'
            },
            allowedUses: ['Commercial', 'Office', 'Retail', 'Residential', 'Mixed-Use'],
            source: 'Regrid API + Detroit Zoning Ordinance'
          };
        }
        
        // Generic zoning data based on the code
        return {
          district: zoningCode,
          description: parcel.properties.zoning_description || 'Zoning information from Regrid',
          maxHeight: parcel.properties.height_limit ? `${parcel.properties.height_limit} ft` : '35 ft',
          far: parcel.properties.far || parcel.properties.floor_area_ratio || 1.0,
          setbacks: {
            front: parcel.properties.front_setback ? `${parcel.properties.front_setback} ft` : '25 ft',
            side: parcel.properties.side_setback ? `${parcel.properties.side_setback} ft` : '10 ft',
            rear: parcel.properties.rear_setback ? `${parcel.properties.rear_setback} ft` : '30 ft'
          },
          allowedUses: parcel.properties.allowed_uses ? 
                      (Array.isArray(parcel.properties.allowed_uses) ? 
                       parcel.properties.allowed_uses : 
                       [parcel.properties.allowed_uses]) : 
                      ['Residential'],
          source: 'Regrid API'
        };
      }
      
      console.log('No zoning data available for this parcel');
      return null;
    } catch (error) {
      console.error('Error transforming Regrid data:', error);
      return null;
    }
  }
  
  // Updated to use the correct endpoint as per the API spec
  async searchByAddress(address: string): Promise<RegridParcel | null> {
    if (!this.isEnabled) {
      return null;
    }
    
    try {
      console.log(`Searching Regrid for address: ${address}`);
      
      // Use the correct parcels/address endpoint from the documentation
      const url = `${this.baseUrl}/parcels/address`;
      
      const response = await axios.get<RegridResponse>(url, {
        params: {
          token: this.apiKey,
          query: address,  // This is the correct parameter name for the address
          limit: 1,
          returnZoning: true,
          returnGeometry: true
        }
      });
      
      if (response.data.features && response.data.features.length > 0) {
        console.log(`Found parcel for address: ${address}`);
        return response.data.features[0];
      }
      
      console.log(`No parcels found for address: ${address}`);
      return null;
    } catch (error) {
      console.error('Error searching Regrid by address:', error);
      return null;
    }
  }
}

export default new RegridService(); 