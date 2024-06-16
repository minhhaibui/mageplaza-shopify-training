import {getCurrentShop, getTokenUserIg} from '../helpers/auth';
import {checkIgMediaUrlValid} from '../helpers/igHelpers';
import InstagramApi from '../helpers/instagramApi';
import {
  findMediaByShopId,
  addOrUpdateMedia,
  deleteMediaByShopId,
  refreshAllMediaUrls
} from '../repositories/mediaIgRepository';

const igApi = new InstagramApi();

export async function getMedia(ctx) {
  console.log('_________________________get media______________________');
  const shopId = getCurrentShop(ctx);
  const token = getTokenUserIg(ctx);
  const [newMedia, currentUser, mediaData] = await Promise.all([
    igApi.fetchMediaData(token),
    igApi.getCurrentUser(token),
    findMediaByShopId(shopId)
  ]);

  // Add new media when connected for the first time or change account
  if (!mediaData || mediaData.userId !== currentUser.id) {
    console.log('________________addNew media first time or change account____________');
    if (mediaData) {
      await deleteMediaByShopId(shopId);
    }
    await addOrUpdateMedia(shopId, newMedia, currentUser.id);
    return (ctx.body = {
      success: true,
      data: {
        userId: currentUser.id,
        shopId: shopId,
        media: newMedia
      }
    });
  }

  let hasExpiredMedia = false;
  for (const media of mediaData.media) {
    if (!(await checkIgMediaUrlValid(media.media_url))) {
      hasExpiredMedia = true;
      break;
    }
  }
  // Refresh all expired media URLs if any URL is expired
  if (hasExpiredMedia) {
    console.log('________________refreshing expired media URLs____________');
    await refreshAllMediaUrls(shopId, token);
    const updatedMediaData = await getMediaDataByShopId(shopId);
    return (ctx.body = {
      success: true,
      data: updatedMediaData
    });
  }

  console.log('__________connect Normal_________');
  return (ctx.body = {
    success: true,
    data: mediaData
  });
}

export async function handleSyncMedia(ctx) {
  const shopId = getCurrentShop(ctx);
  const token = getTokenUserIg(ctx);

  const [newMedia, currentUser] = await Promise.all([
    igApi.fetchMediaData(token),
    igApi.getCurrentUser(token)
  ]);

  await addOrUpdateMedia(shopId, newMedia, currentUser.id);

  return (ctx.body = {
    success: true,
    data: {
      userId: currentUser.id,
      shopId: shopId,
      media: newMedia
    }
  });
}
