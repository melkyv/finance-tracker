<?php

namespace App\Models;

use App\Enums\ReportType;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use JeroenG\Explorer\Application\Explored;
use Laravel\Scout\Searchable;

class Report extends Model implements Explored
{
    use HasFactory, Searchable;
    
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

    public function toSearchableArray(): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'title' => $this->title,
            'type' => $this->type,
            'from_date' => $this->from_date,
            'to_date' => $this->to_date,
            'created_at' => $this->created_at,
        ];
    }

    public function mappableAs(): array
    {
        return [
            'id' => 'keyword',
            'user_id' => 'keyword',
            'title' => 'text',
            'type' => 'text',
            'from_date' => 'date',
            'to_date' => 'date',
            'created_at' => 'date',
        ];
    }

    public function searchableAs(): string
    {
        return 'reports_index';
    }
}
