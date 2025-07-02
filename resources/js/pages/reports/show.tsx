import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Head, Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Calendar, DollarSign, TrendingUp, TrendingDown, FileText, ArrowLeft } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { getTypeColor, ReportShowProps } from "@/types/report";

export default function ReportShow({ report }: ReportShowProps) {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Reports',
      href: '/reports',
    },
    {
      title: report.title,
      href: `/reports/${report.id}`,
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={report.title} />

      <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" asChild>
              <Link href={route('reports.index')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Reports
              </Link>
            </Button>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold">{report.title}</h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Badge variant="secondary" className={`text-${getTypeColor(report.type)}-600`}>
                  {report.type_label}
                </Badge>
                <span>•</span>
                <Calendar className="h-4 w-4" />
                <span>
                  {new Date(report.summary.period.from).toLocaleDateString()} - {new Date(report.summary.period.to).toLocaleDateString()}
                </span>
                <span>•</span>
                <span>{report.summary.period.days} days</span>
              </div>
            </div>
          </div>
          <Button asChild>
            <a href={route('reports.download', report.id)} target="_blank" rel="noopener noreferrer">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </a>
          </Button>
        </div>

        {/* Financial Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Income</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(report.summary.totals.income)}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(report.summary.totals.expenses)}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net Income</CardTitle>
              <DollarSign className={`h-4 w-4 ${report.summary.totals.net_income >= 0 ? 'text-green-600' : 'text-red-600'}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${report.summary.totals.net_income >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(report.summary.totals.net_income)}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Transactions</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {report.summary.totals.transactions_count}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Top Categories */}
          {Object.keys(report.summary.top_categories).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Top Expense Categories</CardTitle>
                <CardDescription>
                  Categories with highest spending during this period
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="text-right">%</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(report.summary.top_categories).map(([category, data]) => (
                      <TableRow key={category}>
                        <TableCell className="font-medium">{category}</TableCell>
                        <TableCell className="text-right text-red-600">
                          {formatCurrency(data.total)}
                        </TableCell>
                        <TableCell className="text-right">
                          {data.percentage}%
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* Account Activity */}
          {Object.keys(report.summary.transactions_by_account).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Activity by Account</CardTitle>
                <CardDescription>
                  Financial activity breakdown per account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Account</TableHead>
                      <TableHead className="text-right">Income</TableHead>
                      <TableHead className="text-right">Expenses</TableHead>
                      <TableHead className="text-right">Net</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(report.summary.transactions_by_account).map(([account, data]) => {
                      const net = data.income - data.expenses;
                      return (
                        <TableRow key={account}>
                          <TableCell className="font-medium">{account}</TableCell>
                          <TableCell className="text-right text-green-600">
                            {formatCurrency(data.income)}
                          </TableCell>
                          <TableCell className="text-right text-red-600">
                            {formatCurrency(data.expenses)}
                          </TableCell>
                          <TableCell className={`text-right ${net >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatCurrency(net)}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Monthly Breakdown (if available) */}
        {Object.keys(report.summary.monthly_data).length > 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Monthly Breakdown</CardTitle>
              <CardDescription>
                Monthly financial summary for the selected period
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Month</TableHead>
                    <TableHead className="text-right">Income</TableHead>
                    <TableHead className="text-right">Expenses</TableHead>
                    <TableHead className="text-right">Net</TableHead>
                    <TableHead className="text-right">Transactions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(report.summary.monthly_data).map(([month, data]) => {
                    const net = data.income - data.expenses;
                    const monthDate = new Date(month + '-01');
                    return (
                      <TableRow key={month}>
                        <TableCell className="font-medium">
                          {monthDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                        </TableCell>
                        <TableCell className="text-right text-green-600">
                          {formatCurrency(data.income)}
                        </TableCell>
                        <TableCell className="text-right text-red-600">
                          {formatCurrency(data.expenses)}
                        </TableCell>
                        <TableCell className={`text-right ${net >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(net)}
                        </TableCell>
                        <TableCell className="text-right">
                          {data.transactions_count}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Recent Transactions */}
        {report.summary.recent_transactions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>
                Last 10 transactions in the selected period
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Account</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {report.summary.recent_transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        {new Date(transaction.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {transaction.description || 'N/A'}
                      </TableCell>
                      <TableCell>{transaction.account}</TableCell>
                      <TableCell>{transaction.category}</TableCell>
                      <TableCell className={`text-right ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(transaction.amount)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Report Metadata */}
        <Card>
          <CardHeader>
            <CardTitle>Report Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2 md:grid-cols-2">
            <div>
              <span className="text-sm font-medium">Generated:</span>
              <p className="text-sm text-muted-foreground">
                {new Date(report.summary.generated_at).toLocaleString()}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium">Period:</span>
              <p className="text-sm text-muted-foreground">
                {report.summary.period.days} days ({new Date(report.summary.period.from).toLocaleDateString()} - {new Date(report.summary.period.to).toLocaleDateString()})
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
