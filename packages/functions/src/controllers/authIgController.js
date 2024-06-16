import {getCurrentUserIg} from '../helpers/auth';
import InstagramApi from '../helpers/instagramApi';
import {addUser, deleteUser} from './userController';
import {getUser} from '../repositories/userRepository';
const igApi = new InstagramApi();

export const authInstagram = async ctx => {
  try {
    const authUrl = igApi.authIg();
    ctx.redirect(authUrl);
  } catch (error) {
    console.error('Error redirecting to Instagram authentication:', error);
    ctx.status = 500;
    ctx.body = 'Internal server error';
  }
};

export const callbackInstagram = async ctx => {
  try {
    const {code} = ctx.query;
    const shortAccessToken = await igApi.getAccessToken(code);
    const {access_token, expires_in} = await igApi.getLongAccessToken(shortAccessToken);
    const [userIg, currentUser] = await Promise.all([
      igApi.getCurrentUser(access_token),
      getUser()
    ]);
    if (!currentUser) {
      await addUser(userIg, access_token, expires_in);
    } else if (userIg.id !== currentUser.userId) {
      await deleteUser(currentUser.userId);
      await addUser(userIg, access_token, expires_in);
    }

    ctx.body = `
    <script>
    window.opener.localStorage.setItem('logined', '${true}');
      window.close();
    </script>
  `;
  } catch (error) {
    console.error('Error during Instagram authentication:', error);
    ctx.status = 500;
    ctx.body = 'Error during Instagram authentication';
  }
};

export const disconnectInstagram = async ctx => {
  try {
    const {userId} = getCurrentUserIg(ctx);
    await deleteUser(userId);
    ctx.status = 200;
    ctx.body = 'Disconnected successfully';
  } catch (error) {
    console.error('Error during disconnect:', error);
    ctx.status = 500;
    ctx.body = 'Error during disconnect';
  }
};
