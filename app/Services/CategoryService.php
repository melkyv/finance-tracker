<?php

namespace App\Services;

use App\Models\Category;
use Illuminate\Support\Facades\DB;

class CategoryService
{
    public function paginate(int $perPage = 10, int $page = 1, ?string $search = null): \Illuminate\Contracts\Pagination\LengthAwarePaginator
    {
        $categories = auth()->user()->categories()
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', '%' . $search . '%')
                    ->orWhere('description', 'like', '%' . $search . '%');
            })
            ->orderBy('created_at', 'desc')
            ->paginate($perPage, ['*'], 'page', $page)
            ->withQueryString();

        return $categories;
    }

    public function create(array $data): Category
    {
        $category = DB::transaction(function () use ($data) {
            return auth()->user()->categories()->create($data);
        });

        return $category;
    }

    public function update(Category $category, array $data): Category
    {
        DB::transaction(function () use ($category, $data) {
            $category->update($data);
        });

        return $category;
    }

    public function delete(Category $category): bool
    {
        DB::transaction(function () use ($category) {
            $category->delete();
        });

        return true;
    }
}