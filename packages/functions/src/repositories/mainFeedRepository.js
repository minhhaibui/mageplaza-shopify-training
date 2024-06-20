import {Firestore} from '@google-cloud/firestore';
import {presentDataAndFormatDate} from '@functions/helpers/utils/firestoreUtils';

const firestore = new Firestore();
/** @type CollectionReference */
const feedRef = firestore.collection('feed');

export async function getFeedByShopId(shopId) {
  try {
    const docs = await feedRef.where('shopId', '==', shopId).get();
    if (docs.empty) {
      return null;
    }
    const [doc] = docs.docs;

    return presentDataAndFormatDate(doc);
  } catch (error) {
    return error;
  }
}

export async function addFeed(data) {
  try {
    return await feedRef.add(data);
  } catch (error) {
    return error;
  }
}

export async function updateFeedByShopId(shopId, newData) {
  try {
    const feed = await getFeedByShopId(shopId);
    if (!feed) {
      return 'feed does not exist';
    }
    await feedRef.doc(feed.id).update(newData);
    return true;
  } catch (error) {
    return error;
  }
}
