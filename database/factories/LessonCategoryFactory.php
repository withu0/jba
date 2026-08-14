<?php

namespace Database\Factories;

use App\Models\LessonCategory;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<LessonCategory>
 */
class LessonCategoryFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->unique()->words(2, true);

        return [
            'slug' => Str::slug($name),
            'sort_order' => fake()->numberBetween(0, 100),
        ];
    }
}
