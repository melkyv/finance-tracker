import { PaginationData } from "./pagination";

export interface Account {
    id: number;
    name: string;
    balance: number;
    type: string;
    type_label: string;
    user_id: number;
    created_at: string;
    updated_at: string;
}

export interface AccountForm {
  name: string;
  balance: number | '';
  type: string;
  user_id: number;
}

export interface AccountIndexProps {
  accounts: PaginationData<Account>;
  filters: {
    search: string,
    page: number,
    perPage: number
  };
}

export interface AccountViewProps {
  account: Account
}