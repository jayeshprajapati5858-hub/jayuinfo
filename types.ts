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