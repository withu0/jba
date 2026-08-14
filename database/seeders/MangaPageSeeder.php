<?php

namespace Database\Seeders;

use App\Models\MangaCategory;
use App\Models\MangaEpisode;
use App\Models\MangaPage;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;

/**
 * Seeds the Harido (鍼道) series + Episode 1 with ja/en page images.
 *
 * Approach: copy source files into the public disk
 * (storage/app/public/manga/{episode_id}/{locale}/)
 * so admin uploads and seeded pages share the same Storage::disk('public') URLs.
 * Originals under database/seeders/data/manga/{jp,en} remain as the seeder source of truth.
 * (Kept out of public/ so the directory does not shadow the /manga route.)
 *
 * zh is not seeded — the public viewer falls back to en (MangaPage::LOCALE_FALLBACKS).
 */
class MangaPageSeeder extends Seeder
{
    /**
     * Filename order for each book (cover first, then numbered pages).
     *
     * @var list<string>
     */
    private const PAGE_FILES = [
        'cover.jpg',
        '02.jpg',
        '03.jpg',
        '04.jpg',
        '05.jpg',
        '06.jpg',
        '07.jpg',
        '08.jpg',
        '09.jpg',
        '10.jpg',
        '11.jpg',
    ];

    /**
     * UI locale => folder under database/seeders/data/manga.
     *
     * @var array<string, string>
     */
    private const SOURCE_FOLDERS = [
        'ja' => 'jp',
        'en' => 'en',
    ];

    public function run(): void
    {
        $category = $this->seedCategory();
        $episode = $this->seedEpisode($category);

        foreach (self::SOURCE_FOLDERS as $locale => $sourceFolder) {
            $this->seedLocale($episode, $locale, $sourceFolder);
        }
    }

    private function seedCategory(): MangaCategory
    {
        $category = MangaCategory::query()->where('slug', 'harido')->first()
            ?? MangaCategory::query()->where('slug', 'welcome')->first();

        if ($category === null) {
            $category = MangaCategory::query()->create([
                'slug' => 'harido',
                'sort_order' => 1,
            ]);
        } else {
            $category->update([
                'slug' => 'harido',
                'sort_order' => 1,
            ]);
        }

        foreach ([
            'ja' => '鍼道',
            'en' => 'Harido',
            'zh' => '针道',
        ] as $locale => $name) {
            $category->translations()->updateOrCreate(
                ['locale' => $locale],
                ['name' => $name],
            );
        }

        return $category;
    }

    private function seedEpisode(MangaCategory $category): MangaEpisode
    {
        $episode = MangaEpisode::query()->updateOrCreate(
            ['slug' => 'episode-1'],
            [
                'manga_category_id' => $category->id,
                'sort_order' => 1,
                'is_published' => true,
            ],
        );

        foreach ([
            'ja' => [
                'title' => '第1話',
                'description' => '美容鍼の世界をめくる、はじめての一冊。',
            ],
            'en' => [
                'title' => 'Episode 1',
                'description' => 'Turn the pages to explore beauty acupuncture.',
            ],
            'zh' => [
                'title' => '第1集',
                'description' => '翻页了解美容针灸的世界。',
            ],
        ] as $locale => $content) {
            $episode->translations()->updateOrCreate(
                ['locale' => $locale],
                $content,
            );
        }

        return $episode;
    }

    private function seedLocale(MangaEpisode $episode, string $locale, string $sourceFolder): void
    {
        $sourceDir = database_path("seeders/data/manga/{$sourceFolder}");

        if (! is_dir($sourceDir)) {
            $this->command?->warn("Manga source missing: {$sourceDir}");

            return;
        }

        $directory = "manga/{$episode->id}/{$locale}";
        File::ensureDirectoryExists(Storage::disk('public')->path($directory));

        foreach (self::PAGE_FILES as $index => $filename) {
            $sourcePath = "{$sourceDir}/{$filename}";

            if (! is_file($sourcePath)) {
                $this->command?->warn("Skipping missing manga file: {$sourcePath}");

                continue;
            }

            $storagePath = "{$directory}/{$filename}";

            if (! Storage::disk('public')->exists($storagePath)) {
                Storage::disk('public')->put(
                    $storagePath,
                    File::get($sourcePath),
                );
            }

            MangaPage::query()->updateOrCreate(
                [
                    'manga_episode_id' => $episode->id,
                    'locale' => $locale,
                    'sort_order' => $index + 1,
                ],
                [
                    'image_path' => $storagePath,
                ],
            );
        }
    }
}
