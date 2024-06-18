import React, {useEffect, useState} from 'react';
import GlobalPreview from '../../assets/src/components/Global/GlobalPreview'; // Điều chỉnh đường dẫn nếu cần
import {getAPI} from './helppers/getApi'; // Điều chỉnh đường dẫn nếu cần

const App = () => {
  const [dataIg, setDataIg] = useState();

  const fetchData = async () => {
    const url =
      'https://localhost:3000/clientApi/instagram?shoifyDomain=avada-tranining.myshopify.com';
    try {
      const data = await getAPI(url);
      if (data) {
        setDataIg(data.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <GlobalPreview feedConfig={dataIg?.mainFeed} media={dataIg?.media} user={dataIg?.user} />
    </>
  );
};

export default App;
