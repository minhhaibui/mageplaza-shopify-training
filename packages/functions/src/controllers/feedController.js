import {getFeedByShopId, updateFeedByShopId} from '@functions/repositories/mainFeedRepository';
import {getCurrentShop} from '../helpers/auth';

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
  const shopId = getCurrentShop(ctx);
  console.log({shopId});
  const feed = ctx.req.body;
  console.log('body', feed);
  if (!feed) {
    return (ctx.body = {
      error: 'Missing input'
    });
  }
  await updateFeedByShopId(shopId, feed);
  ctx.status = 200;
  ctx.body = {
    success: true
  };
}
