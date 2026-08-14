<?php

namespace Database\Seeders;

use App\Models\News;
use Illuminate\Database\Seeder;

class NewsSeeder extends Seeder
{
    /**
     * Seed sample news posts with ja/en/zh translations.
     */
    public function run(): void
    {
        /** @var list<array{slug: string, is_published: bool, published_at: ?string, translations: array<string, array{slug: string, title: string, excerpt: string, body: string}>}> $posts */
        $posts = require __DIR__.'/data/news.php';

        foreach ($posts as $postData) {
            $jaSlug = $postData['translations']['ja']['slug'] ?? $postData['slug'];

            $existing = News::query()
                ->whereHas('translations', fn ($q) => $q->where('locale', 'ja')->where('slug', $jaSlug))
                ->first();

            $news = $existing ?? new News;
            $news->fill([
                'is_published' => $postData['is_published'],
                'published_at' => $postData['published_at'],
            ]);
            $news->save();

            foreach ($postData['translations'] as $locale => $content) {
                $news->translations()->updateOrCreate(
                    ['locale' => $locale],
                    [
                        'slug' => $content['slug'],
                        'title' => $content['title'],
                        'excerpt' => $content['excerpt'],
                        'body' => $content['body'],
                    ],
                );
            }
        }
    }
}
