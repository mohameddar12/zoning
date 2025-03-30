exports.getClimateData = async (req, res) => {
  try {
    const { lat, lng } = req.query;
    
    if (!lat || !lng) {
      return res.status(400).json({ 
        error: 'Please provide coordinates (lat & lng)' 
      });
    }
    
    // In a real app, we would call a climate data API
    // For now, we'll return mock data
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 700));
    
    const climateData = {
      climate: 'Humid subtropical',
      climateZone: 'ASHRAE 4A',
      annualSunHours: 2535,
      annualPrecipitation: 49.9, // inches
      averageTemperatures: {
        annual: 55.7, // °F
        summer: 76.5,
        winter: 35.2
      },
      prevailingWinds: 'SW',
      heatingDegreeDays: 4750,
      coolingDegreeDays: 1289
    };
    
    res.status(200).json({ success: true, data: climateData });
    
  } catch (error) {
    console.error('Error in getClimateData:', error);
    res.status(500).json({ 
      error: 'Server error', 
      message: error.message 
    });
  }
};

exports.getSolarAnalysis = async (req, res) => {
  try {
    const { lat, lng } = req.query;
    
    if (!lat || !lng) {
      return res.status(400).json({ 
        error: 'Please provide coordinates (lat & lng)' 
      });
    }
    
    // In a real app, we would call a solar analysis API
    // For now, we'll return mock data
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 900));
    
    const solarData = {
      solarExposure: 75, // percentage
      annualSolarRadiation: 4.2, // kWh/m²/day
      optimalRoofAngle: 35, // degrees
      solsticeData: {
        summer: {
          sunriseTime: '05:25',
          sunsetTime: '20:31',
          daylightHours: 14.8,
          noonSunAngle: 73 // degrees
        },
        winter: {
          sunriseTime: '07:16',
          sunsetTime: '16:32',
          daylightHours: 9.2,
          noonSunAngle: 26 // degrees
        }
      },
      pvPotential: {
        annualProduction: 1350, // kWh/kW installed
        optimalOrientation: 'South',
        paybackPeriod: 8.5 // years
      }
    };
    
    res.status(200).json({ success: true, data: solarData });
    
  } catch (error) {
    console.error('Error in getSolarAnalysis:', error);
    res.status(500).json({ 
      error: 'Server error', 
      message: error.message 
    });
  }
};

exports.getFloodRiskData = async (req, res) => {
  try {
    const { lat, lng } = req.query;
    
    if (!lat || !lng) {
      return res.status(400).json({ 
        error: 'Please provide coordinates (lat & lng)' 
      });
    }
    
    // In a real app, we would call a flood risk API
    // For now, we'll return mock data
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const floodData = {
      floodZone: 'Zone X',
      floodZoneDescription: 'Area of minimal flood hazard',
      baseFloodElevation: null, // feet above sea level
      annualFloodRisk: 0.2, // percentage
      historicalFlooding: {
        events: 2,
        lastEvent: '2012-10-29', // Hurricane Sandy
        maxRecordedDepth: 0.5 // feet
      },
      seaLevelRiseImpact: {
        current: 'None',
        by2050: 'Minimal',
        by2100: 'Moderate'
      },
      recommendedActions: [
        'Standard stormwater management practices',
        'Consider raised electrical systems',
        'Implement permeable surfaces to reduce runoff'
      ]
    };
    
    res.status(200).json({ success: true, data: floodData });
    
  } catch (error) {
    console.error('Error in getFloodRiskData:', error);
    res.status(500).json({ 
      error: 'Server error', 
      message: error.message 
    });
  }
}; 