import {getCurrentShop} from '../helpers/auth';
import InstagramApi from '../helpers/instagramApi';
import {
  findMediaByShopId,
  addOrUpdateMedia,
  deleteMediaByShopId,
  refreshMediaUrls,
  updateMediaUrls,
  checkExpiredMedia
} from '../repositories/mediaIgRepository';

const igApi = new InstagramApi();

// export async function getMedia(ctx) {
//   console.log('_________________________media______________________');
//   const shopId = getCurrentShop(ctx);
//   const mediaCurrent = await findMediaByShopId(shopId);
//   const token = ctx.cookies.get('instagram_token');
//   const [newMedia, currentUser] = await Promise.all([
//     igApi.fetchMediaData(token),
//     igApi.getCurrentUser(token)
//   ]);

//   //add new media when connected for the first time or change account
//   if (mediaCurrent.empty || mediaCurrent.docs[0].data().userId !== currentUser.id) {
//     if (!mediaCurrent.empty) {
//       await deleteMediaByShopId(shopId);
//     }
//     await addOrUpdateMedia(shopId, newMedia, currentUser.id);
//     return (ctx.body = {
//       success: true,
//       data: {
//         userId: currentUser.id,
//         shopId: shopId,
//         media: newMedia
//       }
//     });
//   }

//   let allMedia = [];
//   mediaCurrent.forEach(doc => {
//     allMedia = allMedia.concat(doc.data().media);
//   });
//   console.log({allMedia});

//   return (ctx.body = {
//     success: true,
//     data: {
//       userId: mediaCurrent.docs[0].data().userId,
//       shopId: shopId,
//       media: allMedia
//     }
//   });
// }

export async function getMedia(ctx) {
  console.log('_________________________get media______________________');
  const shopId = getCurrentShop(ctx);
  const mediaCurrent = await findMediaByShopId(shopId);
  const token = ctx.cookies.get('instagram_token');
  const [newMedia, currentUser] = await Promise.all([
    igApi.fetchMediaData(token),
    igApi.getCurrentUser(token)
  ]);

  // Add new media when connected for the first time or change account
  if (mediaCurrent.empty || mediaCurrent.docs[0].data().userId !== currentUser.id) {
    console.log('________________addNew media first time or change account____________');
    if (!mediaCurrent.empty) {
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

  // Check and refresh expired media URLs
  const expiredMediaIds = await checkExpiredMedia(shopId);
  if (expiredMediaIds.length > 0) {
    console.log('____________refresh mediaUrl__________');
    const refreshedMedia = await refreshMediaUrls(token, expiredMediaIds);
    await updateMediaUrls(shopId, refreshedMedia);
  }

  let allMedia = [];
  mediaCurrent.forEach(doc => {
    allMedia = allMedia.concat(doc.data().media);
  });
  console.log('__________connect Normal_________');
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
  const token = ctx.cookies.get('instagram_token');

  const [newMedia, currentUser] = await Promise.all([
    igApi.fetchMediaData(token),
    igApi.getCurrentUser(token)
  ]);

  await deleteMediaByShopId(shopId);

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
