import { useEffect, useState } from "react";

function useFetchApi({ url }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  async function fetchData() {
    try {
      setLoading(true);
      const respone = await fetch(url);
      const resData = await respone.json();
      setData(resData);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);
  return {
    data,
    setData,
    loading,
  };
}

export default useFetchApi;
