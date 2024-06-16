import {addOneUser, deleteUserById, getUser} from '../repositories/userRepository';

export async function getUserCurrent(ctx) {
  const data = await getUser();
  console.log('userCall api_________________', data);
  ctx.body = {
    data
  };
}
export async function addUser(user, accessToken, tokenExpires) {
  const data = {
    accessToken,
    userId: user.id,
    userName: user.username,
    tokenExpires
  };
  await addOneUser(data);
}

export async function deleteUser(userId) {
  await deleteUserById(userId);
}
