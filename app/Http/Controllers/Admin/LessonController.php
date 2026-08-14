<?php

namespace App\Http\Controllers\Admin;

use App\Concerns\ReordersSortableRecords;
use App\Concerns\ResolvesContentLocales;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreLessonRequest;
use App\Http\Requests\Admin\UpdateLessonRequest;
use App\Models\Lesson;
use App\Models\LessonCategory;
use App\Models\LessonImage;
use App\Models\LessonImageTranslation;
use App\Models\LessonTranslation;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use RuntimeException;

class LessonController extends Controller
{
    use ReordersSortableRecords;
    use ResolvesContentLocales;

    public function index(Request $request): Response
    {
        $categories = $this->categoryOptions();
        $categoryId = $request->integer('category') ?: null;

        if ($categoryId !== null && ! collect($categories)->contains('id', $categoryId)) {
            $categoryId = null;
        }

        $lessons = Lesson::query()
            ->with(['translations', 'category.translations'])
            ->withCount('images')
            ->when($categoryId, fn ($query, int $id) => $query->where('lesson_category_id', $id))
            ->orderBy('lesson_category_id')
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get()
            ->map(fn (Lesson $lesson): array => [
                'id' => $lesson->id,
                'lesson_category_id' => $lesson->lesson_category_id,
                'category_name' => $lesson->category?->translationFor('ja')->name
                    ?? $lesson->category->slug
                    ?? '',
                'is_published' => $lesson->is_published,
                'sort_order' => $lesson->sort_order,
                'images_count' => $lesson->images_count,
                'has_video' => $lesson->video_path !== null || $lesson->video_url !== null,
                'title' => $lesson->translationFor('ja')->title
                    ?? $lesson->translations->first()->title
                    ?? '#'.$lesson->id,
            ]);

        return Inertia::render('admin/lessons/index', [
            'lessons' => $lessons,
            'categories' => $categories,
            'categoryId' => $categoryId,
        ]);
    }

    public function create(Request $request): Response
    {
        $categories = $this->categoryOptions();
        $categoryId = $request->integer('category') ?: null;

        if ($categoryId === null || ! collect($categories)->contains('id', $categoryId)) {
            $categoryId = $categories[0]['id'] ?? null;
        }

        return Inertia::render('admin/lessons/create', [
            'categories' => $categories,
            'categoryId' => $categoryId,
            'locales' => $this->supportedLocales(),
            'translations' => $this->emptyTranslations(),
            'nextSortOrder' => $this->nextSortOrder($categoryId),
        ]);
    }

