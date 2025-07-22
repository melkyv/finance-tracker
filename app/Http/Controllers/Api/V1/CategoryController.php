<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Category\StoreUpdateCategoryRequest;
use App\Http\Resources\V1\CategoryResource;
use App\Models\Category;
use App\Services\CategoryService;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function __construct(private readonly CategoryService $categoryService)
    {
    }

    /**
     * List Categories
     *
     * Returns a paginated list of the user's categories.
     * You can filter the results using the 'search' parameter.
     *
     * @queryParam page integer The page number to return. Example: 1
     * @queryParam per_page integer The number of items to return per page. Defaults to 15. Example: 20
     * @queryParam search string A search term to filter by category name or description. Example: "Food"
     * @authenticated
     */
    public function index(Request $request)
    {
        $categories = $this->categoryService->paginate(
            perPage: $request->integer('per_page', 15),
            page: $request->integer('page', 1),
            search: $request->string('search'),
        );

        return CategoryResource::collection($categories);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUpdateCategoryRequest $request)
    {
        $category = $this->categoryService->create($request->validated());

        return CategoryResource::make($category);
    }

    /**
     * Display the specified resource.
     */
    public function show(Category $category)
    {
        $this->authorize('owner-category', $category);

        return CategoryResource::make($category);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(StoreUpdateCategoryRequest $request, Category $category)
    {
        $this->authorize('owner-category', $category);

        $category = $this->categoryService->update($category, $request->validated());

        return CategoryResource::make($category);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category)
    {
        $this->authorize('owner-category', $category);

        $this->categoryService->delete($category);

        return response()->noContent();
    }
}
