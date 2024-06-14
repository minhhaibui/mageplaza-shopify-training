import InstagramApi from '../helpers/instagramApi';
import {addOneUser, deleteUserById} from '../repositories/userRepository';

const igApi = new InstagramApi();

export async function addUser(accessToken, tokenExpires) {
  const user = await igApi.getCurrentUser(accessToken);
  ctx.state.userCurrent = user;
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
