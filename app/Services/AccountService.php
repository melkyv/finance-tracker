<?php

namespace App\Services;

use App\Models\Account;
use Illuminate\Support\Facades\DB;

class AccountService
{
    public function paginate(int $perPage = 10, int $page = 1, ?string $search = null): \Illuminate\Contracts\Pagination\LengthAwarePaginator
    {
        $accounts = auth()->user()->accounts()
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', '%' . $search . '%')
                    ->orWhere('type', 'like', '%' . $search . '%');
            })
            ->orderBy('created_at', 'desc')
            ->paginate($perPage, ['*'], 'page', $page)
            ->withQueryString();

        return $accounts;
    }

    public function create(array $data): Account
    {
        $account = DB::transaction(function () use ($data) {
            return auth()->user()->accounts()->create($data);
        });

        return $account;
    }

    public function update(Account $account, array $data): Account
    {
        DB::transaction(function () use ($account, $data) {
            $account->update($data);
        });

        return $account;
    }

    public function delete(Account $account): bool
    {
        DB::transaction(function () use ($account) {
            $account->delete();
        });

        return true;
    }
}