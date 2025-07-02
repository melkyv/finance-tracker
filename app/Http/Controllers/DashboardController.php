<?php

namespace App\Http\Controllers;

use App\Services\TransactionService;
use Inertia\Inertia;
use App\Enums\AccountType;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function __construct(protected TransactionService $service)
    {}

    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $filters = $request->all();

        $totalBalance = $this->service->getTotalBalance($filters['accountType'] ?? 'all');
        $recentTransactions = $this->service->getRecentTransactions();
        $expensesByCategory = $this->service->getExpensesByCategory();
        $totalIncome = $this->service->getTotalIncome();
        $totalOutcome = $this->service->getTotalOutcome();
        $accountTypes = AccountType::getValuesWithLabels();

        return Inertia::render('dashboard', compact('totalBalance', 'recentTransactions', 'expensesByCategory', 'totalIncome', 'totalOutcome', 'accountTypes', 'filters'));
    }
}