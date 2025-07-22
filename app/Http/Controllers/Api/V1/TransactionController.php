<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Transaction\StoreTransactionRequest;
use App\Http\Requests\Transaction\UpdateTransactionRequest;
use App\Http\Resources\V1\TransactionResource;
use App\Models\Transaction;
use App\Services\TransactionService;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
    public function __construct(private readonly TransactionService $transactionService)
    {
    }

    /**
     * List Transactions
     *
     * Returns a paginated list of the user's transactions.
     * You can filter the results using the 'search' parameter.
     *
     * @queryParam page integer The page number to return. Example: 1
     * @queryParam per_page integer The number of items to return per page. Defaults to 15. Example: 20
     * @queryParam search string A search term to filter by transaction description, account name, or category name. Example: "Salary"
     * @authenticated
     */
    public function index(Request $request)
    {
        $transactions = $this->transactionService->paginate(
            perPage: $request->integer('per_page', 15),
            page: $request->integer('page', 1),
            search: $request->string('search'),
        );

        return TransactionResource::collection($transactions);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTransactionRequest $request)
    {
        $transaction = $this->transactionService->create($request->validated());

        return TransactionResource::make($transaction);
    }

    /**
     * Display the specified resource.
     */
    public function show(Transaction $transaction)
    {
        $this->authorize('owner-transaction', $transaction);

        return TransactionResource::make($transaction->load(['account', 'category']));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTransactionRequest $request, Transaction $transaction)
    {
        $this->authorize('owner-transaction', $transaction);

        $transaction = $this->transactionService->update($transaction, $request->validated());

        return TransactionResource::make($transaction);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Transaction $transaction)
    {
        $this->authorize('owner-transaction', $transaction);

        $this->transactionService->delete($transaction);

        return response()->noContent();
    }
}
