<?php

namespace App\Enums;

enum ReportType: string
{
    case MONTHLY = 'monthly';
    case YEARLY  = 'yearly';
    case CUSTOM  = 'custom';

    public function label(): string
    {
        return match($this) {
            self::MONTHLY => 'Monthly',
            self::YEARLY  => 'Yearly',
            self::CUSTOM  => 'Custom',
        };
    }

    public static function getValues(): array
    {
        return [
            self::MONTHLY->value,
            self::YEARLY->value,
            self::CUSTOM->value,
        ];
    }

    public static function getValuesWithLabels(): array
    {
        return collect(self::cases())->map(function ($reportType) {
            return [
                'value' => $reportType->value,
                'label' => $reportType->label(),
            ];
        })->toArray();
    }
}