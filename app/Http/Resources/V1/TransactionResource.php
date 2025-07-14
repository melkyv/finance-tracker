<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TransactionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'description' => $this->description,
            'amount' => $this->amount,
            'type' => $this->type,
            'type_label' => $this->type_label,
            'account' => AccountResource::make($this->whenLoaded('account')),
            'category' => CategoryResource::make($this->whenLoaded('category')),
        ];
    }
}
