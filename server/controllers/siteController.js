const axios = require('axios');

// Mock database for development
const sitesDb = {};

exports.searchSite = async (req, res) => {
  try {
    const { address, lat, lng } = req.query;
    
    if (!address && (!lat || !lng)) {
      return res.status(400).json({ 
        error: 'Please provide either an address or coordinates (lat & lng)' 
      });
    }
    
    // In a real app, we would call a geocoding API like Google Maps or Mapbox
    // For now, we'll simulate the response
    
    let siteData;
    const siteId = address ? 
      Buffer.from(address).toString('base64') : 
      `${lat},${lng}`;
    
    // Check if we already have this site in our "database"
    if (sitesDb[siteId]) {
      siteData = sitesDb[siteId];
    } else {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create mock site data
      siteData = {
        id: siteId,
        address: address || `Lat: ${lat}, Lng: ${lng}`,
        coordinates: {
          lat: lat || 40.7128,
          lng: lng || -74.0060
        },
        createdAt: new Date().toISOString()
      };
      
      // Save to our "database"
      sitesDb[siteId] = siteData;
    }
    
    res.status(200).json({ success: true, data: siteData });
    
  } catch (error) {
    console.error('Error in searchSite:', error);
    res.status(500).json({ 
      error: 'Server error', 
      message: error.message 
    });
  }
};

exports.getSiteById = async (req, res) => {
  try {
    const { siteId } = req.params;
    
    // Check if site exists in our "database"
    if (!sitesDb[siteId]) {
      return res.status(404).json({ 
        error: 'Site not found' 
      });
    }
    
    // Get basic site data
    const siteData = sitesDb[siteId];
    
    // In a real app, we would fetch additional data from various services
    // For now, we'll add mock data
    
    const fullSiteData = {
      ...siteData,
      zoning: {
        district: 'R6',
        maxHeight: '120 ft',
        far: 3.0,
        setbacks: { front: '10 ft', side: '5 ft', rear: '30 ft' },
        allowedUses: ['Residential', 'Community Facility'],
      },
      environmental: {
        climate: 'Humid subtropical',
        annualSunHours: 2535,
        prevailingWinds: 'SW',
        floodZone: 'Zone X',
        soilType: 'Sandy loam',
      },
      recommendations: [
        'Optimize building orientation for solar gain',
        'Consider setback requirements for outdoor spaces',
        'Explore mixed-use development options',
        'Implement rainwater harvesting systems'
      ]
    };
    
    res.status(200).json({ success: true, data: fullSiteData });
    
  } catch (error) {
    console.error('Error in getSiteById:', error);
    res.status(500).json({ 
      error: 'Server error', 
      message: error.message 
    });
  }
}; 