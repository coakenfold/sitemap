import { vehicleQuery } from './api/vehicleQuery.js';

export const fetchVehicles = async (dealer, market, totalCount, nonAudiBrand) => {
  // console.log('🚀 ~ fetchVehicles ~ totalCount:', totalCount);
  // console.log('🚀 ~ fetchVehicles ~ market:', market);
  if (!totalCount) return [];
  const limit = 100;
  const totalPages = Math.ceil(totalCount / limit);
  const vehiclePromises = [];

  for (let i = 0; i < totalPages; i += 1) {
    const offset = i * limit;
    const offsetPeak = offset + limit;
    const callLimit = offsetPeak > totalCount ? totalCount - offset : limit;

    const queryParams = {
      dealer,
      market,
      limit: callLimit,
      offset,
      nonAudiBrand,
    };
    // Await
    // const queryResult = await vehicleQuery(queryParams);
    // No Await
    const queryResult = vehicleQuery(queryParams);

    vehiclePromises.push(queryResult);
  }

  const vehicleResults = await Promise.all(vehiclePromises);

  const combinedVehicles = vehicleResults.flatMap(
    (result) => result.data?.getFilteredVehiclesForWormwood.vehicles,
  );

  const vehicles = combinedVehicles.map((vehicle) => {
    const { id, vehicleType } = vehicle;
    return {
      id,
      market: market[0].toLowerCase(),
      vehicleType,
    };
  });

  const uniqueVehicles = Array.from(new Set(vehicles.map((vehicle) => vehicle?.id)))
    .map((id) => vehicles.find((vehicle) => vehicle.id === id))
    .filter((vehicle) => vehicle !== undefined);

  return uniqueVehicles;
};
