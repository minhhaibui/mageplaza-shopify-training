import {Button, Card, InlineStack, Text} from '@shopify/polaris';
import React, {useContext} from 'react';

import {IgContext} from '../../context/IgContext';
import {fetchAuthenticatedApi} from '../../helpers';
const LoginIg = () => {
  const {data, setData, isConnected, setIsConnected, fetchData} = useContext(IgContext);
  const handleConnectIg = () => {
    const width = 600;
    const height = 700;
    const left = window.innerWidth / 2 - width / 2;
    const top = window.innerHeight / 2 - height / 2;

    const popup = window.open(
      'https://localhost:3000/authInsApi/auth',
      'Instagram Auth',
      `width=${width},height=${height},top=${top},left=${left}`
    );

    if (popup) {
      const interval = setInterval(() => {
        if (popup.closed) {
          clearInterval(interval);
          const logined = localStorage.getItem('logined');
          if (logined) {
            setIsConnected(true);
            fetchData();
          }
        }
      }, 1000);
    }
  };

  const handleDisconnect = async () => {
    try {
      await axios.post('https://localhost:3000/authInsApi/disconnect');
      setIsConnected(false);
      localStorage.removeItem('logined');
      setData([]);
    } catch (error) {
      console.error('Error during disconnect:', error);
    }
  };

  const handleSyncMedia = async () => {
    try {
      console.log('sync media');
      const response = await fetchAuthenticatedApi('/syncMedia', {method: 'PUT'});
      setData(response.data);
    } catch (error) {
      console.error('Error fetching media data:', error);
    }
  };
  return (
    <>
      <Card>
        {!isConnected ? (
          <Button onClick={handleConnectIg} variant="primary">
            Connect with Instagram
          </Button>
        ) : (
          <InlineStack gap={200}>
            <Text fontWeight="bold">Connected to @{data?.userData?.userName}</Text>
            <Button variant="plain" onClick={handleConnectIg} textAlign="center">
              Change Account
            </Button>
            <Button variant="plain" textAlign="center" onClick={handleDisconnect}>
              Disconnect
            </Button>
            <Button variant="plain" textAlign="center" onClick={handleSyncMedia}>
              Sync
            </Button>
          </InlineStack>
        )}
      </Card>
    </>
  );
};

export default LoginIg;
