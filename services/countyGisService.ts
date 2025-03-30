import axios from 'axios';
import { ZoningData } from './zoningService';

interface CountyGisConfig {
  county: string;
  apiUrl: string;
  zoningLayerId: string;
  parcelLayerId: string;
  requiresApiKey: boolean;
}

// Configuration for Michigan counties with GIS services
const michiganCountyGisConfigs: Record<string, CountyGisConfig> = {
  'wayne': {
    county: 'Wayne',
    apiUrl: 'https://services2.arcgis.com/qvkbeam7Wirps6zC/ArcGIS/rest/services',
    zoningLayerId: 'Zoning/FeatureServer/0',
    parcelLayerId: 'Parcels/FeatureServer/0',
    requiresApiKey: false
  },
  'oakland': {
    county: 'Oakland',
    apiUrl: 'https://gis.oakgov.com/arcgis/rest/services',
    zoningLayerId: 'OaklandCounty/Zoning/MapServer/0',
    parcelLayerId: 'OaklandCounty/Parcels/MapServer/0',
    requiresApiKey: false
  },
  'washtenaw': {
    county: 'Washtenaw',
    apiUrl: 'https://gisappsecure.ewashtenaw.org/arcgis/rest/services',
    zoningLayerId: 'Zoning/MapServer/0',
    parcelLayerId: 'Parcels/MapServer/0',
    requiresApiKey: false
  },
  // Add more counties as needed
};

export class CountyGisService {
  // Determine which county a coordinate falls within
  async getCountyForCoordinates(lat: number, lng: number): Promise<string | null> {
    try {
      // This could use a polygon lookup service or a simple bounding box check
      // For now, we'll use a simplified approach based on coordinates
      
      // Wayne County (Detroit area)
      if (lat >= 42.1 && lat <= 42.5 && lng >= -83.5 && lng <= -82.9) {
        return 'wayne';
      }
      
      // Oakland County
      if (lat >= 42.4 && lat <= 42.9 && lng >= -83.7 && lng <= -83.1) {
        return 'oakland';
      }
      
      // Washtenaw County (Ann Arbor area)
      if (lat >= 42.1 && lat <= 42.6 && lng >= -84.2 && lng <= -83.6) {
        return 'washtenaw';
      }
      
      return null;
    } catch (error) {
      console.error('Error determining county:', error);
      return null;
    }
  }
  
  // Get zoning data from county GIS
  async getZoningData(lat: number, lng: number): Promise<ZoningData | null> {
    try {
      // Determine which county the coordinates are in
      const countyId = await this.getCountyForCoordinates(lat, lng);
      
      if (!countyId || !michiganCountyGisConfigs[countyId]) {
        return null;
      }
      
      const countyConfig = michiganCountyGisConfigs[countyId];
      
      // Query the county GIS service to get the parcel and zoning information
      const parcelData = await this.queryGisLayer(
        countyConfig.apiUrl,
        countyConfig.parcelLayerId,
        lat,
        lng
      );
      
      if (!parcelData || !parcelData.features || parcelData.features.length === 0) {
        return null;
      }
      
      // Get the parcel ID or other identifier
      const parcelId = parcelData.features[0].attributes.PARCEL_ID;
      
      // Use the parcel ID to get zoning information
      const zoningData = await this.queryGisLayerByAttribute(
        countyConfig.apiUrl,
        countyConfig.zoningLayerId,
        'PARCEL_ID',
        parcelId
      );
      
      if (!zoningData || !zoningData.features || zoningData.features.length === 0) {
        return null;
      }
      
      // Extract zoning information from the response
      const zoning = zoningData.features[0].attributes;
      
      // Transform the county-specific zoning data to our standard format
      return this.transformCountyZoningData(countyId, zoning);
    } catch (error) {
      console.error('Error fetching county GIS data:', error);
      return null;
    }
  }
  
