<?php

namespace Database\Factories;

use App\Models\BeforeAfter;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<BeforeAfter>
 */
class BeforeAfterFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'before_image_path' => 'before-after/before-placeholder.jpg',
            'after_image_path' => 'before-after/after-placeholder.jpg',
            'sort_order' => fake()->numberBetween(0, 100),
            'is_published' => true,
        ];
    }
}
