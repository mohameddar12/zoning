
    # Detroit Surface Segmentation Annotation Guidelines
    
    ## Classes to Annotate
    
    1. **Buildings** - Any man-made structure with a roof
       - Include: houses, commercial buildings, sheds, garages, industrial facilities
       - Exclude: construction sites without roofs
       - Note: Detroit has many abandoned structures - these should still be labeled as buildings
    
    2. **Pavement** - Impermeable surfaces used for transportation or parking
       - Include: roads, driveways, parking lots, sidewalks, concrete pads
       - Exclude: gravel roads (mark as soil)
       - Note: Detroit has many vacant lots with remnants of foundations - these should be labeled as pavement
    
    3. **Vegetation** - Areas with plant growth
       - Include: trees, grass, shrubs, urban gardens, parks
       - Exclude: dead vegetation (mark as soil)
       - Note: Detroit has significant urban prairie and regrowth in vacant areas - these should be labeled as vegetation
    
    4. **Soil** - Exposed earth without significant vegetation
       - Include: dirt, sand, gravel, bare lots
       - Exclude: areas with >20% vegetation cover
    
    5. **Water** - Any visible water body
       - Include: Detroit River, lakes, ponds, swimming pools
       - Exclude: areas where water is not visible (e.g., under tree canopy)
    
    ## Detroit-Specific Annotation Tips
    
    - Urban agriculture is common in Detroit - mark these as vegetation
    - Many lots have demolished buildings with remaining foundations - mark these as pavement
    - Detroit has many tree-lined streets - be careful to distinguish between tree canopy and the pavement beneath
    - Industrial areas may have large impermeable surfaces - mark these as pavement unless they are clearly buildings
    
    ## Quality Control
    
    - Zoom in to ensure accurate boundaries
    - Check that all areas of the image are classified
    - Review your work before submission
    