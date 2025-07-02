<?php

namespace App\Http\Controllers;

use App\Http\Requests\Account\StoreUpdateAccountRequest;
use App\Models\Account;
use App\Services\AccountService;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class AccountController extends Controller
{
    public function __construct(protected AccountService $service)
    {}
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $filters = request()->all();

        $accounts = $this->service->paginate(
            $filters['perPage'] ?? 5, 
            $filters['page'] ?? 1, 
            $filters['search'] ?? null
        );

        return Inertia::render('accounts/index', compact('accounts', 'filters'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('accounts/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUpdateAccountRequest $request)
    {
        $this->service->create($request->validated());
  
        return to_route('accounts.index')->with('success' , 'Account created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Account $account)
    {
        abort_if(Gate::denies('owner-account', $account), 403, 'Unauthorized access to this account.');

        return Inertia::render('accounts/show', compact('account'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(StoreUpdateAccountRequest $request, Account $account)
    {
        abort_if(Gate::denies('owner-account', $account), 403, 'Unauthorized access to this account.');

        $this->service->update($account, $request->validated());
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Account $account)
    {
        abort_if(Gate::denies('owner-account', $account), 403, 'Unauthorized access to this account.');
        
        $this->service->delete($account);

        return to_route('accounts.index')->with('success', 'Account deleted successfully!');
    }
}
