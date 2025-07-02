import { Transaction } from "./transaction";

export interface DashboardProps {
    totalBalance: number;
    recentTransactions: Transaction[];
    expensesByCategory: {
        name: string;
        total: number;
    }[];
    totalIncome: number;
    totalOutcome: number;
    accountTypes: Array<{ value: string; label: string }>;
    filters: {
        accountType: string;
    }
}

export function getTypeColor(type: string) {
    switch (type) {
        case 'income':
            return 'text-green-500';
        case 'expense':
            return 'text-red-500';
        case 'transfer':
            return 'text-blue-500';
        default:
            return 'text-gray-500';
    }
}