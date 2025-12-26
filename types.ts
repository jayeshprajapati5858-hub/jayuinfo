
export interface NewsArticle {
  title: string;
  description: string;
  content: string;
  url: string;
  image: string;
  publishedAt: string;
  source: {
    name: string;
    url: string;
  };
}

export interface NewsItem {
  id: number;
  category: string;
  title: string;
  content: string;
  image_url?: string;
  date_str: string;
  author: string;
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

export interface DBNewsArticle {
  id: number;
  title: string;
  subtitle?: string;
  content: string;
  category: string;
  image_url?: string;
  author: string;
  date_str: string;
  is_breaking?: boolean;
}
