<?php

namespace App\Http\Controllers;

use App\Http\Requests\Category\StoreUpdateCategoryRequest;
use App\Models\Category;
use App\Services\CategoryService;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function __construct(protected CategoryService $service)
    {}
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $filters = request()->all();

        $categories = $this->service->paginate(
            $filters['perPage'] ?? 5, 
            $filters['page'] ?? 1, 
            $filters['search'] ?? null
        );

        return Inertia::render('categories/index', compact('categories', 'filters'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('categories/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUpdateCategoryRequest $request)
    {
        $this->service->create($request->validated());
  
        return to_route('categories.index')->with('success' , 'Category created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Category $category)
    {
        return Inertia::render('categories/show', compact('category'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(StoreUpdateCategoryRequest $request, Category $category)
    {
        $this->service->update($category, $request->validated());
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category)
    {
        $this->service->delete($category);

        return to_route('categories.index')->with('success', 'Category deleted successfully!');
    }
}

