
const API_KEY = '017423a12b65fd9043317be57784cc28'; // Your provided key
const BASE_URL = 'https://gnews.io/api/v4';

export const fetchTopHeadlines = async (category: string = 'general') => {
  try {
    // lang=gu for Gujarati, country=in for India
    const response = await fetch(`${BASE_URL}/top-headlines?category=${category}&lang=gu&country=in&max=10&apikey=${API_KEY}`);
    const data = await response.json();
    if (data.articles) {
      return data.articles;
    }
    return [];
  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
};

export const searchNews = async (query: string) => {
  try {
    const response = await fetch(`${BASE_URL}/search?q=${query}&lang=gu&country=in&max=10&apikey=${API_KEY}`);
    const data = await response.json();
    return data.articles || [];
  } catch (error) {
    console.error("Error searching news:", error);
    return [];
  }
};
