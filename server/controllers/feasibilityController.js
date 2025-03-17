exports.calculateCosts = async (req, res) => {
  try {
    const { 
      buildingSize, 
      qualityLevel, 
      location, 
      buildingType 
    } = req.body;
    
    if (!buildingSize || qualityLevel === undefined) {
      return res.status(400).json({ 
        error: 'Please provide buildingSize and qualityLevel' 
      });
    }
    
    // In a real app, we would use construction cost databases
    // For now, we'll calculate based on simple formulas
    
    // Base cost per square foot based on quality level (0-3)
    const qualityLevels = [
      "Basic (Code minimum)",
      "Standard (Market rate)",
      "Premium (High-end finishes)",
      "Luxury (Custom details)"
    ];
    
    const baseCostPerSqFt = 250 + (qualityLevel * 50);
    
    // Location multiplier (would be from a database in a real app)
    const locationMultiplier = location === 'New York' ? 1.5 : 
                              location === 'San Francisco' ? 1.7 : 
                              location === 'Chicago' ? 1.2 : 1.0;
    
    // Building type multiplier
    const typeMultiplier = buildingType === 'Residential' ? 1.0 :
                          buildingType === 'Commercial' ? 1.2 :
                          buildingType === 'Mixed-Use' ? 1.15 : 1.0;
    
    // Calculate costs
    const adjustedCostPerSqFt = baseCostPerSqFt * locationMultiplier * typeMultiplier;
    const totalConstructionCost = buildingSize * adjustedCostPerSqFt;
    const softCosts = totalConstructionCost * 0.25; // 25% for soft costs
    const contingency = totalConstructionCost * 0.1; // 10% contingency
    const totalProjectCost = totalConstructionCost + softCosts + contingency;
    
    // Calculate financial metrics
    const estimatedAnnualRevenue = buildingType === 'Residential' ? 
                                  buildingSize * 30 * locationMultiplier : // $30/sqft/year
                                  buildingSize * 45 * locationMultiplier;  // $45/sqft/year
    
    const annualOperatingCosts = estimatedAnnualRevenue * 0.35; // 35% of revenue
    const netOperatingIncome = estimatedAnnualRevenue - annualOperatingCosts;
    const capRate = 0.05; // 5% cap rate
    const propertyValue = netOperatingIncome / capRate;
    
    const roi = (netOperatingIncome / totalProjectCost) * 100;
    const paybackPeriod = totalProjectCost / netOperatingIncome;
    
    const result = {
      inputs: {
        buildingSize,
        qualityLevel: qualityLevels[qualityLevel],
        location: location || 'National Average',
        buildingType: buildingType || 'Residential'
      },
      costs: {
        baseCostPerSqFt,
        adjustedCostPerSqFt,
        totalConstructionCost,
        softCosts,
        contingency,
        totalProjectCost
      },
      financials: {
        estimatedAnnualRevenue,
        annualOperatingCosts,
        netOperatingIncome,
        propertyValue,
        roi,
        paybackPeriod
      },
      scenarios: {
        base: {
          totalCost: totalProjectCost,
          roi: roi,
          paybackPeriod: paybackPeriod
        },
        optimistic: {
          totalCost: totalProjectCost * 0.95,
          roi: roi * 1.2,
          paybackPeriod: paybackPeriod * 0.85
        },
        conservative: {
          totalCost: totalProjectCost * 1.1,
          roi: roi * 0.8,
          paybackPeriod: paybackPeriod * 1.25
        }
      }
    };
    
    res.status(200).json({ success: true, data: result });
    
  } catch (error) {
    console.error('Error in calculateCosts:', error);
    res.status(500).json({ 
      error: 'Server error', 
      message: error.message 
    });
  }
};

exports.getCostIndices = async (req, res) => {
  try {
    // In a real app, we would fetch this from a database
    // For now, we'll return mock data
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const costIndices = {
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
        { city: 'San Francisco', index: 1.7, trend: '+4.1% YoY' },
        { city: 'Denver', index: 1.15, trend: '+3.0% YoY' },
        { city: 'Seattle', index: 1.25, trend: '+3.5% YoY' }
      ]
    };
    
    res.status(200).json({ success: true, data: costIndices });
    
  } catch (error) {
    console.error('Error in getCostIndices:', error);
    res.status(500).json({ 
      error: 'Server error', 
      message: error.message 
    });
  }
}; 