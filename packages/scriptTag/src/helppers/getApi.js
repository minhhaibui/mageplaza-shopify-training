export async function getAPI(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    if (!data) return null;
    return data;
  } catch (error) {
    throw new Error(`Error fetching data: ${error.message}`);
  }
}
