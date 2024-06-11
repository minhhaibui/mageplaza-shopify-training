import {getCurrentShop} from '../helpers/auth';
import InstagramApi from '../helpers/instagramApi';
import {findMediaByShopId, addOrUpdateMedia} from '../repositories/mediaIgRepository';

const igApi = new InstagramApi();

export async function getMedia(ctx) {
  console.log('_________________________media______________________');
  const shopId = getCurrentShop(ctx);
  const mediaCurrent = await findMediaByShopId(shopId);
  const token = ctx.cookies.get('instagram_token');
  const [newMedia, currentUser] = await Promise.all([
    igApi.fetchMediaData(token),
    igApi.getCurrentUser(token)
  ]);

  if (mediaCurrent.empty || mediaCurrent.docs[0].data().userId !== currentUser.id) {
    if (!mediaCurrent.empty) {
      const batch = firestore.batch();
      mediaCurrent.forEach(doc => {
        batch.delete(doc.ref);
      });
      await batch.commit();
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

  let allMedia = [];
  mediaCurrent.forEach(doc => {
    allMedia = allMedia.concat(doc.data().media);
  });
  console.log({allMedia});

  return (ctx.body = {
    success: true,
    data: {
      userId: mediaCurrent.docs[0].data().userId,
      shopId: shopId,
      media: allMedia
    }
  });
}

export async function handleSyncMedia(ctx) {
  const shopId = getCurrentShop(ctx);
  const mediaCurrent = await findMediaByShopId(shopId);
  const token = ctx.cookies.get('instagram_token');
  const [newMedia, currentUser] = await Promise.all([
    igApi.fetchMediaData(token),
    igApi.getCurrentUser(token)
  ]);

  let allExistingMedia = [];
  mediaCurrent.forEach(doc => {
    allExistingMedia = allExistingMedia.concat(doc.data().media);
  });

  // Filter out media that already exist in Firestore
  const uniqueNewMedia = newMedia.filter(
    item => !allExistingMedia.some(existingItem => existingItem.id === item.id)
  );

  // If there are new media, add or update them in Firestore
  if (uniqueNewMedia.length > 0) {
    await addOrUpdateMedia(shopId, uniqueNewMedia, currentUser.id);
  }

  // // Combine existing and new media for the response
  // const combinedMedia = allExistingMedia.concat(uniqueNewMedia);

  return (ctx.body = {
    success: true,
    data: {
      userId: currentUser.id,
      shopId: shopId,
      media: newMedia // Return the combined media (limit 10 items)
    }
  });
}
