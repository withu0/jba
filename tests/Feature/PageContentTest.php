<?php

namespace Tests\Feature;

use App\Models\Admin;
use App\Models\PageContent;
use Database\Seeders\PageContentSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class PageContentTest extends TestCase
{
    use RefreshDatabase;

    public function test_page_content_seeder_creates_all_keys_and_locales(): void
    {
        $this->seed(PageContentSeeder::class);

        $this->assertSame(3, PageContent::query()->count());

        foreach (PageContent::KEYS as $key) {
            $page = PageContent::query()->where('key', $key)->with('translations')->first();
            $this->assertNotNull($page);
            $this->assertEqualsCanonicalizing(['ja', 'en', 'zh'], $page->translations->pluck('locale')->all());
        }
    }

    public function test_public_cms_pages_render_localized_content(): void
    {
        $this->seed(PageContentSeeder::class);

        $this->withUnencryptedCookie('locale', 'en')
            ->get(route('about'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('static-page')
                ->where('pageKey', 'about')
                ->where('title', 'About JBA')
                ->where('body', fn (string $body) => str_contains($body, 'Japanese Beauty Acupuncture'))
            );

        $this->withUnencryptedCookie('locale', 'ja')
            ->get(route('counseling'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('static-page')
                ->where('pageKey', 'counseling')
                ->where('title', 'カウンセリング')
            );

        $this->withUnencryptedCookie('locale', 'zh')
            ->get(route('contraindications'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('static-page')
                ->where('pageKey', 'contraindications')
                ->where('title', '禁忌事项')
            );
    }

    public function test_admin_can_list_and_update_page_translations(): void
    {
        $this->seed(PageContentSeeder::class);
        $admin = Admin::factory()->create();
        $page = PageContent::query()->where('key', 'about')->firstOrFail();

        $this->actingAs($admin, 'admin')
            ->get(route('admin.pages.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('admin/pages/index')
                ->has('pages', 3)
            );

        $this->actingAs($admin, 'admin')
            ->get(route('admin.pages.edit', $page))
            ->assertOk()
            ->assertInertia(fn (Assert $inertia) => $inertia
                ->component('admin/pages/edit')
                ->where('page.key', 'about')
                ->has('page.translations.ja')
                ->has('page.translations.en')
                ->has('page.translations.zh')
            );

        $payload = [
            'translations' => [
                'ja' => ['title' => '更新されたについて', 'body' => "日本語の本文\n\n二段落目"],
                'en' => ['title' => 'Updated About', 'body' => "English body\n\nSecond paragraph"],
                'zh' => ['title' => '更新的关于', 'body' => "中文正文\n\n第二段"],
            ],
        ];

        $this->actingAs($admin, 'admin')
            ->put(route('admin.pages.update', $page), $payload)
            ->assertRedirect(route('admin.pages.edit', $page));

        $this->assertDatabaseHas('page_content_translations', [
            'page_content_id' => $page->id,
            'locale' => 'en',
            'title' => 'Updated About',
        ]);

        $this->withUnencryptedCookie('locale', 'en')
            ->get(route('about'))
            ->assertOk()
            ->assertInertia(fn (Assert $inertia) => $inertia
                ->where('title', 'Updated About')
            );
    }

    public function test_guests_cannot_access_admin_pages(): void
    {
        $this->seed(PageContentSeeder::class);

        $this->get(route('admin.pages.index'))
            ->assertRedirect(route('admin.login'));
    }
}
