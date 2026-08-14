<?php

namespace Database\Factories;

use App\Models\Lesson;
use App\Models\LessonImage;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<LessonImage>
 */
class LessonImageFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'lesson_id' => Lesson::factory(),
            'image_path' => 'lessons/placeholder.jpg',
            'sort_order' => fake()->numberBetween(0, 20),
        ];
    }
}
