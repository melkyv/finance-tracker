<?php

namespace App\Models;

use App\Enums\TransactionType;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use JeroenG\Explorer\Application\Explored;
use Laravel\Scout\Searchable;

class Transaction extends Model implements Explored
{
    use HasFactory, Searchable, SoftDeletes;
    
    protected $fillable = [
        'account_id',
        'category_id',
        'description',
        'amount',
        'type',
    ];

    protected $appends = [
        'type_label'
    ];

    protected function casts(): array
    {
        return [
            'type' => TransactionType::class,
            'amount' => 'decimal:2',
        ];
    }

    protected function typeLabel(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->type->label(),
        );
    }

    public function account(): BelongsTo
    {
        return $this->belongsTo(Account::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function toSearchableArray(): array
    {
        return [
            'id' => $this->id,
            'account_id' => $this->account_id,
            'user_id' => $this->account->user_id,
            'category_id' => $this->category_id,
            'description' => $this->description,
            'amount' => $this->amount,
            'type' => $this->type,
            'account_name' => $this->account->name,
            'category_name' => $this->category?->name,
        ];
    }

    public function mappableAs(): array
    {
        return [
            'id' => 'keyword',
            'account_id' => 'keyword',
            'user_id' => 'keyword',
            'category_id' => 'keyword',
            'description' => 'text',
            'amount' => 'float',
            'type' => 'text',
            'account_name' => 'text',
            'category_name' => 'text',
        ];
    }

    public function searchableAs(): string
    {
        return 'transactions_index';
    }
}