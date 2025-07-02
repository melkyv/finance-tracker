<?php

namespace App\Models;

use App\Enums\ReportType;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Report extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'user_id',
        'title',
        'type',
        'from_date',
        'to_date',
        'summary',
    ];

    protected $appends = [
        'type_label',
    ];

    protected function casts(): array
    {
        return [
            'from_date' => 'date',
            'to_date' => 'date',
            'type' => ReportType::class,
            'summary' => 'array',
        ];
    }

    protected function typeLabel(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->type->label(),
        );
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
