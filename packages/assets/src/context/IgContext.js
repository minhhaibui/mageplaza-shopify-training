// IgContext.js
import React, {createContext, useState, useEffect} from 'react';
import axios from 'axios';
import {fetchAuthenticatedApi} from '../helpers';
export const IgContext = createContext();

export const IgProvider = ({children}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [media, setMedia] = useState([]);
  console.log('media Context', media);
  useEffect(() => {
    const token = localStorage.getItem('instagram_token');
    if (token) {
      setIsConnected(true);
      fetchMediaData();
    }
  }, []);

  const fetchMediaData = async () => {
    try {
      const response = await fetchAuthenticatedApi('/media');
      setMedia(response.data);
    } catch (error) {
      console.error('Error fetching media data:', error);
    }
  };

  const handleDisconnect = async () => {
    try {
      await axios.post('https://localhost:3000/authInsApi/disconnect');
      setIsConnected(false);
      setMedia([]);
      localStorage.removeItem('instagram_token');
    } catch (error) {
      console.error('Error during disconnect:', error);
    }
  };

  return (
    <IgContext.Provider
      value={{isConnected, media, setMedia, setIsConnected, fetchMediaData, handleDisconnect}}
    >
      {children}
    </IgContext.Provider>
  );
};
