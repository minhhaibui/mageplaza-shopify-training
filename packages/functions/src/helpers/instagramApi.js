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

  async getLongAccessToken(shortLivedToken) {
    const data = {
      grant_type: 'ig_exchange_token',
      client_secret: this._clientSecret,
      access_token: shortLivedToken
    };

    try {
      const response = await axios.get(`https://graph.instagram.com/access_token`, {
        params: data,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error getting long-lived access token:', error);
      throw error;
    }
  }

  async refreshAccessToken(longLivedToken) {
    const params = {
      grant_type: 'ig_refresh_token',
      access_token: longLivedToken
    };

    try {
      const response = await axios.get('https://graph.instagram.com/refresh_access_token', {
        params: params
      });

      return response.data;
    } catch (error) {
      console.error('Error refreshing access token:', error);
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

  async fetchMediaById(token, mediaId) {
    const response = await axios.get(
      `${INSTAGRAM_BASE_URL}/${mediaId}?fields=id,caption,media_type,media_url,permalink,timestamp&access_token=${token}`
    );
    return response.data;
  }
}
export default InstagramApi;
