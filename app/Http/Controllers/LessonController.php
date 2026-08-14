<?php

namespace App\Http\Controllers;

use App\Models\Lesson;
use App\Models\LessonCategory;
use App\Models\LessonImage;
use App\Models\LessonViewLog;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;

class LessonController extends Controller
{
    /**
     * Category-grouped list of published lessons with watch flags.
     */
    public function index(Request $request): Response
    {
        /** @var User $user */
        $user = $request->user();
        $logs = $this->logsForUser($user);

        $categories = LessonCategory::query()
            ->with([
                'translations',
                'lessons' => fn ($query) => $query
                    ->published()
                    ->with(['translations', 'images.translations'])
                    ->orderBy('sort_order')
                    ->orderBy('id'),
            ])
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get()
            ->map(function (LessonCategory $category) use ($logs): array {
                $name = $category->translationFor()?->name ?? $category->slug;

                return [
                    'id' => $category->id,
                    'slug' => $category->slug,
                    'name' => $name,
                    'lessons' => $category->lessons
                        ->map(fn (Lesson $lesson): array => $this->lessonSummary($lesson, $logs->get($lesson->id)))
                        ->values()
                        ->all(),
                ];
            })
            ->filter(fn (array $category): bool => count($category['lessons']) > 0)
            ->values()
            ->all();

        return Inertia::render('member/lessons/index', [
            'categories' => $categories,
        ]);
    }

    /**
     * Lesson detail: video, text, gallery. Records view start.
     */
    public function show(Request $request, Lesson $lesson): Response
    {
        abort_unless($lesson->is_published, 404);

        /** @var User $user */
        $user = $request->user();

        $lesson->load(['translations', 'category.translations', 'images.translations']);

        $log = LessonViewLog::query()->firstOrCreate(
            [
                'user_id' => $user->id,
                'lesson_id' => $lesson->id,
            ],
            [
                'started_at' => now(),
            ],
        );

        if ($log->started_at === null) {
            $log->forceFill(['started_at' => now()])->save();
        }

        $translation = $lesson->translationFor();
        abort_if($translation === null, 404);

        $category = $lesson->category;

        return Inertia::render('member/lessons/show', [
            'lesson' => [
                'id' => $lesson->id,
                'title' => $translation->title,
                'body' => $translation->body ?? '',
                'video_src' => $lesson->video_file_url ?? $lesson->video_url,
                'category' => [
                    'id' => $category->id,
                    'slug' => $category->slug,
                    'name' => $category->translationFor()?->name ?? $category->slug,
                ],
                'images' => $lesson->images
                    ->map(fn (LessonImage $image): array => [
                        'id' => $image->id,
                        'image_url' => $image->image_url,
                        'caption' => $image->translationFor()?->caption,
                        'sort_order' => $image->sort_order,
                    ])
                    ->values()
                    ->all(),
                'view' => [
                    'started_at' => $log->started_at?->toIso8601String(),
                    'completed_at' => $log->completed_at?->toIso8601String(),
                    'started' => $log->started_at !== null,
                    'completed' => $log->completed_at !== null,
                ],
            ],
        ]);
    }

    /**
     * Mark a lesson as completed for the current member.
     */
    public function complete(Request $request, Lesson $lesson): RedirectResponse
    {
        abort_unless($lesson->is_published, 404);

        /** @var User $user */
        $user = $request->user();

        $log = LessonViewLog::query()->firstOrCreate(
            [
                'user_id' => $user->id,
                'lesson_id' => $lesson->id,
            ],
            [
                'started_at' => now(),
            ],
        );

        if ($log->started_at === null) {
            $log->started_at = now();
        }

        if ($log->completed_at === null) {
            $log->completed_at = now();
        }

        $log->save();

        return back();
    }

    /**
     * Watched / completed lesson history for the member.
     */
    public function history(Request $request): Response
    {
        /** @var User $user */
        $user = $request->user();

        $entries = LessonViewLog::query()
            ->where('user_id', $user->id)
            ->whereHas('lesson', fn ($query) => $query->published())
            ->with([
                'lesson' => fn ($query) => $query
                    ->published()
                    ->with(['translations', 'images.translations', 'category.translations']),
            ])
            ->orderByRaw('COALESCE(completed_at, started_at) DESC')
            ->orderByDesc('id')
            ->get()
            ->map(function (LessonViewLog $log): ?array {
                $lesson = $log->lesson;

                if ($lesson === null) {
                    return null;
                }

                return [
                    ...$this->lessonSummary($lesson, $log),
                    'started_at' => $log->started_at?->toIso8601String(),
                    'completed_at' => $log->completed_at?->toIso8601String(),
                ];
            })
            ->filter()
            ->values()
            ->all();

        return Inertia::render('member/lessons/history', [
            'entries' => $entries,
        ]);
    }

    /**
     * @return Collection<int, LessonViewLog>
     */
    private function logsForUser(User $user): Collection
    {
        return LessonViewLog::query()
            ->where('user_id', $user->id)
            ->get()
            ->keyBy('lesson_id');
    }

    /**
     * @return array{
     *     id: int,
     *     title: string,
     *     thumbnail_url: string|null,
     *     category_name: string|null,
     *     started: bool,
     *     completed: bool
     * }
     */
    private function lessonSummary(Lesson $lesson, ?LessonViewLog $log): array
    {
        $translation = $lesson->translationFor();
        $firstImage = $lesson->relationLoaded('images')
            ? $lesson->images->first()
            : null;

        $categoryName = null;
        if ($lesson->relationLoaded('category') && $lesson->category !== null) {
            $categoryName = $lesson->category->translationFor()?->name ?? $lesson->category->slug;
        }

        return [
            'id' => $lesson->id,
            'title' => $translation?->title ?? '',
            'thumbnail_url' => $firstImage?->image_url,
            'category_name' => $categoryName,
            'started' => $log?->started_at !== null,
            'completed' => $log?->completed_at !== null,
        ];
    }
}
