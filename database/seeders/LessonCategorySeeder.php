<?php

namespace Database\Seeders;

use App\Models\LessonCategory;
use Illuminate\Database\Seeder;

class LessonCategorySeeder extends Seeder
{
    /**
     * Seed the six fixed lesson categories with ja / en / zh names.
     */
    public function run(): void
    {
        /** @var list<array{slug: string, sort_order: int, translations: array<string, array{name: string}>}> $categories */
        $categories = require __DIR__.'/data/lesson_categories.php';

        foreach ($categories as $categoryData) {
            $category = LessonCategory::query()->updateOrCreate(
                ['slug' => $categoryData['slug']],
                ['sort_order' => $categoryData['sort_order']],
            );

            foreach ($categoryData['translations'] as $locale => $content) {
                $category->translations()->updateOrCreate(
                    ['locale' => $locale],
                    ['name' => $content['name']],
                );
            }
        }
    }
}
