<?php

namespace App\Http\Controllers\Admin;

use App\Concerns\ReordersSortableRecords;
use App\Concerns\ResolvesContentLocales;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreMangaEpisodeRequest;
use App\Http\Requests\Admin\UpdateMangaEpisodeRequest;
use App\Models\MangaCategory;
use App\Models\MangaEpisode;
use App\Models\MangaEpisodeTranslation;
use App\Models\MangaPage;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class MangaEpisodeController extends Controller
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

        $episodes = MangaEpisode::query()
            ->with(['translations', 'category.translations'])
            ->withCount('pages')
            ->when($categoryId, fn ($query, int $id) => $query->where('manga_category_id', $id))
            ->orderBy('manga_category_id')
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get()
            ->map(fn (MangaEpisode $episode): array => [
                'id' => $episode->id,
                'manga_category_id' => $episode->manga_category_id,
                'category_name' => $episode->category?->translationFor('ja')->name
                    ?? $episode->category->slug
                    ?? '',
                'slug' => $episode->slug,
                'is_published' => $episode->is_published,
                'sort_order' => $episode->sort_order,
                'pages_count' => $episode->pages_count,
                'title' => $episode->translationFor('ja')->title
                    ?? $episode->translations->first()->title
                    ?? '#'.$episode->id,
            ]);

        return Inertia::render('admin/manga/index', [
            'episodes' => $episodes,
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

        return Inertia::render('admin/manga/create', [
            'categories' => $categories,
            'categoryId' => $categoryId,
            'locales' => $this->supportedLocales(),
            'translations' => $this->emptyTranslations(),
            'nextSortOrder' => $this->nextSortOrder($categoryId),
        ]);
    }

    public function store(StoreMangaEpisodeRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $categoryId = (int) $validated['manga_category_id'];

        $episode = MangaEpisode::query()->create([
            'manga_category_id' => $categoryId,
            'slug' => $validated['slug'],
            'sort_order' => (int) ($validated['sort_order'] ?? $this->nextSortOrder($categoryId)),
            'is_published' => (bool) ($validated['is_published'] ?? false),
        ]);

        $this->syncTranslations($episode, $validated['translations']);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Manga episode created.'),
        ]);

        return to_route('admin.manga.edit', $episode);
    }

    public function edit(Request $request, MangaEpisode $episode): Response
    {
        $episode->load('translations');

        $locales = $this->supportedLocales();
        $locale = $request->string('locale')->toString();

        if (! in_array($locale, $locales, true)) {
            $locale = $locales[0] ?? 'ja';
        }

        $pages = $episode->pages()
            ->forLocale($locale)
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get()
            ->map(fn (MangaPage $page): array => [
                'id' => $page->id,
                'locale' => $page->locale,
                'sort_order' => $page->sort_order,
                'image_url' => $page->image_url,
            ]);

        return Inertia::render('admin/manga/edit', [
            'episode' => [
                'id' => $episode->id,
                'manga_category_id' => $episode->manga_category_id,
                'slug' => $episode->slug,
                'is_published' => $episode->is_published,
                'sort_order' => $episode->sort_order,
                'translations' => $this->mapTranslationsForForm($episode->translations),
            ],
            'categories' => $this->categoryOptions(),
            'locales' => $locales,
            'locale' => $locale,
            'pages' => $pages,
            'nextPageSortOrder' => (int) $episode->pages()->forLocale($locale)->max('sort_order') + 1,
        ]);
    }

    public function update(UpdateMangaEpisodeRequest $request, MangaEpisode $episode): RedirectResponse
    {
        $validated = $request->validated();

        $episode->update([
            'manga_category_id' => (int) $validated['manga_category_id'],
            'slug' => $validated['slug'],
            'sort_order' => (int) ($validated['sort_order'] ?? $episode->sort_order),
            'is_published' => (bool) ($validated['is_published'] ?? false),
        ]);

        $this->syncTranslations($episode, $validated['translations']);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Manga episode saved.'),
        ]);

        return to_route('admin.manga.edit', $episode);
    }

    public function destroy(MangaEpisode $episode): RedirectResponse
    {
        $episode->load('pages');

        foreach ($episode->pages as $page) {
            Storage::disk('public')->delete($page->image_path);
        }

        Storage::disk('public')->deleteDirectory("manga/{$episode->id}");

        $episode->delete();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Manga episode deleted.'),
        ]);

        return to_route('admin.manga.index');
    }

    public function moveUp(MangaEpisode $episode): RedirectResponse
    {
        $this->swapWithNeighbor($this->siblingsOf($episode), $episode, 'up');

        return back();
    }

    public function moveDown(MangaEpisode $episode): RedirectResponse
    {
        $this->swapWithNeighbor($this->siblingsOf($episode), $episode, 'down');

        return back();
    }

    /**
     * @return Builder<MangaEpisode>
     */
    private function siblingsOf(MangaEpisode $episode): Builder
    {
        return MangaEpisode::query()->where('manga_category_id', $episode->manga_category_id);
    }

    private function nextSortOrder(?int $categoryId): int
    {
        return (int) MangaEpisode::query()
            ->where('manga_category_id', $categoryId)
            ->max('sort_order') + 1;
    }

    /**
     * @return list<array{id: int, name: string, slug: string}>
     */
    private function categoryOptions(): array
    {
        return array_values(
            MangaCategory::query()
                ->with('translations')
                ->orderBy('sort_order')
                ->orderBy('id')
                ->get()
                ->map(fn (MangaCategory $category): array => [
                    'id' => $category->id,
                    'slug' => $category->slug,
                    'name' => $category->translationFor()->name ?? $category->slug,
                ])
                ->all()
        );
    }

    /**
     * @param  array<string, array{title: string, description?: string|null}>  $translations
     */
    private function syncTranslations(MangaEpisode $episode, array $translations): void
    {
        foreach ($translations as $locale => $content) {
            $episode->translations()->updateOrCreate(
                ['locale' => $locale],
                [
                    'title' => $content['title'],
                    'description' => $content['description'] ?? null,
                ],
            );
        }
    }

    /**
     * @return array<string, array{title: string, description: string}>
     */
    private function emptyTranslations(): array
    {
        return collect($this->supportedLocales())->mapWithKeys(fn (string $locale): array => [
            $locale => ['title' => '', 'description' => ''],
        ])->all();
    }

    /**
     * @param  iterable<int, MangaEpisodeTranslation>  $existing
     * @return array<string, array{title: string, description: string}>
     */
    private function mapTranslationsForForm(iterable $existing): array
    {
        $byLocale = collect($existing)->keyBy('locale');

        return collect($this->supportedLocales())->mapWithKeys(function (string $locale) use ($byLocale): array {
            $row = $byLocale->get($locale);

            return [
                $locale => [
                    'title' => $row->title ?? '',
                    'description' => $row->description ?? '',
                ],
            ];
        })->all();
    }
}