  // Query a GIS layer by location
  private async queryGisLayer(apiUrl: string, layerId: string, lat: number, lng: number) {
    const url = `${apiUrl}/${layerId}/query`;
    
    const params = {
      geometry: `${lng},${lat}`,
      geometryType: 'esriGeometryPoint',
      inSR: '4326',
      outSR: '4326',
      spatialRel: 'esriSpatialRelIntersects',
      outFields: '*',
      returnGeometry: false,
      f: 'json'
    };
    
    const response = await axios.get(url, { params });
    return response.data;
  }
  
  // Query a GIS layer by attribute
  private async queryGisLayerByAttribute(apiUrl: string, layerId: string, field: string, value: string) {
    const url = `${apiUrl}/${layerId}/query`;
    
    const params = {
      where: `${field}='${value}'`,
      outFields: '*',
      returnGeometry: false,
      f: 'json'
    };
    
    const response = await axios.get(url, { params });
    return response.data;
  }
  
  // Transform county-specific zoning data to our standard format
  private transformCountyZoningData(countyId: string, zoningData: any): ZoningData {
    // Each county has different field names and data structures
    switch (countyId) {
      case 'wayne':
        // Try multiple possible field names for setbacks
        const frontSetback = zoningData.FRONT_SETBACK || zoningData.FRONT_YARD || zoningData.MIN_FRONT_SETBACK;
        const sideSetback = zoningData.SIDE_SETBACK || zoningData.SIDE_YARD || zoningData.MIN_SIDE_SETBACK;
        const rearSetback = zoningData.REAR_SETBACK || zoningData.REAR_YARD || zoningData.MIN_REAR_SETBACK;
        
        return {
          district: zoningData.ZONING_CODE || 'Unknown',
          description: zoningData.ZONING_DESC || 'Wayne County Zoning',
          maxHeight: zoningData.MAX_HEIGHT ? `${zoningData.MAX_HEIGHT} ft` : '35 ft',
          far: zoningData.FAR || 1.0,
          setbacks: {
            front: frontSetback ? `${frontSetback} ft` : '25 ft',
            side: sideSetback ? `${sideSetback} ft` : '10 ft',
            rear: rearSetback ? `${rearSetback} ft` : '30 ft'
          },
          allowedUses: zoningData.ALLOWED_USES ? zoningData.ALLOWED_USES.split(',') : ['Residential'],
          source: 'Wayne County GIS'
        };
        
      case 'oakland':
        return {
          district: zoningData.ZONING_DISTRICT || 'Unknown',
          description: zoningData.DESCRIPTION || 'Oakland County Zoning',
          maxHeight: zoningData.HEIGHT_LIMIT ? `${zoningData.HEIGHT_LIMIT} ft` : '35 ft',
          far: zoningData.FLOOR_AREA_RATIO || 1.0,
          setbacks: {
            front: zoningData.FRONT_YARD_SETBACK ? `${zoningData.FRONT_YARD_SETBACK} ft` : '25 ft',
            side: zoningData.SIDE_YARD_SETBACK ? `${zoningData.SIDE_YARD_SETBACK} ft` : '10 ft',
            rear: zoningData.REAR_YARD_SETBACK ? `${zoningData.REAR_YARD_SETBACK} ft` : '30 ft'
          },
          allowedUses: zoningData.PERMITTED_USES ? zoningData.PERMITTED_USES.split(',') : ['Residential'],
          source: 'Oakland County GIS'
        };
        
      // Add more county transformations as needed
      
      default:
        // Generic transformation for other counties
        return {
          district: zoningData.ZONING || zoningData.ZONE_CODE || 'Unknown',
          description: zoningData.DESCRIPTION || 'Michigan County Zoning',
          maxHeight: '35 ft', // Default if not provided
          far: 1.0, // Default if not provided
          setbacks: {
            front: '25 ft', // Default if not provided
            side: '10 ft', // Default if not provided
            rear: '30 ft' // Default if not provided
          },
          allowedUses: ['Residential'], // Default if not provided
          source: `${michiganCountyGisConfigs[countyId]?.county || 'Michigan'} County GIS`
        };
    }
  }
}

export default new CountyGisService(); 