    public function store(StoreLessonRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $categoryId = (int) $validated['lesson_category_id'];

        $lesson = Lesson::query()->create([
            'lesson_category_id' => $categoryId,
            'sort_order' => (int) ($validated['sort_order'] ?? $this->nextSortOrder($categoryId)),
            'is_published' => (bool) ($validated['is_published'] ?? false),
            'video_url' => $validated['video_url'] ?? null,
        ]);

        if (($validated['video'] ?? null) instanceof UploadedFile) {
            $lesson->update(['video_path' => $this->storeVideo($validated['video'], $lesson)]);
        }

        $this->syncTranslations($lesson, $validated['translations']);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Lesson created.'),
        ]);

        return to_route('admin.lessons.edit', $lesson);
    }

    public function edit(Lesson $lesson): Response
    {
        $lesson->load(['translations', 'images.translations']);

        return Inertia::render('admin/lessons/edit', [
            'lesson' => [
                'id' => $lesson->id,
                'lesson_category_id' => $lesson->lesson_category_id,
                'is_published' => $lesson->is_published,
                'sort_order' => $lesson->sort_order,
                'video_url' => $lesson->video_url,
                'video_file_url' => $lesson->video_file_url,
                'translations' => $this->mapTranslationsForForm($lesson->translations),
                'images' => $lesson->images->map(fn (LessonImage $image): array => [
                    'id' => $image->id,
                    'sort_order' => $image->sort_order,
                    'image_url' => $image->image_url,
                    'translations' => $this->mapCaptionsForForm($image->translations),
                ])->all(),
            ],
            'categories' => $this->categoryOptions(),
            'locales' => $this->supportedLocales(),
            'emptyCaptions' => $this->emptyCaptions(),
            'nextImageSortOrder' => (int) $lesson->images()->max('sort_order') + 1,
        ]);
    }

    public function update(UpdateLessonRequest $request, Lesson $lesson): RedirectResponse
    {
        $validated = $request->validated();

        $attributes = [
            'lesson_category_id' => (int) $validated['lesson_category_id'],
            'sort_order' => (int) ($validated['sort_order'] ?? $lesson->sort_order),
            'is_published' => (bool) ($validated['is_published'] ?? false),
            'video_url' => $validated['video_url'] ?? null,
        ];

        if (! empty($validated['remove_video']) && $lesson->video_path !== null) {
            Storage::disk('public')->delete($lesson->video_path);
            $attributes['video_path'] = null;
        }

        if (($validated['video'] ?? null) instanceof UploadedFile) {
            if ($lesson->video_path !== null) {
                Storage::disk('public')->delete($lesson->video_path);
            }

            $attributes['video_path'] = $this->storeVideo($validated['video'], $lesson);
        }

        $lesson->update($attributes);
        $this->syncTranslations($lesson, $validated['translations']);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Lesson saved.'),
        ]);

        return to_route('admin.lessons.edit', $lesson);
    }

    public function destroy(Lesson $lesson): RedirectResponse
    {
        Storage::disk('public')->deleteDirectory($this->lessonDirectory($lesson));

        $lesson->delete();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Lesson deleted.'),
        ]);

        return to_route('admin.lessons.index');
    }

    public function moveUp(Lesson $lesson): RedirectResponse
    {
        $this->swapWithNeighbor($this->siblingsOf($lesson), $lesson, 'up');

        return back();
    }

    public function moveDown(Lesson $lesson): RedirectResponse
    {
        $this->swapWithNeighbor($this->siblingsOf($lesson), $lesson, 'down');

        return back();
    }

    /**
     * @return Builder<Lesson>
     */
    private function siblingsOf(Lesson $lesson): Builder
    {
        return Lesson::query()->where('lesson_category_id', $lesson->lesson_category_id);
    }

    private function nextSortOrder(?int $categoryId): int
    {
        return (int) Lesson::query()
            ->where('lesson_category_id', $categoryId)
            ->max('sort_order') + 1;
    }

    private function lessonDirectory(Lesson $lesson): string
    {
        return "lessons/{$lesson->id}";
    }

    private function storeVideo(UploadedFile $file, Lesson $lesson): string
    {
        $path = $file->store($this->lessonDirectory($lesson), 'public');

        if ($path === false) {
            throw new RuntimeException("Unable to store the video for lesson {$lesson->id}.");
        }

        return $path;
    }

    /**
     * @return list<array{id: int, name: string, slug: string}>
     */
    private function categoryOptions(): array
    {
        return array_values(
            LessonCategory::query()
                ->with('translations')
                ->orderBy('sort_order')
                ->orderBy('id')
                ->get()
                ->map(fn (LessonCategory $category): array => [
                    'id' => $category->id,
                    'slug' => $category->slug,
                    'name' => $category->translationFor()->name ?? $category->slug,
                ])
                ->all()
        );
    }

    /**
     * @param  array<string, array{title: string, body?: string|null}>  $translations
     */
    private function syncTranslations(Lesson $lesson, array $translations): void
    {
        foreach ($translations as $locale => $content) {
            $lesson->translations()->updateOrCreate(
                ['locale' => $locale],
                [
                    'title' => $content['title'],
                    'body' => $content['body'] ?? null,
                ],
            );
        }
    }

    /**
     * @return array<string, array{title: string, body: string}>
     */
    private function emptyTranslations(): array
    {
        return collect($this->supportedLocales())->mapWithKeys(fn (string $locale): array => [
            $locale => ['title' => '', 'body' => ''],
        ])->all();
    }

    /**
     * @return array<string, array{caption: string}>
     */
    private function emptyCaptions(): array
    {
        return collect($this->supportedLocales())->mapWithKeys(fn (string $locale): array => [
            $locale => ['caption' => ''],
        ])->all();
    }

    /**
     * @param  iterable<int, LessonTranslation>  $existing
     * @return array<string, array{title: string, body: string}>
     */
    private function mapTranslationsForForm(iterable $existing): array
    {
        $byLocale = collect($existing)->keyBy('locale');

        return collect($this->supportedLocales())->mapWithKeys(function (string $locale) use ($byLocale): array {
            $row = $byLocale->get($locale);

            return [
                $locale => [
                    'title' => $row->title ?? '',
                    'body' => $row->body ?? '',
                ],
            ];
        })->all();
    }

    /**
     * @param  iterable<int, LessonImageTranslation>  $existing
     * @return array<string, array{caption: string}>
     */
    private function mapCaptionsForForm(iterable $existing): array
    {
        $byLocale = collect($existing)->keyBy('locale');

        return collect($this->supportedLocales())->mapWithKeys(function (string $locale) use ($byLocale): array {
            $row = $byLocale->get($locale);

            return [$locale => ['caption' => $row->caption ?? '']];
        })->all();
    }
}
