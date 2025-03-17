import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Site API
export const searchSite = async (query: string) => {
  const response = await api.get(`/sites/search?address=${encodeURIComponent(query)}`);
  return response.data;
};

export const getSiteById = async (siteId: string) => {
  const response = await api.get(`/sites/${siteId}`);
  return response.data;
};

// Zoning API
export const getZoningInfo = async (lat: number, lng: number) => {
  const response = await api.get(`/zoning/info?lat=${lat}&lng=${lng}`);
  return response.data;
};

export const getZoningRegulations = async (zoneId: string) => {
  const response = await api.get(`/zoning/regulations/${zoneId}`);
  return response.data;
};

// Environmental API
export const getClimateData = async (lat: number, lng: number) => {
  const response = await api.get(`/environmental/climate?lat=${lat}&lng=${lng}`);
  return response.data;
};

export const getSolarAnalysis = async (lat: number, lng: number) => {
  const response = await api.get(`/environmental/solar?lat=${lat}&lng=${lng}`);
  return response.data;
};

export const getFloodRiskData = async (lat: number, lng: number) => {
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
  const response = await api.post('/feasibility/calculate-costs', data);
  return response.data;
};

export const getCostIndices = async () => {
  const response = await api.get('/feasibility/cost-indices');
  return response.data;
};

export default api; 