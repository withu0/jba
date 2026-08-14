<?php

namespace Database\Factories;

use App\Models\MangaCategory;
use App\Models\MangaEpisode;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<MangaEpisode>
 */
class MangaEpisodeFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->unique()->words(3, true);

        return [
            'manga_category_id' => MangaCategory::factory(),
            'slug' => Str::slug($name),
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
