import {getShopByDomain} from '../repositories/shopRepository';
import {getFeedByShopId} from './mainFeedRepository';
import {findMediaByShopId} from './mediaIgRepository';
import {getUser} from './userRepository';

export async function getIGDataByShopDomain(shopifyDomain) {
  try {
    const shopData = await getShopByDomain(shopifyDomain);
    if (!shopData || !shopData.data || !shopData.data.id) {
      return Error('Shop not found');
    }

    const shopId = shopData.data.id;
    console.log('_____________________shopid', shopId);
    const [mainFeed, media, user] = await Promise.all([
      getFeedByShopId(shopId),
      findMediaByShopId(shopId),
      getUser()
    ]);

    const {username, userId} = user;
    const simplifiedUser = {
      username,
      userId
    };
    return {
      mainFeed,
      media: {media: media.media},
      user: simplifiedUser
    };
  } catch (error) {
    console.error(error);
    return error;
  }
}
// import NodeCache from 'node-cache';
// import {getShopByDomain} from '../repositories/shopRepository';
// import {getFeedByShopId} from './mainFeedRepository';
// import {findMediaByShopId} from './mediaIgRepository';
// import {getUser} from './userRepository';

// const cache = new NodeCache({stdTTL: 600}); // Cache for 10 minutes

// export async function getIGDataByShopDomain(shopifyDomain) {
//   try {
//     const cacheKey = `IGData_${shopifyDomain}`;
//     const cachedData = cache.get(cacheKey);

//     if (cachedData) {
//       // Return the cached data immediately
//       revalidateCache(shopifyDomain, cacheKey); // Update cache in the background
//       console.log('cacheData________________', cachedData);
//       return cachedData;
//     } else {
//       // If no cached data, fetch from the DB
//       const data = await getData(shopifyDomain);
//       cache.set(cacheKey, data);
//       return data;
//     }
//   } catch (error) {
//     console.error('Error fetching IG data:', error);
//     return {error: error.message};
//   }
// }

// // Function to fetch data from fireStore
// async function getData(shopifyDomain) {
//   const shopData = await getShopByDomain(shopifyDomain);
//   if (!shopData?.data?.id) {
//     throw new Error('Shop not found');
//   }

//   const shopId = shopData.data.id;
//   console.log('_____________________shopid', shopId);

//   const [mainFeed, media, user] = await Promise.all([
//     getFeedByShopId(shopId),
//     findMediaByShopId(shopId),
//     getUser()
//   ]);

//   const {username, userId} = user;
//   const simplifiedUser = {username, userId};

//   return {
//     mainFeed,
//     media: {media: media.media},
//     user: simplifiedUser
//   };
// }

// // Function to update cache
// async function revalidateCache(shopifyDomain, cacheKey) {
//   try {
//     const data = await getData(shopifyDomain);
//     cache.set(cacheKey, data);
//   } catch (error) {
//     console.error('Error revalidating cache:', error);
//   }
// }
