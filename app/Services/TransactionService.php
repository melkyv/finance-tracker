<?php

namespace App\Services;

use App\Models\Transaction;
use App\Enums\TransactionType;
use Illuminate\Support\Facades\DB;

class TransactionService
{
    public function paginate(int $perPage = 10, int $page = 1, ?string $search = null): \Illuminate\Contracts\Pagination\LengthAwarePaginator
    {
        $query = Transaction::search($search)
            ->query(fn($q) => $q->with(['account', 'category']))
            ->latest('created_at');

        $query->where('user_id', auth()->id());

        $transactions = $query->paginate($perPage, 'page', $page)
                              ->withQueryString();

        return $transactions;
    }

    public function create(array $data): Transaction
    {
        $transaction = DB::transaction(function () use ($data) {
            $account = auth()->user()->accounts()->findOrFail($data['account_id']);

            if (in_array($data['type'], [TransactionType::EXPENSE->value, TransactionType::TRANSFER->value]) && $account->balance < $data['amount']) {
                throw new \Exception('Insufficient balance in account');
            }

            return Transaction::create($data);
        });

        return $transaction;
    }

    public function update(Transaction $transaction, array $data): Transaction
    {
        DB::transaction(function () use ($transaction, $data) {
            $transaction->update($data);
        });

        return $transaction;
    }

    public function delete(Transaction $transaction): bool
    {
        DB::transaction(function () use ($transaction) {
            $transaction->delete();
        });

        return true;
    }

    public function getUserAccounts(): \Illuminate\Database\Eloquent\Collection
    {
        return auth()->user()->accounts()->get();
    }

    public function getUserCategories(): \Illuminate\Database\Eloquent\Collection
    {
        return auth()->user()->categories()->get();
    }

    public function getTotalBalance(?string $accountType = null): float
    {
        $query = auth()->user()->accounts();

        if ($accountType !== 'all') {
            $query->where('type', $accountType);
        }

        return $query->sum('balance');
    }

    public function getRecentTransactions(int $limit = 5): \Illuminate\Database\Eloquent\Collection
    {
        return Transaction::whereHas('account', function ($query) {
                $query->where('user_id', auth()->id());
            })
            ->with(['account', 'category'])
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();
    }

    public function getExpensesByCategory(): \Illuminate\Support\Collection
    {
        return Transaction::whereHas('account', function ($query) {
                $query->where('user_id', auth()->id());
            })
            ->where('type', TransactionType::EXPENSE->value)
            //->whereMonth('created_at', now()->month)
            ->with('category')
            ->select('category_id', DB::raw('SUM(amount) as total'))
            ->groupBy('category_id')
            ->get()
            ->map(function ($item) {
                return [
                    'name' => $item->category->name ?? 'Uncategorized',
                    'total' => $item->total,
                ];
            });
    }

    public function getTotalIncome(): float
    {
        return Transaction::whereHas('account', function ($query) {
            $query->where('user_id', auth()->id());
        })
        ->where('type', TransactionType::INCOME->value)
        ->whereMonth('created_at', now()->month)
        ->sum('amount');
    }

    public function getTotalOutcome(): float
    {
        return Transaction::whereHas('account', function ($query) {
            $query->where('user_id', auth()->id());
        })
        ->whereIn('type', [TransactionType::EXPENSE->value, TransactionType::TRANSFER->value])
        ->whereMonth('created_at', now()->month)
        ->sum('amount');
    }
}