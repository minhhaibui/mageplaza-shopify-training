import React, {useEffect, useState, lazy, Suspense} from 'react';
const GlobalPreview = lazy(() => import('../../assets/src/components/Global/GlobalPreview'));

import {useFetchData} from './helppers/getApi'; // Điều chỉnh đường dẫn nếu cần

const App = () => {
  const {data, loading, error} = useFetchData();

  return (
    <>
      <Suspense>
        <GlobalPreview feedConfig={data?.mainFeed} media={data?.media} user={data?.user} />
      </Suspense>
    </>
  );
};

export default App;
