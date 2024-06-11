import {Box, Grid, Image, LegacyCard} from '@shopify/polaris';
import React, {useContext} from 'react';
import {IgContext} from '../../context/IgContext';

const Preview = ({feedConfig}) => {
  const columns = Math.floor(12 / +feedConfig?.columns);
  const {media} = useContext(IgContext);
  console.log('media priview', media);
  return (
    <Box>
      <LegacyCard title="Preview" sectioned>
        <Grid>
          {media?.media?.map(item => (
            <Grid.Cell
              key={item.id}
              columnSpan={{
                xs: 6,
                sm: 6,
                md: 3,
                lg: columns,
                xl: columns
              }}
            >
              <Box>
                {item.media_type === 'IMAGE' && (
                  <Image width={'100%'} objectFit={'cover'} source={item.media_url} />
                )}
                {item.media_type === 'VIDEO' && (
                  <video controls width={'100%'} height={'100%'} src={item.media_url} />
                )}
              </Box>
            </Grid.Cell>
          ))}
        </Grid>
      </LegacyCard>
    </Box>
  );
};

export default Preview;
