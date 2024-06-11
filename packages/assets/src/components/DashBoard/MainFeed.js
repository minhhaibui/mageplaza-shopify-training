import React, {useEffect, useState} from 'react';
import {Box, BlockStack, Card, Button, FormLayout, TextField, Select} from '@shopify/polaris';
// import axios from 'axios';
import LoginIg from './LoginIg';

const MainFeed = ({onSaveFeed, feedDefault}) => {
  const [feed, setFeed] = useState(feedDefault);

  useEffect(() => {
    if (feedDefault) {
      setFeed(feedDefault);
    }
  }, [feedDefault]);

  const handleInputChange = field => value => {
    setFeed(prevFeed => ({
      ...prevFeed,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    onSaveFeed(feed);
  };

  return (
    <Box>
      <BlockStack gap={1000}>
        <LoginIg></LoginIg>
        <Card>
          <FormLayout>
            <TextField
              label="Feed title"
              value={feed.title}
              onChange={handleInputChange('title')}
              autoComplete="off"
            />
            <TextField
              min={0}
              type="number"
              label="Post spacing"
              value={feed.postSpacing}
              onChange={handleInputChange('postSpacing')}
            />
            <Select
              label="Layout"
              options={[
                {label: 'Grid', value: 'Grid'},
                {label: 'Flex', value: 'Flex'}
              ]}
              value={feed.layout}
              onChange={value => handleInputChange('layout')(value)}
            />
            <FormLayout.Group condensed>
              <TextField
                min={0}
                type="number"
                label="Number of rows"
                value={feed.rows}
                onChange={handleInputChange('rows')}
              />
              <TextField
                min={0}
                type="number"
                label="Number of columns"
                value={feed.columns}
                onChange={handleInputChange('columns')}
              />
            </FormLayout.Group>
            <Button fullWidth variant="primary" onClick={handleSubmit}>
              Save Feed
            </Button>
          </FormLayout>
        </Card>
      </BlockStack>
    </Box>
  );
};

export default MainFeed;
