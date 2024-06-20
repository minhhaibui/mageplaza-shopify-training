import {Firestore} from '@google-cloud/firestore';

const firestore = new Firestore();
/** @type CollectionReference */
const userRef = firestore.collection('user');

export async function getUser() {
  try {
    const querySnapshot = await userRef.get();
    if (querySnapshot.empty) {
      return null;
    }
    const userDoc = querySnapshot.docs[0];
    const user = userDoc.data();
    user.id = userDoc.id;
    return user;
  } catch (error) {
    return error;
  }
}

export async function getUserByUserId(userId) {
  try {
    const querySnapshot = await userRef.where('userId', '==', userId).get();
    if (querySnapshot.empty) {
      console.log(`No user found with userId '${userId}'`);
      return null;
    }
    const doc = querySnapshot.docs[0];
    const docId = doc.id;
    const userData = doc.data();
    return {docId, userData};
  } catch (error) {
    console.error(`Error getting user with userId '${userId}':`, error);
    throw error;
  }
}

export function addOneUser(user) {
  try {
    return userRef.add(user);
  } catch (error) {
    return error;
  }
}

export async function deleteUserById(userId) {
  try {
    const {docId} = await getUserByUserId(userId);
    if (!docId) {
      console.log(`No user found with userId '${userId}'`);
      return;
    }

    await userRef.doc(docId).delete();

    console.log(`User with userId '${userId}' has been successfully deleted.`);
  } catch (error) {
    console.error(`Error deleting user with userId '${userId}':`, error);
    return error;
  }
}
