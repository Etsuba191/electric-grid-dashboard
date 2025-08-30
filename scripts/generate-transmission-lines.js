// scripts/generate-transmission-lines.js
const fs = require('fs');
const path = require('path');
const turf = require('@turf/turf');

// Define paths
const dataDir = path.join(process.cwd(), 'public', 'data');
const towerFile = path.join(dataDir, 'electric_tower.geojson');
const substationFile = path.join(dataDir, 'substation.geojson');
const outputFile = path.join(dataDir, 'transmission_lines.geojson');

// Load GeoJSON files
const towers = JSON.parse(fs.readFileSync(towerFile));
const substations = JSON.parse(fs.readFileSync(substationFile));

console.log(`Loaded ${towers.features.length} towers and ${substations.features.length} substations`);

// Wrap substations in FeatureCollection for Turf
const substationFC = {
  type: 'FeatureCollection',
  features: substations.features
};

// Prepare transmission lines collection
const lines = {
  type: 'FeatureCollection',
  features: []
};

// Connect each tower to nearest substation
towers.features.forEach((tower, i) => {
  const nearestSub = turf.nearestPoint(tower, substationFC);
  const line = turf.lineString(
    [tower.geometry.coordinates, nearestSub.geometry.coordinates],
    {
      tower_id: tower.properties.id || i,
      substation_id: nearestSub.properties.id || nearestSub.properties.name,
      voltage: tower.properties.voltage || nearestSub.properties.voltage,
      distance_km: turf.distance(tower, nearestSub, { units: 'kilometers' }).toFixed(3)
    }
  );
  lines.features.push(line);

  // Log progress every 5000
  if (i % 5000 === 0) console.log(`${i} towers processed...`);
});

// Save to file
fs.writeFileSync(outputFile, JSON.stringify(lines, null, 2));
console.log(`✅ transmission_lines.geojson saved with ${lines.features.length} lines!`);

for (const a of assets) {
  if (a.region) regionSet.add(a.region);
}