<?php

namespace App\Http\Controllers;

use App\Enums\TransactionType;
use App\Http\Requests\Transaction\{
    StoreTransactionRequest,
    UpdateTransactionRequest
};
use App\Models\Transaction;
use App\Services\TransactionService;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class TransactionController extends Controller
{
    public function __construct(protected TransactionService $service)
    {}
    
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $filters = request()->all();

        $transactions = $this->service->paginate(
            $filters['perPage'] ?? 5, 
            $filters['page'] ?? 1, 
            $filters['search'] ?? null
        );

        return Inertia::render('transactions/index', compact('transactions', 'filters'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $accountId = request('account_id') ?? null;
        $accounts = $this->service->getUserAccounts();
        $categories = $this->service->getUserCategories();
        $transactionTypes = TransactionType::getValuesWithLabels();

        return Inertia::render('transactions/create', compact('accounts', 'categories', 'transactionTypes', 'accountId'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTransactionRequest $request)
    {
        try {
            $this->service->create($request->validated());
  
            return to_route('transactions.index', ['page' => 1])->with('success', 'Transaction created successfully!');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Transaction $transaction)
    {
        abort_if(Gate::denies('owner-transaction', $transaction), 403, 'Unauthorized access to this transaction.');

        $transaction->load(['account', 'category']);
        
        return Inertia::render('transactions/show', compact('transaction'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Transaction $transaction)
    {
        abort_if(Gate::denies('owner-transaction', $transaction), 403, 'Unauthorized access to this transaction.');

        $categories = $this->service->getUserCategories();

        $transaction->load(['account', 'category']);

        return Inertia::render('transactions/edit', compact('transaction', 'categories'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTransactionRequest $request, Transaction $transaction)
    {
        abort_if(Gate::denies('owner-transaction', $transaction), 403, 'Unauthorized access to this transaction.');

        try {
            $this->service->update($transaction, $request->validated());

            return to_route('transactions.index')->with('success', 'Transaction updated successfully!');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }    
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Transaction $transaction)
    {
        abort_if(Gate::denies('owner-transaction', $transaction), 403, 'Unauthorized access to this transaction.');

        try {
            $this->service->delete($transaction);

            return to_route('transactions.index')->with('success', 'Transaction deleted successfully!');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }
}