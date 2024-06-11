import instagramConfig from '../config/instagram';
import querystring from 'querystring';
const axios = require('axios');
const INSTAGRAM_BASE_URL = 'https://api.instagram.com';
const ERROR_CODE = 'ok';
class InstagramApi {
  constructor() {
    this._clientId = instagramConfig.CLIENT_ID;
    this._clientSecret = instagramConfig.CLIENT_SECRET;
    this._redirectUri = instagramConfig.REDIRECT_URI;
  }

  authIg() {
    const authUrl = `${INSTAGRAM_BASE_URL}/oauth/authorize?client_id=${this._clientId}&redirect_uri=${this._redirectUri}&scope=user_profile,user_media&response_type=code`;
    return authUrl;
  }

  async getAccessToken(code) {
    const data = {
      client_id: this._clientId,
      client_secret: this._clientSecret,
      grant_type: 'authorization_code',
      redirect_uri: this._redirectUri,
      code: code
    };

    try {
      const response = await axios.post(
        `${INSTAGRAM_BASE_URL}/oauth/access_token`,
        querystring.stringify(data),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      return response.data.access_token;
    } catch (error) {
      console.error('Error getting access token:', error);
      throw error;
    }
  }
  async getCurrentUser(token) {
    try {
      const response = await axios.get(`https://graph.instagram.com/me`, {
        params: {
          fields: 'id,username,media_count',
          access_token: token
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching current user:', error);
      throw error;
    }
  }

  async fetchMediaData(token) {
    try {
      const response = await axios.get(
        `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp&access_token=${token}`
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching media data:', error);
      throw error;
    }
  }

  refreshToken(refreshToken) {
    const requestBody = new URLSearchParams({
      grant_type: 'refresh_token',
      client_key: this._clientKey,
      client_secret: this._clientSecret,
      refresh_token: refreshToken
    });
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cache-Control': 'no-cache'
    };

    try {
      return axios
        .post(`${TIKTOK_BASE_URL}/oauth/token/`, requestBody, {headers})
        .then(response => {
          return response.data;
        });
    } catch (e) {
      return {access_token: false};
    }
  }

  async fetchMediaById(token, mediaId) {
    const response = await axios.get(
      `${INSTAGRAM_BASE_URL}/${mediaId}?fields=id,caption,media_type,media_url,permalink,timestamp&access_token=${token}`
    );
    return response.data;
  }
}
export default InstagramApi;