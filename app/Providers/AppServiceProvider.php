<?php

namespace App\Providers;

use App\Models\Account;
use App\Models\Category;
use App\Models\Report;
use App\Models\Transaction;
use App\Models\User;
use App\Observers\Kafka\ModelObserver;
use App\Observers\TransactionObserver;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Transaction::observe([TransactionObserver::class, ModelObserver::class]);
        User::observe(ModelObserver::class);
        Account::observe(ModelObserver::class);
        Report::observe(ModelObserver::class);
        Category::observe(ModelObserver::class);

        Gate::define('owner-transaction', function (User $user, Transaction $transaction) {
            if ($user->id === $transaction->account->user_id) {
                return true;
            }
            return false;
        });

        Gate::define('owner-account', function (User $user, Account $account) {
            if ($user->id === $account->user_id) {
                return true;
            }
            return false;
        });

        Gate::define('owner-report', function (User $user, Report $report) {
            if ($user->id === $report->user_id) {
                return true;
            }
            return false;
        });

        Gate::define('owner-category', function (User $user, Category $category) {
            if ($user->id === $category->user_id) {
                return true;
            }
            return false;
        });
    }
}
