<?php

namespace App\Models;

use App\Enums\AccountType;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Account extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'user_id',
        'name',
        'type',
        'balance',
    ];

    protected $appends = [
        'type_label'
    ];

    protected function casts(): array
    {
        return [
            'type' => AccountType::class,
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

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }
}