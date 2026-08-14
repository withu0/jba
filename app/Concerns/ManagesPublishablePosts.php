<?php

namespace App\Concerns;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

trait ManagesPublishablePosts
{
    /**
     * @param  array<string, mixed>  $validated
     * @return array{is_published: bool, published_at: mixed, featured_image_path?: string|null}
     */
    protected function publishableAttributes(array $validated, ?Model $existing = null): array
    {
        $isPublished = (bool) ($validated['is_published'] ?? false);
        $publishedAt = $validated['published_at'] ?? null;

        if ($isPublished && $publishedAt === null) {
            $publishedAt = now();
        }

        $attributes = [
            'is_published' => $isPublished,
            'published_at' => $publishedAt,
        ];

        if (! empty($validated['remove_featured_image']) && $existing?->getAttribute('featured_image_path')) {
            Storage::disk('public')->delete($existing->getAttribute('featured_image_path'));
            $attributes['featured_image_path'] = null;
        }

        if (($validated['featured_image'] ?? null) instanceof UploadedFile) {
            if ($existing?->getAttribute('featured_image_path')) {
                Storage::disk('public')->delete($existing->getAttribute('featured_image_path'));
            }

            $attributes['featured_image_path'] = $validated['featured_image']->store(
                $this->featuredImageDirectory(),
                'public',
            );
        }

        return $attributes;
    }

    /**
     * @param  array<string, array{slug: string, title: string, excerpt?: string|null, body?: string|null}>  $translations
     */
    protected function syncTranslations(Model $post, array $translations): void
    {
        foreach ($translations as $locale => $content) {
            $post->translations()->updateOrCreate(
                ['locale' => $locale],
                [
                    'slug' => $content['slug'],
                    'title' => $content['title'],
                    'excerpt' => $content['excerpt'] ?? null,
                    'body' => $content['body'] ?? null,
                ],
            );
        }
    }

    /**
     * @return array<string, array{slug: string, title: string, excerpt: string, body: string}>
     */
    protected function emptyTranslations(): array
    {
        $locales = config('localization.supported', ['ja', 'en', 'zh']);

        return collect($locales)->mapWithKeys(fn (string $locale): array => [
            $locale => [
                'slug' => '',
                'title' => '',
                'excerpt' => '',
                'body' => '',
            ],
        ])->all();
    }

    /**
     * @param  iterable<int, object{locale: string, slug: string, title: string, excerpt: ?string, body: ?string}>  $existing
     * @return array<string, array{slug: string, title: string, excerpt: string, body: string}>
     */
    protected function mapTranslationsForForm(iterable $existing): array
    {
        $locales = config('localization.supported', ['ja', 'en', 'zh']);
        $byLocale = collect($existing)->keyBy('locale');

        return collect($locales)->mapWithKeys(function (string $locale) use ($byLocale): array {
            $row = $byLocale->get($locale);

            return [
                $locale => [
                    'slug' => $row->slug ?? '',
                    'title' => $row->title ?? '',
                    'excerpt' => $row->excerpt ?? '',
                    'body' => $row->body ?? '',
                ],
            ];
        })->all();
    }

    protected function featuredImageDirectory(): string
    {
        return 'posts';
    }
}
