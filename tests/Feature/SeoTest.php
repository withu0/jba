<?php

namespace Tests\Feature;

use Database\Seeders\InterviewSeeder;
use Database\Seeders\NewsSeeder;
use Database\Seeders\PageContentSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class SeoTest extends TestCase
{
    use RefreshDatabase;

    public function test_home_shares_localized_open_graph_defaults(): void
    {
        $this->get(route('home'))
            ->assertOk()
            ->assertSee('og:image', false)
            ->assertSee('images/og-default.png', false)
            ->assertInertia(fn (Assert $page) => $page
                ->component('home')
                ->where('seo.type', 'website')
                ->where('seo.title', 'JBA | 日本の美容鍼')
                ->where('seo.siteName', 'JBA')
                ->where('seo.locale', 'ja_JP')
                ->has('seo.description')
                ->has('seo.image')
                ->has('seo.url')
            );
    }

    public function test_cms_page_overrides_seo_title_from_translation(): void
    {
        $this->seed(PageContentSeeder::class);

        $this->withUnencryptedCookie('locale', 'en')
            ->get(route('about'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('static-page')
                ->where('seo.title', 'About JBA')
                ->where('seo.type', 'website')
            );
    }

    public function test_news_article_uses_article_open_graph_type(): void
    {
        $this->seed(NewsSeeder::class);

        $this->withUnencryptedCookie('locale', 'en')
            ->get(route('news.show', 'welcome-to-jba'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('news/show')
                ->where('seo.type', 'article')
                ->where('seo.title', 'Welcome to the JBA website')
                ->has('seo.description')
            );
    }

    public function test_public_nav_routes_are_reachable(): void
    {
        $this->seed(PageContentSeeder::class);

        $this->get(route('home'))->assertOk();
        $this->get(route('about'))->assertOk();
        $this->get(route('news.index'))->assertOk();
        $this->get(route('interviews.index'))->assertOk();
        $this->get(route('counseling'))->assertOk();
        $this->get(route('before-after'))->assertOk();
        $this->get(route('contraindications'))->assertOk();
        $this->get(route('manga.index'))->assertOk();
        $this->get(route('contact'))->assertRedirect(route('counseling').'#contact');
    }

    public function test_sitemap_lists_public_urls_and_published_posts(): void
    {
        $this->seed([PageContentSeeder::class, NewsSeeder::class, InterviewSeeder::class]);

        $this->get(route('sitemap'))
            ->assertOk()
            ->assertHeader('Content-Type', 'application/xml; charset=UTF-8')
            ->assertSee(route('home'), false)
            ->assertSee(route('about'), false)
            ->assertSee(route('news.show', 'welcome-to-jba'), false)
            ->assertDontSee('draft-internal-note', false);
    }

    public function test_robots_txt_disallows_private_areas_and_points_to_sitemap(): void
    {
        $this->get(route('robots'))
            ->assertOk()
            ->assertSee('Disallow: /admin', false)
            ->assertSee('Sitemap: '.url('/sitemap.xml'), false);
    }
}
