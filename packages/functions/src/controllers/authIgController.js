import InstagramApi from '../helpers/instagramApi';

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
    const accessToken = await igApi.getAccessToken(code);
    ctx.cookies.set('instagram_token', accessToken, {
      maxAge: 3 * 60 * 60 * 1000
    });
    ctx.body = `
    <script>
      window.opener.localStorage.setItem('instagram_token', '${accessToken}');
      window.close();
    </script>
  `;
  } catch (error) {
    console.error('Error during Instagram authentication:', error);
    ctx.status = 500;
    ctx.body = 'Error during Instagram authentication';
  }
};

export const getMedia = async ctx => {
  const token = ctx.cookies.get('instagram_token');
  try {
    const [media, currentUser] = await Promise.all([
      igApi.fetchMediaData(token),
      igApi.getCurrentUser(token)
    ]);
    ctx.body = {
      success: true,
      data: {media, currentUser}
    };
  } catch (error) {
    console.error('Error fetching media data:', error);
    ctx.status = 500;
    ctx.body = 'Error fetching media data';
  }
};

export const disconnectInstagram = async ctx => {
  try {
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
