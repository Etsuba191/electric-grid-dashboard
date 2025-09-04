import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

  // Clear existing data
  await prisma.gridAsset.deleteMany({});
  console.log('Deleted all existing grid assets.');

  // Seed substations
  const substationsPath = path.join(process.cwd(), 'public', 'Substations.geojson');
  const substationsFile = fs.readFileSync(substationsPath, 'utf-8');
  const substationsData = JSON.parse(substationsFile);

  for (const feature of substationsData.features) {
    const properties = feature.properties;
    const coordinates = feature.geometry.coordinates;

    await prisma.gridAsset.create({
      data: {
        id: properties.ORIG_FID.toString(), // Use ORIG_FID as ID
        name: properties.Name_First || 'Unknown Substation',
        type: 'substation',
        status: 'normal', // Default status
        latitude: coordinates[1],
        longitude: coordinates[0],
        address: properties.Poletical_ || 'Unknown',
        voltage: parseInt(properties.VOLTAGE_LE) || 0,
        load: 0, // Default load
        capacity: 0, // Default capacity
        site: properties.Name_First || null,
        zone: properties.New_EEP_Re || null,
        woreda: properties.Poletical_ || null,
        category: properties.TYPE_First || null,
        nameLink: properties.Name_First || null,
      },
    });
  }
  console.log(`Seeded ${substationsData.features.length} substations.`);

  // Seed electric towers
  const towersPath = path.join(process.cwd(), 'public', 'ElectricTowers.geojson');
  const towersFile = fs.readFileSync(towersPath, 'utf-8');
  const towersData = JSON.parse(towersFile);

  for (const feature of towersData.features) {
    const properties = feature.properties;
    const coordinates = feature.geometry.coordinates;

    await prisma.gridAsset.create({
      data: {
        id: properties.OBJECTID.toString(), // Use OBJECTID as ID
        name: properties.Link_Name || `Tower ${properties.Barcode}`,
        type: 'tower',
        status: properties.Status?.toLowerCase() || 'unknown',
        latitude: coordinates[1],
        longitude: coordinates[0],
        address: properties.Town || 'Unknown',
        voltage: 0, // Default voltage for towers
        load: 0, // Default load
        capacity: 0, // Default capacity
        site: properties.Site_Name || null,
        zone: properties.Zone || null,
        woreda: properties.Woreda || null,
        category: properties.Catagory || null,
        nameLink: properties.Link_Name || null,
      },
    });
  }
  console.log(`Seeded ${towersData.features.length} electric towers.`);

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
