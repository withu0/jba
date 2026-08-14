<?php

use App\Http\Controllers\BeforeAfterController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\InterviewController;
use App\Http\Controllers\LessonController;
use App\Http\Controllers\LocaleController;
use App\Http\Controllers\MangaController;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\PageContentController;
use App\Http\Controllers\RobotsController;
use App\Http\Controllers\SitemapController;
use Illuminate\Support\Facades\Route;

Route::get('/', HomeController::class)->name('home');
Route::get('/sitemap.xml', SitemapController::class)->name('sitemap');
Route::get('/robots.txt', RobotsController::class)->name('robots');
Route::get('/manga', [MangaController::class, 'index'])->name('manga.index');
Route::get('/manga/{episode:slug}', [MangaController::class, 'show'])->name('manga.show');

Route::get('/about', [PageContentController::class, 'show'])
    ->defaults('key', 'about')
    ->name('about');

Route::get('/news', [NewsController::class, 'index'])->name('news.index');
Route::get('/news/{key}', [NewsController::class, 'show'])->name('news.show');

Route::get('/interviews', [InterviewController::class, 'index'])->name('interviews.index');
Route::get('/interviews/{key}', [InterviewController::class, 'show'])->name('interviews.show');

Route::get('/counseling', [PageContentController::class, 'show'])
    ->defaults('key', 'counseling')
    ->name('counseling');

Route::get('/contact', [ContactController::class, 'create'])->name('contact');
Route::post('/contact', [ContactController::class, 'store'])
    ->middleware('throttle:contact')
    ->name('contact.store');

Route::get('/before-after', [BeforeAfterController::class, 'index'])->name('before-after');
Route::get('/contraindications', [PageContentController::class, 'show'])
    ->defaults('key', 'contraindications')
    ->name('contraindications');

Route::post('/locale/{locale}', LocaleController::class)
    ->whereIn('locale', ['ja', 'en', 'zh'])
    ->name('locale.switch');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');

    Route::get('lessons', [LessonController::class, 'index'])->name('lessons.index');
    Route::get('lessons/history', [LessonController::class, 'history'])->name('lessons.history');
    Route::get('lessons/{lesson}', [LessonController::class, 'show'])->name('lessons.show');
    Route::post('lessons/{lesson}/complete', [LessonController::class, 'complete'])->name('lessons.complete');
});

require __DIR__.'/settings.php';
