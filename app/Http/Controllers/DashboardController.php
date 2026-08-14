<?php

namespace App\Http\Controllers;

use App\Models\LessonViewLog;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Member mypage with recent watch history.
     */
    public function __invoke(Request $request): Response
    {
        /** @var User $user */
        $user = $request->user();

        $recentHistory = LessonViewLog::query()
            ->where('user_id', $user->id)
            ->whereHas('lesson', fn ($query) => $query->published())
            ->with([
                'lesson' => fn ($query) => $query
                    ->published()
                    ->with(['translations', 'category.translations']),
            ])
            ->orderByRaw('COALESCE(completed_at, started_at) DESC')
            ->orderByDesc('id')
            ->limit(5)
            ->get()
            ->map(function (LessonViewLog $log): ?array {
                $lesson = $log->lesson;

                if ($lesson === null) {
                    return null;
                }

                $translation = $lesson->translationFor();
                $category = $lesson->category;

                return [
                    'id' => $lesson->id,
                    'title' => $translation?->title ?? '',
                    'category_name' => $category?->translationFor()?->name ?? $category?->slug,
                    'started' => $log->started_at !== null,
                    'completed' => $log->completed_at !== null,
                    'started_at' => $log->started_at?->toIso8601String(),
                    'completed_at' => $log->completed_at?->toIso8601String(),
                ];
            })
            ->filter()
            ->values()
            ->all();

        return Inertia::render('dashboard', [
            'recentHistory' => $recentHistory,
        ]);
    }
}
