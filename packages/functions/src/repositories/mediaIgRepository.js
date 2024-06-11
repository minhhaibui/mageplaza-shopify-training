import {Firestore} from '@google-cloud/firestore';
import InstagramApi from '../helpers/instagramApi';
const igApi = new InstagramApi();

const firestore = new Firestore();
/** @type CollectionReference */
const mediaRef = firestore.collection('media');

export async function addOneMedia(data) {
  return await mediaRef.add(data);
}

export async function findMediaByShopId(shopId) {
  const querySnapshot = await mediaRef.where('shopId', '==', shopId).get();
  return querySnapshot;
}

export async function addOrUpdateMedia(shopId, mediaList, userId, limit = 5) {
  const mediaCurrent = await findMediaByShopId(shopId);
  const batch = firestore.batch();
  let remainingMedia = mediaList.slice();
  const timeConnect = new Date();

  mediaCurrent.forEach(doc => {
    const data = doc.data();
    const currentMediaCount = data.media.length;
    if (currentMediaCount < limit && remainingMedia.length > 0) {
      const mediaToAdd = remainingMedia.slice(0, limit - currentMediaCount);
      batch.update(doc.ref, {
        media: Firestore.FieldValue.arrayUnion(...mediaToAdd),
        TimeConnect: timeConnect
      });
      remainingMedia = remainingMedia.slice(mediaToAdd.length);
    }
  });

  // Tạo các tài liệu mới nếu còn media còn lại trong remainingMedia
  while (remainingMedia.length > 0) {
    const newDocRef = mediaRef.doc();
    batch.set(newDocRef, {
      userId: userId,
      shopId: shopId,
      media: remainingMedia.slice(0, limit),
      TimeConnect: timeConnect
    });
    remainingMedia = remainingMedia.slice(limit);
  }

  await batch.commit();
}

export async function deleteMediaByShopId(shopId) {
  try {
    const querySnapshot = await mediaRef.where('shopId', '==', shopId).get();
    if (querySnapshot.empty) {
      console.log('No matching documents.');
      return;
    }
    let batch = firestore.batch();
    querySnapshot.forEach(doc => {
      batch.delete(doc.ref);
    });
    await batch.commit();
    console.log(`Deleted all media documents for shopId: ${shopId}`);
  } catch (error) {
    console.error('Error deleting media documents:', error);
  }
}

export async function checkExpiredMedia(shopId) {
  const mediaCurrent = await findMediaByShopId(shopId);
  const currentTime = new Date();
  const dayInMilliseconds = 24 * 60 * 60 * 1000;
  const imageExpiry = 3 * dayInMilliseconds;
  const videoExpiry = 1.5 * dayInMilliseconds;
  let expiredMedia = [];

  mediaCurrent.forEach(doc => {
    const data = doc.data();
    const mediaTimestamp = data.TimeConnect.toDate();
    const expiredItems = data.media.filter(media => {
      const mediaAge = currentTime - mediaTimestamp;
      return (
        (media.media_type === 'IMAGE' && mediaAge > imageExpiry) ||
        (media.media_type === 'VIDEO' && mediaAge > videoExpiry)
      );
    });

    if (expiredItems.length > 0) {
      expiredMedia = expiredMedia.concat(expiredItems.map(item => item.id));
    }
  });

  return expiredMedia;
}

export async function refreshMediaUrls(token, mediaIds) {
  const refreshedMedia = [];
  for (const mediaId of mediaIds) {
    const mediaData = await igApi.fetchMediaById(token, mediaId);
    refreshedMedia.push(mediaData);
  }
  return refreshedMedia;
}

export async function updateMediaUrls(shopId, refreshedMedia) {
  const mediaCurrent = await findMediaByShopId(shopId);
  let batch = firestore.batch();

  mediaCurrent.forEach(doc => {
    const data = doc.data();
    const updatedMedia = data.media.map(media => {
      const refreshed = refreshedMedia.find(item => item.id === media.id);
      return refreshed ? {...media, media_url: refreshed.media_url} : media;
    });
    batch.update(doc.ref, {media: updatedMedia, TimeConnect: new Date()});
  });

  await batch.commit();
}
