import InstagramApi from '../helpers/instagramApi';
import {addUser, deleteUser} from './userController';
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
    await addUser(access_token, expires_in);
    ctx.state.instagramAccessToken = access_token;

    console.log(
      '____________accessToken in ctx callback____________',
      ctx.state.instagramAccessToken
    );
    ctx.cookies.set('instagram_token', access_token, {
      maxAge: 3 * 60 * 60 * 1000
    });
    ctx.body = `
    <script>
      window.opener.localStorage.setItem('instagram_token', '${access_token}');
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
    // await deleteUser(userId);
    ctx.cookies.set('instagram_token', null, {
      httpOnly: true,
      maxAge: 0 // Immediately expire the cookie
    });
    ctx.status = 200;
    ctx.body = 'Disconnected successfully';
  } catch (error) {
    console.error('Error during disconnect:', error);
    ctx.status = 500;
    ctx.body = 'Error during disconnect';
  }
};
