<?php

namespace Tests\Feature\Admin;

use App\Models\Admin;
use App\Models\MangaCategory;
use App\Models\MangaEpisode;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class MangaAdminTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_cannot_access_manga_admin(): void
    {
        $this->get(route('admin.manga.index'))
            ->assertRedirect(route('admin.login'));

        $this->get(route('admin.manga-categories.index'))
            ->assertRedirect(route('admin.login'));
    }

    public function test_admin_can_crud_manga_categories(): void
    {
        $admin = Admin::factory()->create();

        $this->actingAs($admin, 'admin')
            ->post(route('admin.manga-categories.store'), [
                'slug' => 'welcome',
                'sort_order' => 1,
                'translations' => [
                    'ja' => ['name' => 'ウェルカム'],
                    'en' => ['name' => 'Welcome'],
                    'zh' => ['name' => '欢迎'],
                ],
            ])
            ->assertRedirect(route('admin.manga-categories.index'));

        $category = MangaCategory::query()->where('slug', 'welcome')->firstOrFail();

        $this->actingAs($admin, 'admin')
            ->put(route('admin.manga-categories.update', $category), [
                'slug' => 'welcome',
                'sort_order' => 1,
                'translations' => [
                    'ja' => ['name' => 'ウェルカム'],
                    'en' => ['name' => 'Renamed welcome'],
                    'zh' => ['name' => '欢迎'],
                ],
            ])
            ->assertRedirect(route('admin.manga-categories.edit', $category));

        $this->assertDatabaseHas('manga_category_translations', [
            'manga_category_id' => $category->id,
            'locale' => 'en',
            'name' => 'Renamed welcome',
        ]);

        $this->actingAs($admin, 'admin')
            ->delete(route('admin.manga-categories.destroy', $category))
            ->assertRedirect(route('admin.manga-categories.index'));

        $this->assertDatabaseMissing('manga_categories', ['id' => $category->id]);
    }

    public function test_categories_holding_episodes_cannot_be_deleted(): void
    {
        $admin = Admin::factory()->create();
        $category = $this->category();
        MangaEpisode::factory()->create(['manga_category_id' => $category->id]);

        $this->actingAs($admin, 'admin')
            ->from(route('admin.manga-categories.index'))
            ->delete(route('admin.manga-categories.destroy', $category))
            ->assertRedirect(route('admin.manga-categories.index'));

        $this->assertDatabaseHas('manga_categories', ['id' => $category->id]);
    }

    public function test_admin_can_create_and_update_an_episode(): void
    {
        $admin = Admin::factory()->create();
        $category = $this->category();

        $this->actingAs($admin, 'admin')
            ->post(route('admin.manga.store'), [
                'manga_category_id' => $category->id,
                'slug' => 'episode-1',
                'is_published' => '1',
                'sort_order' => 1,
                'translations' => $this->episodeTranslations(),
            ])
            ->assertRedirect();

        $episode = MangaEpisode::query()->where('slug', 'episode-1')->firstOrFail();

        $this->assertTrue($episode->is_published);
        $this->assertDatabaseHas('manga_episode_translations', [
            'manga_episode_id' => $episode->id,
            'locale' => 'en',
            'title' => 'Episode 1',
        ]);

        $this->actingAs($admin, 'admin')
            ->put(route('admin.manga.update', $episode), [
                'manga_category_id' => $category->id,
                'slug' => 'episode-1',
                'is_published' => '0',
                'sort_order' => 2,
                'translations' => [
                    'ja' => ['title' => '第1話', 'description' => '説明'],
                    'en' => ['title' => 'Episode 1 revised', 'description' => 'Lead'],
                    'zh' => ['title' => '第1集', 'description' => '简介'],
                ],
            ])
            ->assertRedirect(route('admin.manga.edit', $episode));

        $this->assertFalse($episode->fresh()?->is_published);
        $this->assertDatabaseHas('manga_episode_translations', [
            'manga_episode_id' => $episode->id,
            'locale' => 'en',
            'title' => 'Episode 1 revised',
        ]);
    }

    public function test_admin_can_upload_reorder_and_delete_pages(): void
    {
        Storage::fake('public');
        $admin = Admin::factory()->create();
        $episode = MangaEpisode::factory()->create([
            'manga_category_id' => $this->category()->id,
        ]);

        $this->actingAs($admin, 'admin')
            ->post(route('admin.manga.pages.store', $episode), [
                'locale' => 'en',
                'image' => UploadedFile::fake()->image('cover.jpg'),
            ])
            ->assertRedirect(route('admin.manga.edit', ['episode' => $episode, 'page_locale' => 'en']));

        $this->actingAs($admin, 'admin')
            ->post(route('admin.manga.pages.store', $episode), [
                'locale' => 'en',
                'image' => UploadedFile::fake()->image('02.jpg'),
            ])
            ->assertRedirect();

        $pages = $episode->pages()->forLocale('en')->orderBy('sort_order')->get();
        $this->assertCount(2, $pages);
        $this->assertStringStartsWith("manga/{$episode->id}/en/", $pages[0]->image_path);
        Storage::disk('public')->assertExists($pages[0]->image_path);

        $first = $pages[0];
        $second = $pages[1];

        $this->actingAs($admin, 'admin')
            ->post(route('admin.manga-pages.move-down', $first))
            ->assertRedirect(route('admin.manga.edit', ['episode' => $episode, 'page_locale' => 'en']));

        $this->assertSame(1, $second->fresh()?->sort_order);
        $this->assertSame(2, $first->fresh()?->sort_order);

        $this->actingAs($admin, 'admin')
            ->delete(route('admin.manga-pages.destroy', $first))
            ->assertRedirect(route('admin.manga.edit', ['episode' => $episode, 'page_locale' => 'en']));

        $this->assertDatabaseMissing('manga_pages', ['id' => $first->id]);
        Storage::disk('public')->assertMissing($first->image_path);
    }

    public function test_admin_can_reorder_episodes_within_a_category(): void
    {
        $admin = Admin::factory()->create();
        $category = $this->category();
        $first = MangaEpisode::factory()->create([
            'manga_category_id' => $category->id,
            'sort_order' => 1,
        ]);
        $second = MangaEpisode::factory()->create([
            'manga_category_id' => $category->id,
            'sort_order' => 2,
        ]);
        $other = MangaEpisode::factory()->create([
            'manga_category_id' => $this->category('other', 'Other', 2)->id,
            'sort_order' => 1,
        ]);

        $this->actingAs($admin, 'admin')
            ->post(route('admin.manga.move-down', $first))
            ->assertRedirect();

        $this->assertSame(1, $second->fresh()?->sort_order);
        $this->assertSame(2, $first->fresh()?->sort_order);
        $this->assertSame(1, $other->fresh()?->sort_order);
    }

    private function category(string $slug = 'welcome', string $name = 'Welcome', int $sortOrder = 1): MangaCategory
    {
        $category = MangaCategory::query()->create([
            'slug' => $slug,
            'sort_order' => $sortOrder,
        ]);

        foreach (['ja' => $name, 'en' => $name, 'zh' => $name] as $locale => $label) {
            $category->translations()->create(['locale' => $locale, 'name' => $label]);
        }

        return $category;
    }

    /**
     * @return array<string, array{title: string, description: string}>
     */
    private function episodeTranslations(): array
    {
        return [
            'ja' => ['title' => '第1話', 'description' => '説明'],
            'en' => ['title' => 'Episode 1', 'description' => 'Lead'],
            'zh' => ['title' => '第1集', 'description' => '简介'],
        ];
    }
}
