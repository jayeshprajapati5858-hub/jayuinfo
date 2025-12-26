
const API_KEY = '017423a12b65fd9043317be57784cc28'; // Note: Free tier has 100 requests/day limit.
const BASE_URL = 'https://gnews.io/api/v4';

// Cache configuration
const CACHE_DURATION = 30 * 60 * 1000; // 30 Minutes

interface CacheEntry {
  timestamp: number;
  data: any[];
}

const getFromCache = (key: string): any[] | null => {
  const cached = localStorage.getItem(key);
  if (!cached) return null;

  try {
    const entry: CacheEntry = JSON.parse(cached);
    const now = Date.now();
    if (now - entry.timestamp < CACHE_DURATION) {
      return entry.data;
    }
  } catch (e) {
    console.error("Cache parsing error", e);
  }
  return null;
};

const saveToCache = (key: string, data: any[]) => {
  const entry: CacheEntry = {
    timestamp: Date.now(),
    data: data,
  };
  localStorage.setItem(key, JSON.stringify(entry));
};

export const fetchTopHeadlines = async (category: string = 'general') => {
  const cacheKey = `gnews_${category}`;
  
  // 1. Try Cache First
  const cachedData = getFromCache(cacheKey);
  if (cachedData) {
    console.log(`Serving ${category} news from Cache`);
    return cachedData;
  }

  // 2. If no cache, fetch from API
  try {
    console.log(`Fetching ${category} news from API...`);
    // Added 'max=9' to save bandwidth and fit grid better
    const response = await fetch(`${BASE_URL}/top-headlines?category=${category}&lang=gu&country=in&max=9&apikey=${API_KEY}`);
    
    if (!response.ok) {
       // Handle API Limit (403) or Server Error
       if (response.status === 403) {
         console.warn("GNews API Limit Reached or Invalid Key.");
         return []; 
       }
       throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    if (data.articles) {
      saveToCache(cacheKey, data.articles);
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
