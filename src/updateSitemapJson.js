import { vehicleFilterQuery } from './api/vehicleFilterQuery.js';
import { fetchVehicles } from './fetchVehicles.js';
import { writeJsonFile } from './writeJsonFile.js';

const dealer = 'dealer.25A70';
const newVehicle = 'US';
const usedVehicle = 'USUC';
const limit = 10;
const offset = 0;

const usedVehicleCounts = {
  dealer,
  market: usedVehicle,
  limit,
  offset,
  isNonAudi: false,
};

const nonAudiUsedVehicleCounts = {
  dealer,
  market: usedVehicle,
  limit,
  offset,
  isNonAudi: true,
};

const newVehicleCounts = {
  dealer,
  market: newVehicle,
  limit,
  offset,
  isNonAudi: false,
};

export const updateSitemapJson = async () => {
  const perfStartTime = performance.now();

  const [newVehicleCount, usedVehicleCount, nonAudiUsedVehicleCount] =
    await Promise.all([
      vehicleFilterQuery(newVehicleCounts || 0),
      vehicleFilterQuery(usedVehicleCounts || 0),
      vehicleFilterQuery(nonAudiUsedVehicleCounts || 0),
    ]);
    const perfVehicleFilterQuery = performance.now();
    console.log(`🏃‍♀️🏃‍♀️🏃‍♀️ 3x vehicleFilterQuery calls took: ${perfVehicleFilterQuery - perfStartTime} milliseconds.`);

  const [newVehicles, usedVehicles, usedNonAudiVehicles] = await Promise.all([
    fetchVehicles('25A70', ['US'], newVehicleCount || 0, false),
    fetchVehicles('25A70', ['USUC'], usedVehicleCount || 0, false),
    fetchVehicles('25A70', ['USUC'], nonAudiUsedVehicleCount || 0, true),
  ]);
  const perfFetchVehicles = performance.now();
  console.log(`🏃‍♀️🏃‍♀️🏃‍♀️ 3x fetchVehicles took: ${perfFetchVehicles - perfVehicleFilterQuery} milliseconds.`);

  writeJsonFile([
    ...new Set([...newVehicles, ...usedVehicles, ...usedNonAudiVehicles]),
  ]);
  const perfEndTime = performance.now();

  console.log(`🏃‍♀️🏃‍♀️🏃‍♀️ Total time: ${perfEndTime - perfStartTime} milliseconds.`);
};
