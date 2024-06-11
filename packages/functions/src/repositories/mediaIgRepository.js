import {Firestore} from '@google-cloud/firestore';

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

export async function updateMedia(docRef, data) {
  return await docRef.update(data);
}

export async function addOrUpdateMedia(shopId, mediaList, userId, limit = 10) {
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
