<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Report\StoreReportRequest;
use App\Http\Resources\V1\ReportResource;
use App\Models\Report;
use App\Services\ReportService;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function __construct(private readonly ReportService $reportService)
    {
    }

    /**
     * List Reports
     *
     * Returns a paginated list of the user's reports.
     * You can filter the results using the 'search' parameter.
     *
     * @queryParam page integer The page number to return. Example: 1
     * @queryParam per_page integer The number of items to return per page. Defaults to 15. Example: 20
     * @queryParam search string A search term to filter by report title. Example: "Monthly"
     * @authenticated
     */
    public function index(Request $request)
    {
        $reports = $this->reportService->paginate(
            perPage: $request->integer('per_page', 15),
            page: $request->integer('page', 1),
            search: $request->string('search'),
        );

        return ReportResource::collection($reports);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreReportRequest $request)
    {
        $report = $this->reportService->create($request->validated());

        return ReportResource::make($report);
    }

    /**
     * Display the specified resource.
     */
    public function show(Report $report)
    {
        $this->authorize('owner-report', $report);

        return ReportResource::make($report);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Report $report)
    {
        $this->authorize('owner-report', $report);

        $this->reportService->delete($report);

        return response()->noContent();
    }
}
