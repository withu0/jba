<?php

namespace Database\Factories;

use App\Models\MangaEpisode;
use App\Models\MangaPage;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<MangaPage>
 */
class MangaPageFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'manga_episode_id' => MangaEpisode::factory(),
            'locale' => fake()->randomElement(['ja', 'en', 'zh']),
            'image_path' => 'manga/placeholder.jpg',
            'sort_order' => fake()->numberBetween(0, 50),
        ];
    }
}
