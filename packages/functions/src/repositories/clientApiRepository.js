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
    return {
      mainFeed,
      media,
      user
    };
  } catch (error) {
    console.error(error);
    return error;
  }
}
