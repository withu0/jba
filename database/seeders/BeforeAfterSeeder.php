<?php

namespace Database\Seeders;

use App\Models\BeforeAfter;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;

class BeforeAfterSeeder extends Seeder
{
    /**
     * Seed sample before/after gallery pairs with placeholder images.
     */
    public function run(): void
    {
        /** @var list<array{key: string, sort_order: int, is_published: bool, translations: array<string, array{title: string, caption: string}>}> $pairs */
        $pairs = require __DIR__.'/data/before_afters.php';

        foreach ($pairs as $index => $pairData) {
            $beforePath = $this->ensurePlaceholder(
                "before-after/{$pairData['key']}-before.svg",
                'BEFORE',
                $index % 2 === 0 ? '#6B7C8A' : '#8A7B6B',
            );
            $afterPath = $this->ensurePlaceholder(
                "before-after/{$pairData['key']}-after.svg",
                'AFTER',
                $index % 2 === 0 ? '#349CCA' : '#2A7FA8',
            );

            $pair = BeforeAfter::query()
                ->whereHas(
                    'translations',
                    fn ($q) => $q
                        ->where('locale', 'ja')
                        ->where('title', $pairData['translations']['ja']['title']),
                )
                ->first() ?? new BeforeAfter;

            $pair->fill([
                'before_image_path' => $beforePath,
                'after_image_path' => $afterPath,
                'sort_order' => $pairData['sort_order'],
                'is_published' => $pairData['is_published'],
            ]);
            $pair->save();

            foreach ($pairData['translations'] as $locale => $content) {
                $pair->translations()->updateOrCreate(
                    ['locale' => $locale],
                    [
                        'title' => $content['title'],
                        'caption' => $content['caption'],
                    ],
                );
            }
        }
    }

    private function ensurePlaceholder(string $path, string $label, string $bg): string
    {
        if (! Storage::disk('public')->exists($path)) {
            $svg = <<<SVG
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
  <rect width="800" height="600" fill="{$bg}"/>
  <text x="400" y="290" text-anchor="middle" fill="#ffffff" font-family="Georgia, serif" font-size="56" font-weight="700">{$label}</text>
  <text x="400" y="350" text-anchor="middle" fill="#ffffff" font-family="sans-serif" font-size="20" opacity="0.85">JBA placeholder</text>
</svg>
SVG;
            Storage::disk('public')->put($path, $svg);
        }

        // Ensure the public disk root exists for storage:link consumers.
        File::ensureDirectoryExists(Storage::disk('public')->path('before-after'));

        return $path;
    }
}
