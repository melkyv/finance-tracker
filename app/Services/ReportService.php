<?php

namespace App\Services;

use App\Models\Report;
use App\Models\Transaction;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class ReportService
{
    public function paginate(int $perPage = 10, int $page = 1, ?string $search = null): \Illuminate\Contracts\Pagination\LengthAwarePaginator
    {
        $query = Report::search($search);

        $query->where('user_id', auth()->id());

        $reports = $query->paginate($perPage, 'page', $page)
                         ->withQueryString();

        return $reports;
    }

    public function create(array $data): Report
    {
        $report = DB::transaction(function () use ($data) {
            $data['user_id'] = auth()->id();
            $data['summary'] = $this->generateSummary($data['from_date'], $data['to_date']);
            
            return Report::create($data);
        });

        return $report;
    }

    public function delete(Report $report): bool
    {
        DB::transaction(function () use ($report) {
            $report->delete();
        });

        return true;
    }

    protected function calculateDaysBetween(string $fromDate, string $toDate): int
    {
        $from = Carbon::parse($fromDate)->startOfDay();
        $to = Carbon::parse($toDate)->startOfDay();
        
        // Calculate the difference in days and add 1 to include both start and end dates
        $daysDiff = $from->diffInDays($to);
        
        // Ensure we always return an integer (round to handle any floating point precision issues)
        $totalDays = (int) round($daysDiff) + 1;
        
        // Ensure minimum of 1 day
        return max(1, $totalDays);
    }

    protected function generateSummary(string $fromDate, string $toDate): array
    {
        $userId = auth()->id();
        $from = Carbon::parse($fromDate)->startOfDay();
        $to = Carbon::parse($toDate)->endOfDay();

        // Get transactions in the period
        $transactions = Transaction::whereHas('account', function ($query) use ($userId) {
                $query->where('user_id', $userId);
            })
            ->whereBetween('created_at', [$from, $to])
            ->with(['account', 'category'])
            ->get();

        // Calculate totals
        $totalIncome = $transactions->where('type', 'income')->sum('amount');
        $totalExpenses = $transactions->where('type', 'expense')->sum('amount');
        $netIncome = $totalIncome - $totalExpenses;

        // Group by categories
        $expensesByCategory = $transactions->where('type', 'expense')
            ->groupBy('category.name')
            ->map(function ($items) {
                return [
                    'total' => $items->sum('amount'),
                    'count' => $items->count(),
                    'percentage' => 0 // Will be calculated below
                ];
            });

        // Calculate percentages for categories
        if ($totalExpenses > 0) {
            $expensesByCategory = $expensesByCategory->map(function ($item) use ($totalExpenses) {
                $item['percentage'] = round(($item['total'] / $totalExpenses) * 100, 2);
                return $item;
            });
        }

        // Group by accounts
        $transactionsByAccount = $transactions->groupBy('account.name')
            ->map(function ($items) {
                return [
                    'income' => $items->where('type', 'income')->sum('amount'),
                    'expenses' => $items->where('type', 'expense')->sum('amount'),
                    'count' => $items->count(),
                ];
            });

        // Monthly breakdown (if period spans multiple months)
        $monthlyData = [];
        $current = $from->copy()->startOfMonth();
        while ($current->lte($to)) {
            $monthTransactions = $transactions->filter(function ($transaction) use ($current) {
                return $transaction->created_at->month === $current->month && 
                       $transaction->created_at->year === $current->year;
            });

            $monthlyData[$current->format('Y-m')] = [
                'income' => $monthTransactions->where('type', 'income')->sum('amount'),
                'expenses' => $monthTransactions->where('type', 'expense')->sum('amount'),
                'transactions_count' => $monthTransactions->count(),
            ];

            $current->addMonth();
        }

        // Top categories by expense
        $topCategories = $expensesByCategory->sortByDesc('total')->take(5);

        // Recent transactions (last 10)
        $recentTransactions = $transactions->sortByDesc('created_at')->take(10)->map(function ($transaction) {
            return [
                'id' => $transaction->id,
                'description' => $transaction->description,
                'amount' => $transaction->amount,
                'type' => $transaction->type,
                'account' => $transaction->account->name,
                'category' => $transaction->category->name,
                'date' => $transaction->created_at->format('Y-m-d H:i:s'),
            ];
        });

        return [
            'period' => [
                'from' => $from->format('Y-m-d'),
                'to' => $to->format('Y-m-d'),
                'days' => $this->calculateDaysBetween($fromDate, $toDate),
            ],
            'totals' => [
                'income' => $totalIncome,
                'expenses' => $totalExpenses,
                'net_income' => $netIncome,
                'transactions_count' => $transactions->count(),
            ],
            'expenses_by_category' => $expensesByCategory->toArray(),
            'transactions_by_account' => $transactionsByAccount->toArray(),
            'monthly_data' => $monthlyData,
            'top_categories' => $topCategories->toArray(),
            'recent_transactions' => $recentTransactions->values()->toArray(),
            'generated_at' => now()->format('Y-m-d H:i:s'),
        ];
    }

    public function generateQuickReport(string $type): array
    {
        $now = Carbon::now();
        
        [$fromDate, $toDate] = match($type) {
            'monthly' => [$now->copy()->startOfMonth()->format('Y-m-d'), $now->copy()->endOfMonth()->format('Y-m-d')],
            'yearly' => [$now->copy()->startOfYear()->format('Y-m-d'), $now->copy()->endOfYear()->format('Y-m-d')],
            default => [$now->copy()->subDays(30)->format('Y-m-d'), $now->copy()->format('Y-m-d')]
        };

        return [
            'from_date' => $fromDate,
            'to_date' => $toDate,
            'type' => $type,
            'title' => $this->generateDefaultTitle($type),
        ];
    }

    protected function generateDefaultTitle(string $type): string
    {
        $now = Carbon::now();
        
        return match($type) {
            'monthly' => "Monthly Report - {$now->format('F Y')}",
            'yearly' => "Yearly Report - {$now->format('Y')}",
            'custom' => "Custom Report - {$now->format('M d, Y')}",
            default => "Report - {$now->format('M d, Y')}"
        };
    }
}
