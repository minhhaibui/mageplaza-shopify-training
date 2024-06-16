import React from 'react';
import ReactDOM from 'react-dom';
import GlobalPreview from '../../assets/src/components/Global/GlobalPreview';

const App = () => {
  const [data, setData] = useState();
  const fetchData = async () => {
    const url =
      'https://localhost:3000/clientApi/instagram?shoifyDomain=avada-tranining.myshopify.com';
    const data = await getAPI(url);
    if (data) {
      setData(data.data);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div>
      <GlobalPreview
        feedConfig={data?.mainFeed}
        media={data?.media}
        user={data?.user}
      ></GlobalPreview>
    </div>
  );
};

ReactDOM.render(<App />, document.body);
