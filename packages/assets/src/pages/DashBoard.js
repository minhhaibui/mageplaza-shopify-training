import React, {useEffect, useState} from 'react';
import {Grid, Page} from '@shopify/polaris';
import {fetchAuthenticatedApi} from '../helpers';
import MainFeed from '../components/DashBoard/MainFeed';
import Preview from '../components/DashBoard/Preview';
import {IgProvider} from '../context/IgContext';

const DashBoard = () => {
  const [feedConfig, setFeedConfig] = useState({});
  let feedDefault = {};
  async function callApi() {
    const data = await fetchAuthenticatedApi('/feed');
    if (data) {
      setFeedConfig(data.feed);
    }
  }
  useEffect(() => {
    callApi();
  }, []);

  if (feedConfig) {
    feedDefault = feedConfig;
  }
  console.log(feedConfig);
  const handleSaveFeed = async newConfig => {
    setFeedConfig(newConfig);
    await fetchAuthenticatedApi('/feed', {body: feedConfig, method: 'PUT'});
  };

  return (
    <Page fullWidth title="Main feed">
      <IgProvider>
        <Grid>
          <Grid.Cell columnSpan={{xs: 6, sm: 6, md: 3, lg: 4, xl: 4}}>
            <MainFeed onSaveFeed={handleSaveFeed} feedDefault={feedDefault}></MainFeed>
          </Grid.Cell>
          <Grid.Cell columnSpan={{xs: 6, sm: 6, md: 3, lg: 8, xl: 8}}>
            <Preview feedConfig={feedConfig}></Preview>
          </Grid.Cell>
        </Grid>
      </IgProvider>
    </Page>
  );
};

export default DashBoard;
