<?php

namespace App\Http\Controllers;

use App\Enums\ReportType;
use App\Http\Requests\Report\StoreReportRequest;
use App\Models\Report;
use App\Services\ReportService;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;

class ReportController extends Controller
{
    public function __construct(protected ReportService $service)
    {}
    
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $filters = request()->all();

        $reports = $this->service->paginate(
            $filters['perPage'] ?? 10, 
            $filters['page'] ?? 1, 
            $filters['search'] ?? null
        );

        return Inertia::render('reports/index', compact('reports', 'filters'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $reportTypes = ReportType::getValuesWithLabels();

        // Generate quick report data if type is provided
        $quickReport = null;
        if (request('type')) {
            $quickReport = $this->service->generateQuickReport(request('type'));
        }

        return Inertia::render('reports/create', compact('reportTypes', 'quickReport'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreReportRequest $request)
    {
        try {
            $report = $this->service->create($request->validated());
  
            return to_route('reports.show', $report)
                ->with('success', 'Report generated successfully!');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Report $report)
    {
        abort_if(Gate::denies('owner-report', $report), 403, 'Unauthorized access to this report.');
        
        return Inertia::render('reports/show', compact('report'));
    }

    /**
     * Download the report as PDF.
     */
    public function download(Report $report)
    {
        abort_if(Gate::denies('owner-report', $report), 403, 'Unauthorized access to this report.');

        try {
            $pdf = Pdf::loadView('reports.pdf', compact('report'))
                ->setPaper('a4', 'portrait')
                ->setOptions([
                    'defaultFont' => 'Arial',
                    'isPhpEnabled' => true,
                    'isRemoteEnabled' => true,
                ]);

            $filename = str_replace(' ', '_', $report->title) . '_' . now()->format('Y-m-d') . '.pdf';

            return response()->streamDownload(
                function () use ($pdf) {
                    echo $pdf->output();
                },
                $filename,
                [
                    'Content-Type' => 'application/pdf',
                    'Cache-Control' => 'no-cache, no-store, must-revalidate',
                    'Pragma' => 'no-cache',
                    'Expires' => '0',
                ],
                'inline'
            );
        } catch (\Exception $e) {
            return back()->with('error', 'Error generating PDF: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Report $report)
    {
        abort_if(Gate::denies('owner-report', $report), 403, 'Unauthorized access to this report.');

        try {
            $this->service->delete($report);

            return to_route('reports.index')->with('success', 'Report deleted successfully!');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }
}
