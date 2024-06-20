import {Firestore} from '@google-cloud/firestore';
import InstagramApi from '../helpers/instagramApi';
const firestore = new Firestore();
/** @type CollectionReference */
const mediaRef = firestore.collection('media');
const igApi = new InstagramApi();

export async function findMediaByShopId(shopId) {
  try {
    const querySnapshot = await mediaRef.where('shopId', '==', shopId).get();
    if (querySnapshot.empty) {
      return null;
    }
    const allMedia = [];
    querySnapshot.forEach(doc => {
      allMedia.push(...doc.data().media);
    });
    return {
      userId: querySnapshot.docs[0].data().userId,
      shopId: shopId,
      media: allMedia,
      docs: querySnapshot.docs
    };
  } catch (error) {
    console.error('Error finding media by shopId:', error);
  }
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

export async function addOrUpdateMedia(shopId, mediaList, userId, limit = 5) {
  try {
    const batch = firestore.batch();
    const mediaData = await findMediaByShopId(shopId);

    // Tạo một Set để lưu trữ các id của media hiện có trong Firestore
    const existingMediaIds = new Set();
    const currentMediaMap = new Map();

    if (mediaData) {
      mediaData.docs.forEach(doc => {
        const data = doc.data();
        const mediaArray = data.media || [];
        currentMediaMap.set(doc.id, mediaArray);
        mediaArray.forEach(media => existingMediaIds.add(media.id));
      });
    }

    // Tạo một Set để lưu trữ các id media từ Instagram
    const mediaIdsFromInstagram = new Set(mediaList.map(media => media.id));

    // Xác định media cần xóa
    const mediaToDelete = [];
    currentMediaMap.forEach((mediaArray, docId) => {
      mediaArray.forEach(media => {
        if (!mediaIdsFromInstagram.has(media.id)) {
          mediaToDelete.push({docId, media});
        }
      });
    });

    // Xóa các media
    mediaToDelete.forEach(({docId, media}) => {
      const mediaArray = currentMediaMap.get(docId).filter(m => m.id !== media.id);
      if (mediaArray.length === 0) {
        batch.delete(mediaRef.doc(docId));
        currentMediaMap.delete(docId);
      } else {
        batch.update(mediaRef.doc(docId), {
          media: mediaArray
        });
        currentMediaMap.set(docId, mediaArray);
      }
    });

    // Thêm các media mới từ Instagram vào Firestore
    let updatedMedia = [];
    mediaList.forEach(media => {
      if (!existingMediaIds.has(media.id)) {
        updatedMedia.push(media);
        existingMediaIds.add(media.id);
      }
    });

    currentMediaMap.forEach((mediaArray, docId) => {
      if (updatedMedia.length > 0 && mediaArray.length < limit) {
        const mediaToAdd = updatedMedia.slice(0, limit - mediaArray.length);
        const newMediaArray = [...mediaArray, ...mediaToAdd];
        batch.set(
          mediaRef.doc(docId),
          {
            userId: userId,
            shopId: shopId,
            media: newMediaArray.slice(0, limit)
          },
          {merge: true}
        );
        updatedMedia = updatedMedia.slice(mediaToAdd.length);
        currentMediaMap.set(docId, newMediaArray);
      }
    });

    while (updatedMedia.length > 0) {
      const newDocRef = mediaRef.doc();
      batch.set(newDocRef, {
        userId: userId,
        shopId: shopId,
        media: updatedMedia.slice(0, limit)
      });
      updatedMedia = updatedMedia.slice(limit);
    }

    await batch.commit();

    console.log('Sync media with Instagram successfully.');
  } catch (error) {
    console.error('Error syncing media with Instagram:', error);
    throw error;
  }
}

export async function refreshAllMediaUrls(shopId, token) {
  try {
    const mediaData = await findMediaByShopId(shopId);
    if (!mediaData || !mediaData.docs.length) {
      console.log('No media found for the given shopId.');
      return;
    }
    const batch = firestore.batch();
    const newMediaList = await igApi.fetchMediaData(token);
    const newMediaMap = new Map(newMediaList.map(media => [media.id, media]));
    mediaData.docs.forEach(doc => {
      const updatedMediaArray = doc.data().media.map(m => {
        const refreshed = newMediaMap.get(m.id);
        return refreshed ? {...m, media_url: refreshed.media_url} : m;
      });

      batch.update(mediaRef.doc(doc.id), {media: updatedMediaArray});
    });
    await batch.commit();
    console.log('Refreshed all media URLs successfully.');
  } catch (error) {
    console.error('Error refreshing all media URLs:', error);
    throw error;
  }
}
