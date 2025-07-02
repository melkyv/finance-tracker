import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Chart from '@/components/chart';
import { formatCurrency, formatTimestamp } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DashboardProps, getTypeColor } from '@/types/dashboard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard({ totalBalance, recentTransactions, expensesByCategory, totalIncome, totalOutcome, accountTypes, filters }: DashboardProps) {
    const [accountType, setAccountType] = useState<string>(filters.accountType ?? 'all');

    const handleAccountTypeChange = (value: string) => {
        setAccountType(value);
        router.get('/dashboard', 
            {
                accountType: value
            }, 
            {
                preserveState: true,
                preserveScroll: true
            }
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
                            <Select value={accountType} onValueChange={handleAccountTypeChange}>
                                <SelectTrigger className="h-8 w-[180px]">
                                    <SelectValue placeholder="Select account type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Accounts</SelectItem>
                                    {accountTypes.map((type, index) => (
                                        <SelectItem key={index} value={type.value}>
                                            {type.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">{formatCurrency(totalBalance)}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Total Income (Current Month)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold text-green-500">{formatCurrency(totalIncome)}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Total Outcome (Current Month)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold text-red-500">{formatCurrency(totalOutcome)}</p>
                        </CardContent>
                    </Card>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Expenses by Category</CardTitle>
                    </CardHeader>
                    {expensesByCategory.length === 0 ? <p className="text-center">No data available</p> : (                    
                        <CardContent>
                            <Chart data={expensesByCategory} />
                        </CardContent>                      
                    )}                   
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Transactions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Account</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentTransactions.map((transaction) => (
                                    <TableRow key={transaction.id}>
                                        <TableCell>
                                            {transaction.description?.length > 100
                                                ? `${transaction.description.slice(0, 70)}...`
                                                : transaction.description ?? 'N/A'}
                                        </TableCell>
                                        <TableCell>{transaction.account?.name}</TableCell>
                                        <TableCell>{transaction.category?.name}</TableCell>
                                        <TableCell>
                                            <span className={getTypeColor(transaction.type)}>
                                                {transaction.type_label}
                                            </span>
                                        </TableCell>
                                        <TableCell className={getTypeColor(transaction.type)}>
                                            {formatCurrency(transaction.amount)}
                                        </TableCell>
                                        <TableCell>{formatTimestamp(transaction.created_at)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
