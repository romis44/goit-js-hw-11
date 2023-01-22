export { fetchPhotos };
import axios from 'axios';
const API_KEY = '32963185-de2a3cc77f96c5f9b997ac31c';
const URL = 'https://pixabay.com/api/?';

async function fetchPhotos(value, page) {
  const response = await axios.get(URL, {
    params: {
      key: API_KEY,
      q: `${value.searchQuery.value}`,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: 40,
      page: `${page}`,
    },
  });
  return await response.data;
}
