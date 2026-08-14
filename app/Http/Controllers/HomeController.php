<?php

namespace App\Http\Controllers;

use App\Models\BeforeAfter;
use App\Models\Interview;
use App\Models\LessonCategory;
use App\Models\MangaEpisode;
use App\Models\News;
use Illuminate\Database\Eloquent\Model;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    /**
     * Marketing top page. Static copy lives in the i18n bundles; the teasers
     * below are pulled from content the admin panel already manages.
     */
    public function __invoke(): Response
    {
        return Inertia::render('home', [
            'news' => $this->posts(News::query()),
            'interviews' => $this->posts(Interview::query()),
            'pairs' => $this->beforeAfterPairs(),
            'lessonCategories' => $this->lessonCategories(),
            'mangaEpisode' => $this->featuredMangaEpisode(),
        ]);
    }

    /**
     * @param  \Illuminate\Database\Eloquent\Builder<News|Interview>  $query
     * @return list<array{id: int, slug: string, title: string, excerpt: ?string, published_at: ?string, featured_image_url: ?string}>
     */
    private function posts($query): array
    {
        return $query
            ->published()
            ->with('translations')
            ->orderByDesc('published_at')
            ->limit(3)
            ->get()
            ->map(function (Model $post): ?array {
                /** @var News|Interview $post */
                $translation = $post->translationFor();

                if ($translation === null) {
                    return null;
                }

                return [
                    'id' => $post->id,
                    'slug' => $translation->slug,
                    'title' => $translation->title,
                    'excerpt' => $translation->excerpt,
                    'published_at' => $post->published_at?->toIso8601String(),
                    'featured_image_url' => $post->featured_image_url,
                ];
            })
            ->filter()
            ->values()
            ->all();
    }

    /**
     * @return list<array{id: int, title: string, caption: ?string, before_image_url: ?string, after_image_url: ?string}>
     */
    private function beforeAfterPairs(): array
    {
        return BeforeAfter::query()
            ->published()
            ->with('translations')
            ->orderBy('sort_order')
            ->orderBy('id')
            ->limit(3)
            ->get()
            ->map(function (BeforeAfter $pair): array {
                $translation = $pair->translationFor();

                return [
                    'id' => $pair->id,
                    'title' => $translation?->title ?? '',
                    'caption' => $translation?->caption,
                    'before_image_url' => $pair->before_image_url,
                    'after_image_url' => $pair->after_image_url,
                ];
            })
            ->values()
            ->all();
    }

    /**
     * @return list<array{id: int, slug: string, name: string, lessons_count: int}>
     */
    private function lessonCategories(): array
    {
        return LessonCategory::query()
            ->with('translations')
            ->withCount(['lessons' => fn ($query) => $query->published()])
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get()
            ->map(fn (LessonCategory $category): array => [
                'id' => $category->id,
                'slug' => $category->slug,
                'name' => $category->translationFor()?->name ?? $category->slug,
                'lessons_count' => (int) $category->lessons_count,
            ])
            ->values()
            ->all();
    }

    /**
     * @return array{slug: string, title: string, description: ?string, cover_url: ?string}|null
     */
    private function featuredMangaEpisode(): ?array
    {
        $episode = MangaEpisode::query()
            ->published()
            ->with(['translations', 'pages'])
            ->orderBy('sort_order')
            ->orderBy('id')
            ->first();

        if ($episode === null) {
            return null;
        }

        $translation = $episode->translationFor();

        return [
            'slug' => $episode->slug,
            'title' => $translation->title ?? $episode->slug,
            'description' => $translation->description,
            'cover_url' => $episode->coverUrl(),
        ];
    }
}
