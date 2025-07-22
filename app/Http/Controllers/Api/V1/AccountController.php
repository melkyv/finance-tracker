<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Account\StoreUpdateAccountRequest;
use App\Http\Resources\V1\AccountResource;
use App\Models\Account;
use App\Services\AccountService;
use Illuminate\Http\Request;

class AccountController extends Controller
{
    public function __construct(private readonly AccountService $accountService)
    {
    }

    /**
     * List Accounts
     *
     * Returns a paginated list of the user's accounts.
     * You can filter the results using the 'search' parameter.
     *
     * @queryParam page integer The page number to return. Example: 1
     * @queryParam per_page integer The number of items to return per page. Defaults to 15. Example: 20
     * @queryParam search string A search term to filter by account name or type. Example: "Bank"
     * @authenticated
     */
    public function index(Request $request)
    {
        $accounts = $this->accountService->paginate(
            perPage: $request->integer('per_page', 15),
            page: $request->integer('page', 1),
            search: $request->string('search'),
        );

        return AccountResource::collection($accounts);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUpdateAccountRequest $request)
    {
        $account = $this->accountService->create($request->validated());

        return AccountResource::make($account);
    }

    /**
     * Display the specified resource.
     */
    public function show(Account $account)
    {
        $this->authorize('owner-account', $account);

        return AccountResource::make($account);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(StoreUpdateAccountRequest $request, Account $account)
    {
        $this->authorize('owner-account', $account);

        $account = $this->accountService->update($account, $request->validated());

        return AccountResource::make($account);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Account $account)
    {
        $this->authorize('owner-account', $account);

        $this->accountService->delete($account);

        return response()->noContent();
    }
}
