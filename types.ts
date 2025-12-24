
export interface Beneficiary {
  id: number;
  applicationNo: string;
  name: string;
  accountNo: string;
  village: string;
}

export interface SortConfig {
  key: keyof Beneficiary;
  direction: 'asc' | 'desc';
}

export interface NewsItem {
  id: number;
  category: 'village' | 'agri' | 'gujarat';
  title: string;
  content: string;
  image_url?: string;
  date_str: string;
  author: string;
}
