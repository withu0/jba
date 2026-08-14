<?php

namespace App\Http\Controllers\Admin;

use App\Concerns\ReordersSortableRecords;
use App\Concerns\ResolvesContentLocales;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreLessonCategoryRequest;
use App\Http\Requests\Admin\UpdateLessonCategoryRequest;
use App\Models\LessonCategory;
use App\Models\LessonCategoryTranslation;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class LessonCategoryController extends Controller
{
    use ReordersSortableRecords;
    use ResolvesContentLocales;

    public function index(): Response
    {
        $categories = LessonCategory::query()
            ->with('translations')
            ->withCount('lessons')
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get()
            ->map(fn (LessonCategory $category): array => [
                'id' => $category->id,
                'slug' => $category->slug,
                'sort_order' => $category->sort_order,
                'lessons_count' => $category->lessons_count,
                'name' => $category->translationFor('ja')->name
                    ?? $category->translations->first()->name
                    ?? $category->slug,
            ]);

        return Inertia::render('admin/lesson-categories/index', [
            'categories' => $categories,
            'locales' => $this->supportedLocales(),
            'translations' => $this->emptyTranslations(),
            'nextSortOrder' => (int) LessonCategory::query()->max('sort_order') + 1,
        ]);
    }

    public function store(StoreLessonCategoryRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $category = LessonCategory::query()->create([
            'slug' => $validated['slug'],
            'sort_order' => (int) ($validated['sort_order'] ?? 0),
        ]);

        $this->syncTranslations($category, $validated['translations']);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Lesson category created.'),
        ]);

        return to_route('admin.lesson-categories.index');
    }

    public function edit(LessonCategory $category): Response
    {
        $category->load('translations');

        return Inertia::render('admin/lesson-categories/edit', [
            'category' => [
                'id' => $category->id,
                'slug' => $category->slug,
                'sort_order' => $category->sort_order,
                'translations' => $this->mapTranslationsForForm($category->translations),
            ],
            'locales' => $this->supportedLocales(),
        ]);
    }

    public function update(UpdateLessonCategoryRequest $request, LessonCategory $category): RedirectResponse
    {
        $validated = $request->validated();

        $category->update([
            'slug' => $validated['slug'],
            'sort_order' => (int) ($validated['sort_order'] ?? $category->sort_order),
        ]);

        $this->syncTranslations($category, $validated['translations']);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Lesson category saved.'),
        ]);

        return to_route('admin.lesson-categories.edit', $category);
    }

    public function destroy(LessonCategory $category): RedirectResponse
    {
        if ($category->lessons()->exists()) {
            Inertia::flash('toast', [
                'type' => 'error',
                'message' => __('Move or delete the lessons in this category first.'),
            ]);

            return back();
        }

        $category->delete();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Lesson category deleted.'),
        ]);

        return to_route('admin.lesson-categories.index');
    }

    public function moveUp(LessonCategory $category): RedirectResponse
    {
        $this->swapWithNeighbor(LessonCategory::query(), $category, 'up');

        return back();
    }

    public function moveDown(LessonCategory $category): RedirectResponse
    {
        $this->swapWithNeighbor(LessonCategory::query(), $category, 'down');

        return back();
    }

    /**
     * @param  array<string, array{name: string}>  $translations
     */
    private function syncTranslations(LessonCategory $category, array $translations): void
    {
        foreach ($translations as $locale => $content) {
            $category->translations()->updateOrCreate(
                ['locale' => $locale],
                ['name' => $content['name']],
            );
        }
    }

    /**
     * @return array<string, array{name: string}>
     */
    private function emptyTranslations(): array
    {
        return collect($this->supportedLocales())
            ->mapWithKeys(fn (string $locale): array => [$locale => ['name' => '']])
            ->all();
    }

    /**
     * @param  iterable<int, LessonCategoryTranslation>  $existing
     * @return array<string, array{name: string}>
     */
    private function mapTranslationsForForm(iterable $existing): array
    {
        $byLocale = collect($existing)->keyBy('locale');

        return collect($this->supportedLocales())->mapWithKeys(function (string $locale) use ($byLocale): array {
            $row = $byLocale->get($locale);

            return [$locale => ['name' => $row->name ?? '']];
        })->all();
    }
}
