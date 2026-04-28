export interface Transaction {
  Oid: string;
  Company: string;
  CompanyName: string;
  Code: string;
  Date: string;
  Account: string;
  AccountName: string;
  Status?: string;
  StatusName?: string;
  Note: string | null;
}

export interface TransactionFormData {
  Date: string;
  Note: string | null;
}

export interface TransactionDetail {
  Oid: string;
  index?: string | number | null;
  Item: string;
  ItemName: string;
  Quantity: string | number;
  ItemUnit: string;
  ItemUnitName: string;
  Note: string | null;
}

export interface TransactionDetailFormData {
  Item: string;
  ItemName: string;
  Quantity: string;
  ItemUnit: string;
  ItemUnitName: string;
  Note: string | null;
}

export interface TransactionState {
  transactions: Transaction[];
  selectedTransaction: Transaction | null;
  details: TransactionDetail[];
  loading: boolean;
  error: string | null;
}
