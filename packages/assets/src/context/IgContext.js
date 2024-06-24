import React, {createContext, useState, useEffect} from 'react';
import {fetchAuthenticatedApi} from '../helpers';
import {useFetchApi} from '../hooks/api/useFetchApi';
export const IgContext = createContext();

export const IgProvider = ({children}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [data, setData] = useState([]);
  const {fetchApi} = useFetchApi({
    url: '/feed'
  });
  console.log('media Context', data);
  useEffect(() => {
    const logined = localStorage.getItem('logined');
    if (logined) {
      setIsConnected(true);
      fetchData();
    }
  }, []);

  const fetchData = async () => {
    try {
      const [resMedia, resUser] = await Promise.all([fetchApi('/media'), fetchApi('/user')]);
      const mediaData = resMedia.data;
      const userData = resUser.data;
      setData({mediaData, userData});
    } catch (error) {
      console.error('Error fetching media data:', error);
    }
  };

  return (
    <IgContext.Provider
      value={{
        isConnected,
        data,
        setData,
        setIsConnected,
        fetchData
      }}
    >
      {children}
    </IgContext.Provider>
  );
};
