import ee
import geojson
import os
import time

# Initialize Earth Engine with Python authentication
# Replace the ee.Initialize() line with:
try:
    ee.Initialize()
except Exception:
    # If authentication fails, use the Python authentication method
    ee.Authenticate()
    ee.Initialize()

# Rest of your script remains the same
def load_detroit_boundaries():
    regions = []
    boundaries_dir = "boundaries"
    
    for filename in os.listdir(boundaries_dir):
        if filename.endswith(".geojson"):
            region_name = filename.split(".")[0]
            with open(os.path.join(boundaries_dir, filename)) as f:
                geojson_data = geojson.load(f)
                
                # Convert GeoJSON to Earth Engine geometry
                coords = geojson_data['features'][0]['geometry']['coordinates'][0]
                ee_geometry = ee.Geometry.Polygon(coords)
                
                regions.append({
                    'name': region_name,
                    'coords': ee_geometry
                })
    
    return regions

# Cloud masking function for Sentinel-2
def maskS2clouds(image):
    # Get SCL band for cloud masking
    scl = image.select('SCL')
    
    # Mask out cloud, cloud shadow, and saturated/defective pixels
    mask = scl.neq(3).And(scl.neq(8)).And(scl.neq(9)).And(scl.neq(10))
    
    return image.updateMask(mask)

# Function to get Sentinel-2 imagery with enhanced filtering
def get_sentinel_imagery(region, start_date, end_date):
    # Get all images in date range
    s2_collection = ee.ImageCollection('COPERNICUS/S2_SR') \
        .filterDate(start_date, end_date) \
        .filterBounds(region['coords'])
    
    # Apply more stringent cloud filtering
    s2_filtered = s2_collection \
        .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 10)) \
        .map(maskS2clouds)
    
    # If we have enough images after filtering, use median
    count = s2_filtered.size().getInfo()
    print(f"Found {count} images for {region['name']} after cloud filtering")
    
    if count >= 3:
        # Use median composite for better cloud removal
        composite = s2_filtered.select(['B2', 'B3', 'B4', 'B8']).median()
    else:
        # Fall back to least cloudy image if not enough for median
        composite = s2_filtered.sort('CLOUDY_PIXEL_PERCENTAGE').first() \
            .select(['B2', 'B3', 'B4', 'B8'])
    
    return composite

# Function to calculate NDVI (vegetation index)
def addNDVI(image):
    ndvi = image.normalizedDifference(['B8', 'B4']).rename('NDVI')
    return image.addBands(ndvi)

# Main export function for Detroit
def export_detroit_imagery(regions):
    # Define seasons to capture seasonal variation
    seasons = [
        {'name': 'summer', 'start': '2023-06-01', 'end': '2023-08-31'},
        {'name': 'fall', 'start': '2022-09-01', 'end': '2022-11-30'}  # Using 2022 for more data availability
    ]
    
    for region in regions:
        for season in seasons:
            try:
                print(f"Processing {region['name']} for {season['name']}...")
                
                # Get imagery for this region and season
                image = get_sentinel_imagery(
                    region, 
                    season['start'], 
                    season['end']
                )
                
                # Add NDVI
                image = addNDVI(image)
                
                # For Detroit city, we'll use a higher resolution
                scale = 10 if region['name'] == 'detroit' else 20
                
                # Export RGB + NIR + NDVI
                task = ee.batch.Export.image.toDrive(
                    image=image,
                    description=f"{region['name']}_{season['name']}",
                    folder="detroit_satellite_imagery",
                    scale=scale,  # 10m resolution for Detroit, 20m for metro
                    region=region['coords'],
                    maxPixels=1e9
                )
                
                task.start()
                print(f"Started export for {region['name']} - {season['name']}")
                
                # Add a small delay to avoid rate limiting
                time.sleep(5)
                
            except Exception as e:
                print(f"Error processing {region['name']} - {season['name']}: {str(e)}")

# Run the collection process
print("Loading Detroit region boundaries...")
regions = load_detroit_boundaries()
print(f"Found {len(regions)} regions: {[r['name'] for r in regions]}")

print("Starting imagery export...")
export_detroit_imagery(regions)
print("Export tasks have been submitted to Google Earth Engine.")
print("Check your Google Drive for the 'detroit_satellite_imagery' folder once processing is complete.")