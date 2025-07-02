<?php

namespace App\Observers;

use App\Enums\TransactionType;
use App\Models\Transaction;

class TransactionObserver
{
    /**
     * Handle the Transaction "created" event.
     */
    public function created(Transaction $transaction): void
    {
        if ($transaction->type === TransactionType::INCOME) {
            $transaction->account->balance += $transaction->amount;
            $transaction->account->save();
        }

        if (in_array($transaction->type, [TransactionType::EXPENSE, TransactionType::TRANSFER])) {
            $transaction->account->balance -= $transaction->amount;
            $transaction->account->save();
        }
    }
}
