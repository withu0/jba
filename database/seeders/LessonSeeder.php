<?php

namespace Database\Seeders;

use App\Models\Lesson;
use App\Models\LessonCategory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class LessonSeeder extends Seeder
{
    /**
     * Seed one sample lesson per category, each with placeholder step images.
     *
     * Videos are left empty on purpose: no binaries are committed, and admins
     * upload the real files through the CMS.
     */
    public function run(): void
    {
        /** @var list<array{category: string, sort_order: int, is_published: bool, translations: array<string, array{title: string, body: string}>, images: list<array{key: string, translations: array<string, array{caption: string}>}>}> $lessons */
        $lessons = require __DIR__.'/data/lessons.php';

        $categoryIds = LessonCategory::query()->pluck('id', 'slug');

        foreach ($lessons as $lessonData) {
            $categoryId = $categoryIds->get($lessonData['category']);

            if ($categoryId === null) {
                continue;
            }

            $lesson = Lesson::query()
                ->where('lesson_category_id', $categoryId)
                ->whereHas(
                    'translations',
                    fn ($query) => $query
                        ->where('locale', 'ja')
                        ->where('title', $lessonData['translations']['ja']['title']),
                )
                ->first() ?? new Lesson;

            $lesson->fill([
                'lesson_category_id' => $categoryId,
                'sort_order' => $lessonData['sort_order'],
                'is_published' => $lessonData['is_published'],
            ]);
            $lesson->save();

            foreach ($lessonData['translations'] as $locale => $content) {
                $lesson->translations()->updateOrCreate(
                    ['locale' => $locale],
                    [
                        'title' => $content['title'],
                        'body' => $content['body'],
                    ],
                );
            }

            foreach ($lessonData['images'] as $index => $imageData) {
                $path = $this->ensurePlaceholder(
                    "lessons/{$lesson->id}/images/{$imageData['key']}.svg",
                    $index + 1,
                    $lessonData['translations']['en']['title'],
                );

                $image = $lesson->images()->updateOrCreate(
                    ['image_path' => $path],
                    ['sort_order' => $index + 1],
                );

                foreach ($imageData['translations'] as $locale => $content) {
                    $image->translations()->updateOrCreate(
                        ['locale' => $locale],
                        ['caption' => $content['caption']],
                    );
                }
            }
        }
    }

    private function ensurePlaceholder(string $path, int $step, string $label): string
    {
        if (Storage::disk('public')->exists($path)) {
            return $path;
        }

        $safeLabel = htmlspecialchars($label, ENT_QUOTES | ENT_XML1, 'UTF-8');

        $svg = <<<SVG
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
  <rect width="800" height="600" fill="#1F3547"/>
  <text x="400" y="280" text-anchor="middle" fill="#ffffff" font-family="Georgia, serif" font-size="64" font-weight="700">STEP {$step}</text>
  <text x="400" y="340" text-anchor="middle" fill="#ffffff" font-family="sans-serif" font-size="20" opacity="0.85">{$safeLabel}</text>
</svg>
SVG;

        Storage::disk('public')->put($path, $svg);

        return $path;
    }
}
