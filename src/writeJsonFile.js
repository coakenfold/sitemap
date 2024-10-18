import fs from 'fs';

export const writeJsonFile = async (vehicleArray) => {
    const entryUrls = vehicleArray.map((vehicleDetails) => {
      const { id, market } = vehicleDetails;
      return {
        location: `/inventory/?isdealer&market=${market}&vehicleId=${id}`,
        changeFrequency: 'always',
        priority: 0.4,
      };
    });
  
    const sitemapEntry = {
      name: 'vdp-sitemap',
      urls: entryUrls,
    };
    const sitemapArray = [sitemapEntry];
  
    const json = JSON.stringify(sitemapArray, null, 2);
    fs.writeFile('sitemap.json', json, function (err) {
      if (err) throw err;
      console.log('sitemap writing complete');
    });
  };