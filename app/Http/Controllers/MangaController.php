<?php

namespace App\Http\Controllers;

use App\Models\MangaCategory;
use App\Models\MangaEpisode;
use App\Models\MangaPage;
use App\Support\Seo;
use Inertia\Inertia;
use Inertia\Response;

class MangaController extends Controller
{
    /**
     * Category-grouped list of published episodes.
     */
    public function index(): Response
    {
        $categories = MangaCategory::query()
            ->with([
                'translations',
                'episodes' => fn ($query) => $query
                    ->published()
                    ->with(['translations', 'pages'])
                    ->orderBy('sort_order')
                    ->orderBy('id'),
            ])
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get()
            ->map(function (MangaCategory $category): array {
                $name = $category->translationFor()->name ?? $category->slug;

                return [
                    'id' => $category->id,
                    'slug' => $category->slug,
                    'name' => $name,
                    // An episode without pages has nothing to open, so it stays hidden.
                    'episodes' => $category->episodes
                        ->filter(fn (MangaEpisode $episode): bool => $episode->pages->isNotEmpty())
                        ->map(fn (MangaEpisode $episode): array => $this->episodeSummary($episode))
                        ->values()
                        ->all(),
                ];
            })
            ->filter(fn (array $category): bool => count($category['episodes']) > 0)
            ->values()
            ->all();

        return Inertia::render('manga/index', [
            'categories' => $categories,
        ]);
    }

    /**
     * Public flip-book viewer for one episode.
     * zh falls back to en pages when no zh rows exist (see MangaPage::LOCALE_FALLBACKS).
     */
    public function show(MangaEpisode $episode): Response
    {
        abort_unless($episode->is_published, 404);

        $episode->load(['translations', 'category.translations']);

        $uiLocale = app()->getLocale();
        $bookLocale = $episode->resolveBookLocale($uiLocale);
        $pages = MangaPage::orderedForEpisode($episode, $uiLocale)
            ->map(fn (MangaPage $page): string => $page->image_url ?? '')
            ->filter()
            ->values()
            ->all();

        $translation = $episode->translationFor($uiLocale);
        $title = $translation->title ?? $episode->slug;
        $description = $translation->description;
        $category = $episode->category;
        $categoryName = $category === null
            ? null
            : ($category->translationFor($uiLocale)->name ?? $category->slug);

        return Inertia::render('manga/show', [
            'episode' => [
                'id' => $episode->id,
                'slug' => $episode->slug,
                'title' => $title,
                'description' => $description,
                'category_name' => $categoryName,
            ],
            'pages' => $pages,
            'bookLocale' => $bookLocale,
            'usedFallback' => $bookLocale !== $uiLocale,
            'seo' => Seo::make(
                $title,
                $description,
                $pages[0] ?? null,
            ),
        ]);
    }

    /**
     * @return array{id: int, slug: string, title: string, description: string|null, cover_url: string|null}
     */
    private function episodeSummary(MangaEpisode $episode): array
    {
        $translation = $episode->translationFor();

        return [
            'id' => $episode->id,
            'slug' => $episode->slug,
            'title' => $translation->title ?? $episode->slug,
            'description' => $translation->description,
            'cover_url' => $episode->coverUrl(),
        ];
    }
}
