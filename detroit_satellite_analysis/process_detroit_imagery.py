import os
import rasterio
from rasterio.windows import Window
import numpy as np
import cv2
from tqdm import tqdm
import pandas as pd

def split_detroit_image(image_path, output_dir, patch_size=256, stride=128, quality_threshold=25):
    """Split a Detroit satellite image into overlapping patches with quality filtering."""
    os.makedirs(output_dir, exist_ok=True)
    
    with rasterio.open(image_path) as src:
        meta = src.meta.copy()
        
        # Update metadata for the smaller patches
        meta.update({
            'width': patch_size,
            'height': patch_size
        })
        
        # Track patch statistics for quality control
        patch_stats = []
        
        # Calculate total patches for progress bar
        total_patches = ((src.height - patch_size) // stride + 1) * ((src.width - patch_size) // stride + 1)
        
        with tqdm(total=total_patches, desc=f"Processing {os.path.basename(image_path)}") as pbar:
            for i in range(0, src.height - patch_size + 1, stride):
                for j in range(0, src.width - patch_size + 1, stride):
                    window = Window(j, i, patch_size, patch_size)
                    patch = src.read(window=window)
                    
                    # Calculate quality metrics
                    avg_value = np.mean(patch)
                    std_value = np.std(patch)
                    
                    # Skip low-information patches (too dark, too uniform, etc.)
                    if avg_value > quality_threshold and std_value > 5:
                        # Create a unique identifier for this patch
                        patch_id = f"{os.path.basename(image_path).split('.')[0]}_y{i}_x{j}"
                        out_path = os.path.join(output_dir, f"{patch_id}.tif")
                        
                        # Write the patch
                        with rasterio.open(out_path, 'w', **meta) as dst:
                            dst.write(patch)
                        
                        # Store patch statistics for later analysis
                        patch_stats.append({
                            'patch_id': patch_id,
                            'source_image': os.path.basename(image_path),
                            'x_offset': j,
                            'y_offset': i,
                            'avg_value': avg_value,
                            'std_value': std_value,
                            'path': out_path
                        })
                    
                    pbar.update(1)
        
        # Save patch statistics
        stats_df = pd.DataFrame(patch_stats)
        stats_path = os.path.join(output_dir, f"{os.path.basename(image_path).split('.')[0]}_patch_stats.csv")
        stats_df.to_csv(stats_path, index=False)
        
        print(f"Generated {len(patch_stats)} valid patches from {os.path.basename(image_path)}")
        
        return stats_df

def create_detroit_visualizations(patches_dir, output_dir):
    """Create false color visualizations to help with annotation."""
    os.makedirs(output_dir, exist_ok=True)
    
    for filename in tqdm(os.listdir(patches_dir), desc="Creating visualizations"):
        if filename.endswith(".tif"):
            patch_path = os.path.join(patches_dir, filename)
            
            with rasterio.open(patch_path) as src:
                # Check number of bands
                num_bands = src.count
                
                # Read bands - handle different band counts
                if num_bands >= 4:
                    # Standard order from Earth Engine export: B2=Blue, B3=Green, B4=Red, B8=NIR
                    blue = src.read(1)
                    green = src.read(2)
                    red = src.read(3)
                    nir = src.read(4)
                    
                    # Check if NDVI band exists (from Earth Engine export)
                    ndvi_band = None
                    if num_bands >= 5:
                        ndvi_band = src.read(5)
                else:
                    # Handle unexpected band count
                    print(f"Warning: Unexpected band count ({num_bands}) in {filename}")
                    continue
                
                # Create RGB visualization
                rgb = np.dstack((red, green, blue))
                rgb = np.clip(rgb * 3.5, 0, 255).astype(np.uint8)  # Enhance contrast
                
                # Create false color (NIR, Red, Green)
                false_color = np.dstack((nir, red, green))
                false_color = np.clip(false_color * 3.5, 0, 255).astype(np.uint8)
                
                # Use pre-calculated NDVI if available, otherwise calculate it
                if ndvi_band is not None:
                    # Scale NDVI from [-1,1] to [0,255] for visualization
                    ndvi_colored = cv2.applyColorMap(
                        np.clip((ndvi_band + 1) / 2 * 255, 0, 255).astype(np.uint8),
                        cv2.COLORMAP_JET
                    )
                else:
                    # Calculate NDVI
                    ndvi = (nir.astype(float) - red.astype(float)) / (nir.astype(float) + red.astype(float) + 1e-6)
                    ndvi_colored = cv2.applyColorMap(
                        np.clip((ndvi + 1) / 2 * 255, 0, 255).astype(np.uint8),
                        cv2.COLORMAP_JET
                    )
                
                # Create a composite visualization
                composite = np.hstack((rgb, false_color, ndvi_colored))
                
                # Save visualization
                output_path = os.path.join(output_dir, f"{os.path.splitext(filename)[0]}_viz.jpg")
                cv2.imwrite(output_path, cv2.cvtColor(composite, cv2.COLOR_RGB2BGR))

def create_detroit_annotation_guidelines():
    """Create Detroit-specific annotation guidelines."""
    guidelines = """
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
    """
    
    with open("detroit_annotation_guidelines.md", "w") as f:
        f.write(guidelines)
    
    print("Detroit annotation guidelines created: detroit_annotation_guidelines.md")

def main():
    # Process all downloaded Detroit satellite images
    image_dir = "imagery"  # Where you've saved the images from Google Drive
    patches_dir = "patches"
    viz_dir = "visualizations"
    
    os.makedirs(patches_dir, exist_ok=True)
    os.makedirs(viz_dir, exist_ok=True)
    
    # Process each image
    all_patch_stats = []
    
    for filename in os.listdir(image_dir):
        if filename.endswith((".tif", ".TIF")):
            image_path = os.path.join(image_dir, filename)
            stats = split_detroit_image(
                image_path, 
                patches_dir,
                patch_size=256,
                stride=128,  # 50% overlap
                quality_threshold=25
            )
            all_patch_stats.append(stats)
    
    # Combine all patch statistics
    if all_patch_stats:
        combined_stats = pd.concat(all_patch_stats)
        combined_stats.to_csv("detroit_patch_statistics.csv", index=False)
    
    # Create visualizations for annotation
    create_detroit_visualizations(patches_dir, viz_dir)
    
    # Create Detroit-specific annotation guidelines
    create_detroit_annotation_guidelines()
    
    print("Detroit data preparation complete!")
    print(f"Total patches generated: {len(os.listdir(patches_dir))}")
    print(f"Visualizations created: {len(os.listdir(viz_dir))}")
    print("Next steps:")
    print("1. Upload visualizations to Roboflow")
    print("2. Share Detroit annotation guidelines with annotators")
    print("3. Begin annotation process")

if __name__ == "__main__":
    main() 