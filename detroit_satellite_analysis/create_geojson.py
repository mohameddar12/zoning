import json
import os

# Ensure the boundaries directory exists
os.makedirs("boundaries", exist_ok=True)

# Detroit city boundary
detroit = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {"name": "Detroit City"},
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [-83.2879, 42.2555],
          [-82.9103, 42.2555],
          [-82.9103, 42.4501],
          [-83.2879, 42.4501],
          [-83.2879, 42.2555]
        ]]
      }
    }
  ]
}

# Metro Detroit boundary
metro_detroit = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {"name": "Metro Detroit"},
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [-83.7466, 42.1268],
          [-82.8466, 42.1268],
          [-82.8466, 42.7268],
          [-83.7466, 42.7268],
          [-83.7466, 42.1268]
        ]]
      }
    }
  ]
}

# Write the files
with open("boundaries/detroit.geojson", "w") as f:
    json.dump(detroit, f, indent=2)

with open("boundaries/metro_detroit.geojson", "w") as f:
    json.dump(metro_detroit, f, indent=2)

print("GeoJSON files created successfully!") 