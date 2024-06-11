import {Button, Card, InlineStack, Text} from '@shopify/polaris';
import React, {useContext} from 'react';

import {IgContext} from '../../context/IgContext';
const LoginIg = () => {
  const {
    media,
    handleSyncMedia,
    isConnected,
    setIsConnected,
    fetchMediaData,
    handleDisconnect
  } = useContext(IgContext);
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
          const token = localStorage.getItem('instagram_token');
          if (token) {
            setIsConnected(true);
            fetchMediaData(token);
          }
        }
      }, 1000);
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
            <Text fontWeight="bold">Connected to @{media?.userId}</Text>
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
