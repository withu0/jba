<?php

namespace App\Http\Controllers\Admin;

use App\Concerns\ReordersSortableRecords;
use App\Concerns\ResolvesContentLocales;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ReorderRecordsRequest;
use App\Http\Requests\Admin\StoreMangaCategoryRequest;
use App\Http\Requests\Admin\UpdateMangaCategoryRequest;
use App\Models\MangaCategory;
use App\Models\MangaCategoryTranslation;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class MangaCategoryController extends Controller
{
    use ReordersSortableRecords;
    use ResolvesContentLocales;

    public function index(): Response
    {
        $categories = MangaCategory::query()
            ->with('translations')
            ->withCount('episodes')
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get()
            ->map(fn (MangaCategory $category): array => [
                'id' => $category->id,
                'slug' => $category->slug,
                'sort_order' => $category->sort_order,
                'episodes_count' => $category->episodes_count,
                'name' => $category->translationFor('ja')->name
                    ?? $category->translations->first()->name
                    ?? $category->slug,
            ]);

        return Inertia::render('admin/manga-categories/index', [
            'categories' => $categories,
            'locales' => $this->supportedLocales(),
            'translations' => $this->emptyTranslations(),
            'nextSortOrder' => (int) MangaCategory::query()->max('sort_order') + 1,
        ]);
    }

    public function store(StoreMangaCategoryRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $category = MangaCategory::query()->create([
            'slug' => $validated['slug'],
            'sort_order' => (int) ($validated['sort_order'] ?? 0),
        ]);

        $this->syncTranslations($category, $validated['translations']);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Manga category created.'),
        ]);

        return to_route('admin.manga-categories.index');
    }

    public function edit(MangaCategory $category): Response
    {
        $category->load('translations');

        return Inertia::render('admin/manga-categories/edit', [
            'category' => [
                'id' => $category->id,
                'slug' => $category->slug,
                'sort_order' => $category->sort_order,
                'translations' => $this->mapTranslationsForForm($category->translations),
            ],
            'locales' => $this->supportedLocales(),
        ]);
    }

    public function update(UpdateMangaCategoryRequest $request, MangaCategory $category): RedirectResponse
    {
        $validated = $request->validated();

        $category->update([
            'slug' => $validated['slug'],
            'sort_order' => (int) ($validated['sort_order'] ?? $category->sort_order),
        ]);

        $this->syncTranslations($category, $validated['translations']);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Manga category saved.'),
        ]);

        return to_route('admin.manga-categories.edit', $category);
    }

    public function destroy(MangaCategory $category): RedirectResponse
    {
        if ($category->episodes()->exists()) {
            Inertia::flash('toast', [
                'type' => 'error',
                'message' => __('Move or delete the episodes in this category first.'),
            ]);

            return back();
        }

        $category->delete();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Manga category deleted.'),
        ]);

        return to_route('admin.manga-categories.index');
    }

    public function moveUp(MangaCategory $category): RedirectResponse
    {
        $this->swapWithNeighbor(MangaCategory::query(), $category, 'up');

        return back();
    }

    public function moveDown(MangaCategory $category): RedirectResponse
    {
        $this->swapWithNeighbor(MangaCategory::query(), $category, 'down');

        return back();
    }

    public function reorder(ReorderRecordsRequest $request): RedirectResponse
    {
        $this->applyOrderedIds(
            MangaCategory::query(),
            new MangaCategory,
            $request->validated('ids'),
        );

        return back();
    }

    /**
     * @param  array<string, array{name: string}>  $translations
     */
    private function syncTranslations(MangaCategory $category, array $translations): void
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
     * @param  iterable<int, MangaCategoryTranslation>  $existing
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
