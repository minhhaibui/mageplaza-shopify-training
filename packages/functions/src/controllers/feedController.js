import {getFeedByShopId, updateFeedByShopId} from '@functions/repositories/mainFeedRepository';
import {getCurrentShop} from '../helpers/auth';
import {createOrUpdateMetafield} from '../repositories/metafieldRepository';

// import {addNotification} from '../repositories/notificationRepository';

/**
 * Get current subscription of a shop
 *
 * @param {Context|Object|*} ctx
 * @returns {Promise<void>}
 */

export async function getFeed(ctx) {
  const shopId = getCurrentShop(ctx);
  const feed = await getFeedByShopId(shopId);
  ctx.status = 200;
  ctx.body = {feed};
}

export async function updateFeeds(ctx) {
  try {
    const shopId = getCurrentShop(ctx);
    const {feed, mediaCount} = ctx.req.body;
    const metaFieldIg = {...feed, mediaCount};

    console.log('feed', feed);
    console.log('metafield___________', metaFieldIg);

    if (!feed) {
      return (ctx.body = {
        error: 'Missing input'
      });
    }
    await Promise.all([updateFeedByShopId(shopId, feed), createOrUpdateMetafield(metaFieldIg)]);
    // await updateFeedByShopId(shopId, feed);
    // await createOrUpdateMetafield(metaFieldIg);
    ctx.status = 200;
    ctx.body = {
      success: true
    };
  } catch (error) {
    console.log(error);
    return;
  }
}
