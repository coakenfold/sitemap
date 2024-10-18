import fetch from 'node-fetch';

export const vehicleFilterQuery = ({ dealer, market, limit, offset, isNonAudi }) => {
    const isNonAudiBrand = isNonAudi ? 'yes' : 'no';
    const query = `query GetFilteredVehiclesForWormwood(
      $dealer: String, $market: [MarketType]!, $limit: Int, $offset: Int      
  ) {
    getFilteredVehiclesForWormwood(
    version: "2.0.0"
    market: $market
    size: $limit
    lang: "en"
    filters: $dealer
    ranges: "prices.retail,modelYear,powerHP,usedCarMileage"
    sort: "DATE_PREDATEEND:ASC"
    from: $offset
    preset: "foreign-brand.${isNonAudiBrand},sold-order.no,stat-import.AGC_USA_JDP"
    ) {
      filterResults {
      totalCount
      totalNewCarCount
      totalUsedCarCount
      }
    }
  }`;
  
    return fetch(process.env.URL_GQL, {
      headers: {
        accept: '*/*',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        query,
        variables: { dealer, market, limit, offset },
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((body) => {
        return body?.data?.getFilteredVehiclesForWormwood?.filterResults?.totalCount;
      })
      .catch((error) => console.log(error));

  };