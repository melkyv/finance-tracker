import { PaginationData } from "./pagination";
import { Account } from "./account";
import { Category } from "./category";

export interface Transaction {
    id: number;
    account_id: number;
    category_id: number;
    description: string;
    amount: number;
    type: 'income' | 'expense' | 'transfer';
    type_label: string;
    account?: Account;
    category?: Category;
    created_at: string;
    updated_at: string;
}

export interface TransactionForm {
    account_id: number | '';
    category_id: number | '';
    description: string;
    amount: number | '';
    type: string;
}

export interface TransactionType {
    value: string;
    label: string;
}

export interface TransactionIndexProps {
    transactions: PaginationData<Transaction>;
    filters: {
        search: string,
        page: number,
        perPage: number
    };
}

export interface TransactionViewProps {
    transaction: Transaction
}

export interface TransactionCreateProps {
    accounts: Account[];
    categories: Category[];
    transactionTypes: TransactionType[];
    accountId?: number;
}

export interface TransactionEditProps {
    transaction: Transaction;
    categories: Category[];
}

export const getTypeColor = (type: string) => {
    switch (type) {
        case 'income':
            return 'text-green-600';
        case 'expense':
            return 'text-red-600';
        case 'transfer':
            return 'text-blue-600';
        default:
            return 'text-gray-600';
    }
}