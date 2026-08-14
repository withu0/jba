<?php

use App\Http\Controllers\Admin\AuthenticatedSessionController;
use App\Http\Controllers\Admin\BeforeAfterController;
use App\Http\Controllers\Admin\ContactController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\InterviewController;
use App\Http\Controllers\Admin\LessonCategoryController;
use App\Http\Controllers\Admin\LessonController;
use App\Http\Controllers\Admin\LessonImageController;
use App\Http\Controllers\Admin\MangaCategoryController;
use App\Http\Controllers\Admin\MangaEpisodeController;
use App\Http\Controllers\Admin\MangaPageController;
use App\Http\Controllers\Admin\NewsController;
use App\Http\Controllers\Admin\PageContentController;
use Illuminate\Support\Facades\Route;

Route::middleware('guest:admin')->group(function () {
    Route::get('login', [AuthenticatedSessionController::class, 'create'])
        ->name('login');
    Route::post('login', [AuthenticatedSessionController::class, 'store'])
        ->name('login.store');
});

Route::middleware('auth:admin')->group(function () {
    Route::get('/', DashboardController::class)->name('dashboard');
    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])
        ->name('logout');

    Route::get('pages', [PageContentController::class, 'index'])->name('pages.index');
    Route::get('pages/{page}/edit', [PageContentController::class, 'edit'])->name('pages.edit');
    Route::put('pages/{page}', [PageContentController::class, 'update'])->name('pages.update');

    Route::resource('news', NewsController::class)->except(['show']);
    Route::resource('interviews', InterviewController::class)->except(['show']);

    Route::post('before-after/{beforeAfter}/move-up', [BeforeAfterController::class, 'moveUp'])
        ->name('before-after.move-up');
    Route::post('before-after/{beforeAfter}/move-down', [BeforeAfterController::class, 'moveDown'])
        ->name('before-after.move-down');
    Route::resource('before-after', BeforeAfterController::class)
        ->parameters(['before-after' => 'beforeAfter'])
        ->except(['show']);

    Route::post('lesson-categories/{category}/move-up', [LessonCategoryController::class, 'moveUp'])
        ->name('lesson-categories.move-up');
    Route::post('lesson-categories/{category}/move-down', [LessonCategoryController::class, 'moveDown'])
        ->name('lesson-categories.move-down');
    Route::resource('lesson-categories', LessonCategoryController::class)
        ->parameters(['lesson-categories' => 'category'])
        ->except(['show', 'create']);

    Route::post('lessons/{lesson}/move-up', [LessonController::class, 'moveUp'])
        ->name('lessons.move-up');
    Route::post('lessons/{lesson}/move-down', [LessonController::class, 'moveDown'])
        ->name('lessons.move-down');
    Route::post('lessons/{lesson}/images', [LessonImageController::class, 'store'])
        ->name('lessons.images.store');
    Route::resource('lessons', LessonController::class)->except(['show']);

    Route::put('lesson-images/{image}', [LessonImageController::class, 'update'])
        ->name('lesson-images.update');
    Route::delete('lesson-images/{image}', [LessonImageController::class, 'destroy'])
        ->name('lesson-images.destroy');
    Route::post('lesson-images/{image}/move-up', [LessonImageController::class, 'moveUp'])
        ->name('lesson-images.move-up');
    Route::post('lesson-images/{image}/move-down', [LessonImageController::class, 'moveDown'])
        ->name('lesson-images.move-down');

    Route::post('manga-categories/{category}/move-up', [MangaCategoryController::class, 'moveUp'])
        ->name('manga-categories.move-up');
    Route::post('manga-categories/{category}/move-down', [MangaCategoryController::class, 'moveDown'])
        ->name('manga-categories.move-down');
    Route::resource('manga-categories', MangaCategoryController::class)
        ->parameters(['manga-categories' => 'category'])
        ->except(['show', 'create']);

    Route::post('manga/{episode}/move-up', [MangaEpisodeController::class, 'moveUp'])
        ->name('manga.move-up');
    Route::post('manga/{episode}/move-down', [MangaEpisodeController::class, 'moveDown'])
        ->name('manga.move-down');
    Route::post('manga/{episode}/pages', [MangaPageController::class, 'store'])
        ->name('manga.pages.store');
    Route::resource('manga', MangaEpisodeController::class)
        ->parameters(['manga' => 'episode'])
        ->except(['show']);

    Route::delete('manga-pages/{page}', [MangaPageController::class, 'destroy'])
        ->name('manga-pages.destroy');
    Route::post('manga-pages/{page}/move-up', [MangaPageController::class, 'moveUp'])
        ->name('manga-pages.move-up');
    Route::post('manga-pages/{page}/move-down', [MangaPageController::class, 'moveDown'])
        ->name('manga-pages.move-down');

    Route::get('contacts', [ContactController::class, 'index'])->name('contacts.index');
    Route::get('contacts/{contact}', [ContactController::class, 'show'])->name('contacts.show');
    Route::put('contacts/{contact}', [ContactController::class, 'update'])->name('contacts.update');
});
