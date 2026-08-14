<?php

namespace Tests\Feature;

use App\Models\MangaCategory;
use App\Models\MangaEpisode;
use App\Models\MangaPage;
use Database\Seeders\MangaPageSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class MangaTest extends TestCase
{
    use RefreshDatabase;

    public function test_index_groups_published_episodes_by_category(): void
    {
        $welcome = $this->category('welcome', 'Welcome', 1);
        $extra = $this->category('extra', 'Extra', 2);

        $published = $this->episode($welcome, 'episode-1', 'Episode 1', true, 1);
        $this->page($published, 'en', 1);
        $this->episode($welcome, 'draft-ep', 'Draft', false, 2);
        $this->episode($extra, 'empty-published', 'Empty published', true, 1);

        $this->withUnencryptedCookie('locale', 'en')
            ->get(route('manga.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('manga/index')
                ->has('categories', 1)
                ->where('categories.0.slug', 'welcome')
                ->has('categories.0.episodes', 1)
                ->where('categories.0.episodes.0.slug', 'episode-1')
                ->where('categories.0.episodes.0.title', 'Episode 1')
            );
    }

    public function test_index_uses_the_first_page_as_the_cover(): void
    {
        $episode = $this->episode($this->category(), 'episode-1', 'Episode 1', true);
        $this->page($episode, 'en', 1, 'manga/cover.jpg');
        $this->page($episode, 'en', 2, 'manga/02.jpg');
        $this->page($episode, 'en', 11, 'manga/11.jpg');

        $this->withUnencryptedCookie('locale', 'en')
            ->get(route('manga.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('manga/index')
                ->where(
                    'categories.0.episodes.0.cover_url',
                    fn (string $url): bool => str_ends_with($url, '/storage/manga/cover.jpg'),
                )
            );
    }

    public function test_show_renders_published_episode_pages(): void
    {
        $episode = $this->episode($this->category(), 'episode-1', 'Episode 1', true);
        $this->page($episode, 'en', 1, 'manga/cover.jpg');
        $this->page($episode, 'en', 2, 'manga/02.jpg');

        $this->withUnencryptedCookie('locale', 'en')
            ->get(route('manga.show', $episode))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('manga/show')
                ->where('episode.slug', 'episode-1')
                ->where('episode.title', 'Episode 1')
                ->where('bookLocale', 'en')
                ->where('usedFallback', false)
                ->has('pages', 2)
                ->where('seo.title', 'Episode 1')
            );
    }

    public function test_unpublished_and_unknown_episodes_return_404(): void
    {
        $draft = $this->episode($this->category(), 'draft-ep', 'Draft', false);

        $this->get(route('manga.show', $draft))->assertNotFound();
        $this->get('/manga/does-not-exist')->assertNotFound();
    }

    public function test_zh_falls_back_to_en_pages_per_episode(): void
    {
        $category = $this->category();
        $first = $this->episode($category, 'episode-1', 'Episode 1', true, 1);
        $second = $this->episode($category, 'episode-2', 'Episode 2', true, 2);

        $this->page($first, 'en', 1, 'manga/1/en.jpg');
        $this->page($second, 'en', 1, 'manga/2/en.jpg');
        $this->page($second, 'zh', 1, 'manga/2/zh.jpg');

        $this->withUnencryptedCookie('locale', 'zh')
            ->get(route('manga.show', $first))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('bookLocale', 'en')
                ->where('usedFallback', true)
                ->where('pages.0', '/storage/manga/1/en.jpg')
            );

        $this->withUnencryptedCookie('locale', 'zh')
            ->get(route('manga.show', $second))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('bookLocale', 'zh')
                ->where('usedFallback', false)
                ->where('pages.0', '/storage/manga/2/zh.jpg')
            );
    }

    public function test_seeder_creates_harido_episode_one(): void
    {
        Storage::fake('public');

        $this->seed(MangaPageSeeder::class);

        $this->assertDatabaseHas('manga_categories', ['slug' => 'harido']);
        $this->assertDatabaseHas('manga_category_translations', [
            'locale' => 'ja',
            'name' => '鍼道',
        ]);
        $this->assertDatabaseHas('manga_episodes', [
            'slug' => 'episode-1',
            'is_published' => true,
        ]);

        $episode = MangaEpisode::query()->where('slug', 'episode-1')->firstOrFail();

        $this->assertSame(11, $episode->pages()->forLocale('ja')->count());
        $this->assertSame(11, $episode->pages()->forLocale('en')->count());
        $this->assertSame(0, $episode->pages()->forLocale('zh')->count());
    }

    public function test_sitemap_includes_published_episode_urls(): void
    {
        $episode = $this->episode($this->category(), 'episode-1', 'Episode 1', true);
        $this->episode($this->category('other', 'Other', 2), 'draft-ep', 'Draft', false);

        $this->get(route('sitemap'))
            ->assertOk()
            ->assertSee(route('manga.index'), false)
            ->assertSee(route('manga.show', $episode), false)
            ->assertDontSee('draft-ep', false);
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

    private function episode(
        MangaCategory $category,
        string $slug,
        string $title,
        bool $published,
        int $sortOrder = 1,
    ): MangaEpisode {
        $episode = MangaEpisode::query()->create([
            'manga_category_id' => $category->id,
            'slug' => $slug,
            'sort_order' => $sortOrder,
            'is_published' => $published,
        ]);

        foreach (['ja' => $title, 'en' => $title, 'zh' => $title] as $locale => $label) {
            $episode->translations()->create([
                'locale' => $locale,
                'title' => $label,
            ]);
        }

        return $episode;
    }

    private function page(MangaEpisode $episode, string $locale, int $sortOrder, string $path = 'manga/page.jpg'): MangaPage
    {
        return $episode->pages()->create([
            'locale' => $locale,
            'sort_order' => $sortOrder,
            'image_path' => $path,
        ]);
    }
}
