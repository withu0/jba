<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     *
     * Domain seeders are added by each implementation section as separate classes.
     * Call them from here when created — see docs/implementation/SEEDING.md.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        $this->call([
            AdminSeeder::class,
            PageContentSeeder::class,
            NewsSeeder::class,
            InterviewSeeder::class,
            BeforeAfterSeeder::class,
            MangaPageSeeder::class,
            LessonCategorySeeder::class,
            LessonSeeder::class,
            ContactSeeder::class,
        ]);
    }
}
