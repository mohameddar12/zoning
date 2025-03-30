exports.getZoningInfo = async (req, res) => {
  try {
    const { lat, lng, address } = req.query;
    
    if (!lat || !lng) {
      return res.status(400).json({ 
        error: 'Please provide coordinates (lat & lng)' 
      });
    }
    
    // In a real app, we would query a zoning database or API
    // For now, we'll return mock data
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const zoningData = {
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
      parkingRequirements: '0.5 spaces per dwelling unit',
      coordinates: {
        lat: parseFloat(lat),
        lng: parseFloat(lng)
      }
    };
    
    res.status(200).json({ success: true, data: zoningData });
    
  } catch (error) {
    console.error('Error in getZoningInfo:', error);
    res.status(500).json({ 
      error: 'Server error', 
      message: error.message 
    });
  }
};

exports.getZoningRegulations = async (req, res) => {
  try {
    const { zoneId } = req.params;
    
    // In a real app, we would fetch specific regulations for the zone
    // For now, we'll return mock data
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const regulations = {
      id: zoneId,
      name: 'R6 - Medium-density residential district',
      generalProvisions: [
        'Buildings may be built as either Quality Housing buildings or under height factor regulations',
        'Community facilities are permitted as-of-right',
        'Commercial uses are not permitted'
      ],
      heightAndBulk: {
        maxFAR: 3.0,
        maxHeight: '120 ft',
        skyExposurePlane: '60 ft above street line, then 2.7 to 1 slope'
      },
      setbacks: {
        front: '10 ft minimum',
        side: '5 ft minimum',
        rear: '30 ft minimum'
      },
      parkingRequirements: '0.5 spaces per dwelling unit, waived if 5 or fewer spaces required'
    };
    
    res.status(200).json({ success: true, data: regulations });
    
  } catch (error) {
    console.error('Error in getZoningRegulations:', error);
    res.status(500).json({ 
      error: 'Server error', 
      message: error.message 
    });
  }
}; 