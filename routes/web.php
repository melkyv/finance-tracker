<?php

use App\Http\Controllers\AccountController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');

    Route::resource('accounts', AccountController::class);
    Route::resource('categories', CategoryController::class);
    Route::resource('transactions', TransactionController::class);
    
    // Reports routes (excluding edit and update since reports are immutable)
    Route::resource('reports', ReportController::class)->except(['edit', 'update']);
    Route::get('reports/{report}/download', [ReportController::class, 'download'])->name('reports.download');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
