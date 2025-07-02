import { PaginationData } from "./pagination";

interface ReportSummary {
  period: {
    from: string;
    to: string;
    days: number;
  };
  totals: {
    income: number;
    expenses: number;
    net_income: number;
    transactions_count: number;
  };
  expenses_by_category: Record<string, {
    total: number;
    count: number;
    percentage: number;
  }>;
  transactions_by_account: Record<string, {
    income: number;
    expenses: number;
    count: number;
  }>;
  monthly_data: Record<string, {
    income: number;
    expenses: number;
    transactions_count: number;
  }>;
  top_categories: Record<string, {
    total: number;
    count: number;
    percentage: number;
  }>;
  recent_transactions: Array<{
    id: number;
    description: string;
    amount: number;
    type: string;
    account: string;
    category: string;
    date: string;
  }>;
  generated_at: string;
}

export interface ReportIndexProps {
  reports: PaginationData<Report>;
  filters: {
    search: string;
    page: number;
    perPage: number;
  };
}

export interface Report {
  id: number;
  title: string;
  type: string;
  type_label: string;
  from_date: string;
  to_date: string;
  summary: ReportSummary;
  created_at: string;
}

export interface ReportShowProps {
  report: Report;
}

interface ReportType {
  value: string;
  label: string;
}

interface QuickReport {
  title: string;
  type: string;
  from_date: string;
  to_date: string;
}

export interface ReportCreateProps {
  reportTypes: ReportType[];
  quickReport?: QuickReport;
}

export const getTypeColor = (type: string): string => {
  switch (type) {
    case 'monthly':
      return 'blue';
    case 'yearly':
      return 'green';
    case 'custom':
      return 'purple';
    default:
      return 'gray';
  }
};

export const getIndexTypeColor = (type: string): string => {
  switch (type) {
    case 'monthly':
      return 'text-blue-600';
    case 'yearly':
      return 'text-green-600';
    case 'custom':
      return 'text-purple-600';
    default:
      return 'text-gray-600';
  }
};

export const generateDefaultTitle = (type: string) => {
    const now = new Date();
    switch (type) {
        case 'monthly':
            return `Monthly Report - ${now.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}`;
        case 'yearly':
            return `Yearly Report - ${now.getFullYear()}`;
        case 'custom':
            return `Custom Report - ${now.toLocaleDateString('pt-BR', { month: 'short', day: 'numeric', year: 'numeric' })}`;
        default:
            return '';
    }
};