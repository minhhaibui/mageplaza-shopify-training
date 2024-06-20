import {Box, LegacyCard} from '@shopify/polaris';
import React, {useContext} from 'react';
import {IgContext} from '../../context/IgContext';
import GlobalPreview from '../Global/GlobalPreview';

const Preview = ({feedConfig}) => {
  const {data} = useContext(IgContext);
  console.log('media priview', data);
  return (
    <>
      <LegacyCard title="Preview" sectioned>
        <GlobalPreview
          feedConfig={feedConfig}
          media={data.mediaData}
          user={data.userData}
        ></GlobalPreview>
      </LegacyCard>
    </>
  );
};

export default Preview;
