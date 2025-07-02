<?php

namespace App\Enums;

enum TransactionType: string
{
    case INCOME = 'income';
    case EXPENSE = 'expense';
    case TRANSFER = 'transfer';

    public function label(): string
    {
        return match ($this) {
            self::INCOME => 'Income',
            self::EXPENSE => 'Expense',
            self::TRANSFER => 'Transfer',
        };
    }

    public static function getValues(): array
    {
        return [
            self::INCOME->value,
            self::EXPENSE->value,
            self::TRANSFER->value,
        ];
    }

    public static function getValuesWithLabels(): array
    {
        return collect(self::cases())->map(function ($transactionType) {
            return [
                'value' => $transactionType->value,
                'label' => $transactionType->label(),
            ];
        })->toArray();
    }
}