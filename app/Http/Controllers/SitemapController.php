<?php

namespace App\Http\Controllers;

use App\Models\Interview;
use App\Models\MangaEpisode;
use App\Models\News;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    public function __invoke(): Response
    {
        $urls = [
            $this->url(route('home'), 'weekly', '1.0'),
            $this->url(route('about'), 'monthly', '0.8'),
            $this->url(route('news.index'), 'weekly', '0.8'),
            $this->url(route('interviews.index'), 'weekly', '0.8'),
            $this->url(route('counseling'), 'monthly', '0.7'),
            $this->url(route('before-after'), 'weekly', '0.7'),
            $this->url(route('contraindications'), 'monthly', '0.6'),
            $this->url(route('manga.index'), 'weekly', '0.7'),
        ];

        foreach (News::query()->published()->with('translations')->get() as $news) {
            $slug = $news->translationFor()?->slug;

            if (filled($slug)) {
                $urls[] = $this->url(
                    route('news.show', $slug),
                    'weekly',
                    '0.6',
                    $news->published_at?->toAtomString(),
                );
            }
        }

        foreach (Interview::query()->published()->with('translations')->get() as $interview) {
            $slug = $interview->translationFor()?->slug;

            if (filled($slug)) {
                $urls[] = $this->url(
                    route('interviews.show', $slug),
                    'weekly',
                    '0.6',
                    $interview->published_at?->toAtomString(),
                );
            }
        }

        foreach (MangaEpisode::query()->published()->orderBy('sort_order')->orderBy('id')->get() as $episode) {
            $urls[] = $this->url(
                route('manga.show', $episode),
                'weekly',
                '0.6',
            );
        }

        return response()
            ->view('sitemap', ['urls' => $urls])
            ->header('Content-Type', 'application/xml; charset=UTF-8');
    }

    /**
     * @return array{loc: string, changefreq: string, priority: string, lastmod: string|null}
     */
    private function url(string $loc, string $changefreq, string $priority, ?string $lastmod = null): array
    {
        return [
            'loc' => $loc,
            'changefreq' => $changefreq,
            'priority' => $priority,
            'lastmod' => $lastmod,
        ];
    }
}
