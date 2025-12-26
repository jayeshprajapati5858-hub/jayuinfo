
export interface NewsArticle {
  id: number;
  title: string;
  subtitle?: string;
  content: string;
  category: 'politics' | 'gujarat' | 'sports' | 'entertainment' | 'technology' | 'world' | string;
  image_url?: string;
  author: string;
  views: number;
  is_breaking: boolean;
  date_str: string;
  created_at?: string;
}

export interface Category {
  id: string;
  label: string;
  color: string;
}

export interface Beneficiary {
  id: number;
  applicationNo: string;
  name: string;
  accountNo: string;
  village: string;
}

export interface NewsItem {
  id: number;
  category: string;
  title: string;
  content: string;
  image_url?: string;
  date_str: string;
  author: string;
  created_at?: string;
}
