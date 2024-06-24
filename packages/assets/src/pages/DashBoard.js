import React, {useContext, useEffect, useState} from 'react';
import {Grid, Page} from '@shopify/polaris';
import {fetchAuthenticatedApi} from '../helpers';
import MainFeed from '../components/DashBoard/MainFeed';
import Preview from '../components/DashBoard/Preview';
import {IgProvider} from '../context/IgContext';
import {useFetchApi} from '../hooks/api/useFetchApi';

const DashBoard = () => {
  // const [feedConfig, setFeedConfig] = useState({});
  const {data, setData} = useFetchApi({
    url: '/feed'
  });
  // async function callApi() {
  //   const data = await fetchAuthenticatedApi('/feed');
  //   if (data) {
  //     setFeedConfig(data.feed);
  //   }
  // }

  const handleSaveFeed = async newConfig => {
    setData(newConfig.feed);
    console.log('newconfig', newConfig);
    await fetchAuthenticatedApi('/feed', {body: newConfig, method: 'PUT'});
  };

  return (
    <Page fullWidth title="Main feed">
      <IgProvider>
        <Grid>
          <Grid.Cell columnSpan={{xs: 6, sm: 6, md: 3, lg: 4, xl: 4}}>
            <MainFeed onSaveFeed={handleSaveFeed} feedDefault={data}></MainFeed>
          </Grid.Cell>
          <Grid.Cell columnSpan={{xs: 6, sm: 6, md: 3, lg: 8, xl: 8}}>
            <Preview feedConfig={data}></Preview>
          </Grid.Cell>
        </Grid>
      </IgProvider>
    </Page>
  );
};

export default DashBoard;
