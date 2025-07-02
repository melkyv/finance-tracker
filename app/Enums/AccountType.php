<?php

namespace App\Enums;

enum AccountType: string
{
    case DEBIT    = 'debit';
    case SAVINGS  = 'savings';
    case CREDIT   = 'credit';

    public function label(): string
    {
        return match ($this) {
            self::DEBIT    => 'Debit Account',
            self::SAVINGS  => 'Savings Account',
            self::CREDIT   => 'Credit Card',
        };
    }

    public static function getValues(): array
    {
        return [
            self::DEBIT->value,
            self::SAVINGS->value,
            self::CREDIT->value,
        ];
    }

    public static function getValuesWithLabels(): array
    {
        return collect(self::cases())->map(function ($accountType) {
            return [
                'value' => $accountType->value,
                'label' => $accountType->label(),
            ];
        })->toArray();
    }
}