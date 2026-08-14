<?php

namespace Database\Seeders;

use App\Models\Interview;
use Illuminate\Database\Seeder;

class InterviewSeeder extends Seeder
{
    /**
     * Seed sample interviews with ja/en/zh translations.
     */
    public function run(): void
    {
        /** @var list<array{slug: string, is_published: bool, published_at: ?string, translations: array<string, array{slug: string, title: string, excerpt: string, body: string}>}> $posts */
        $posts = require __DIR__.'/data/interviews.php';

        foreach ($posts as $postData) {
            $jaSlug = $postData['translations']['ja']['slug'] ?? $postData['slug'];

            $existing = Interview::query()
                ->whereHas('translations', fn ($q) => $q->where('locale', 'ja')->where('slug', $jaSlug))
                ->first();

            $interview = $existing ?? new Interview;
            $interview->fill([
                'is_published' => $postData['is_published'],
                'published_at' => $postData['published_at'],
            ]);
            $interview->save();

            foreach ($postData['translations'] as $locale => $content) {
                $interview->translations()->updateOrCreate(
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
