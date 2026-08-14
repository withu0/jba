<?php

namespace Database\Factories;

use App\Models\Lesson;
use App\Models\LessonCategory;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Lesson>
 */
class LessonFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'lesson_category_id' => LessonCategory::factory(),
            'video_path' => null,
            'video_url' => null,
            'sort_order' => fake()->numberBetween(0, 100),
            'is_published' => false,
        ];
    }

    public function published(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_published' => true,
        ]);
    }
}
