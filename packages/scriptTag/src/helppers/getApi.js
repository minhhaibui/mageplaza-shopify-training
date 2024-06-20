import {useState, useEffect} from 'react';

export async function getAPI(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      return response.status;
    }
    const data = await response.json();
    if (!data) return null;
    return data;
  } catch (error) {
    throw new Error(`Error fetching data: ${error.message}`);
  }
}

export const useFetchData = (
  url = 'https://localhost:3000/clientApi/instagram?shoifyDomain=avada-tranining.myshopify.com'
) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          return null;
        }
        const result = await response.json();
        setData(result.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return {data, loading, error};
};
