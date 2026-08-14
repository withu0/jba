<?php

namespace Tests\Feature;

use App\Models\Admin;
use App\Models\Interview;
use App\Models\News;
use Database\Seeders\InterviewSeeder;
use Database\Seeders\NewsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class NewsInterviewTest extends TestCase
{
    use RefreshDatabase;

    public function test_seeders_create_published_and_draft_posts(): void
    {
        $this->seed([NewsSeeder::class, InterviewSeeder::class]);

        $this->assertSame(3, News::query()->count());
        $this->assertSame(2, News::query()->published()->count());
        $this->assertSame(3, Interview::query()->count());
        $this->assertSame(2, Interview::query()->published()->count());
    }

    public function test_public_news_list_hides_drafts_and_shows_detail(): void
    {
        $this->seed(NewsSeeder::class);

        $this->withUnencryptedCookie('locale', 'en')
            ->get(route('news.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('news/index')
                ->has('posts.data', 2)
                ->where('posts.data.0.title', 'Autumn seminar preview')
            );

        $this->withUnencryptedCookie('locale', 'en')
            ->get(route('news.show', 'welcome-to-jba'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('news/show')
                ->where('post.title', 'Welcome to the JBA website')
            );

        $this->get(route('news.show', 'draft-internal-note'))
            ->assertNotFound();
    }

    public function test_public_interviews_list_and_detail_work(): void
    {
        $this->seed(InterviewSeeder::class);

        $this->withUnencryptedCookie('locale', 'ja')
            ->get(route('interviews.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('interviews/index')
                ->has('posts.data', 2)
            );

        $this->withUnencryptedCookie('locale', 'zh')
            ->get(route('interviews.show', 'clinic-story-tokyo'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('interviews/show')
                ->where('post.title', '诊所故事：东京实践')
            );

        $this->get(route('interviews.show', 'draft-interview-hold'))
            ->assertNotFound();
    }

    public function test_admin_can_crud_news(): void
    {
        $admin = Admin::factory()->create();

        $payload = [
            'is_published' => '1',
            'published_at' => '2026-08-01T12:00',
            'translations' => [
                'ja' => [
                    'slug' => 'new-post-ja',
                    'title' => '新しい記事',
                    'excerpt' => '抜粋',
                    'body' => "本文\n\n二段落",
                ],
                'en' => [
                    'slug' => 'new-post-en',
                    'title' => 'New post',
                    'excerpt' => 'Excerpt',
                    'body' => "Body\n\nSecond",
                ],
                'zh' => [
                    'slug' => 'new-post-zh',
                    'title' => '新文章',
                    'excerpt' => '摘要',
                    'body' => "正文\n\n第二段",
                ],
            ],
        ];

        $this->actingAs($admin, 'admin')
            ->post(route('admin.news.store'), $payload)
            ->assertRedirect();

        $news = News::query()->latest('id')->firstOrFail();

        $this->assertTrue($news->is_published);
        $this->assertDatabaseHas('news_translations', [
            'news_id' => $news->id,
            'locale' => 'en',
            'slug' => 'new-post-en',
            'title' => 'New post',
        ]);

        $this->actingAs($admin, 'admin')
            ->put(route('admin.news.update', $news), [
                ...$payload,
                'is_published' => '0',
                'translations' => [
                    ...$payload['translations'],
                    'en' => [
                        ...$payload['translations']['en'],
                        'title' => 'Updated post',
                    ],
                ],
            ])
            ->assertRedirect(route('admin.news.edit', $news));

        $this->assertFalse($news->fresh()->is_published);
        $this->assertDatabaseHas('news_translations', [
            'news_id' => $news->id,
            'locale' => 'en',
            'title' => 'Updated post',
        ]);

        $this->get(route('news.show', 'new-post-en'))
            ->assertNotFound();

        $this->actingAs($admin, 'admin')
            ->delete(route('admin.news.destroy', $news))
            ->assertRedirect(route('admin.news.index'));

        $this->assertDatabaseMissing('news', ['id' => $news->id]);
    }

    public function test_admin_can_crud_interviews(): void
    {
        $admin = Admin::factory()->create();

        $payload = [
            'is_published' => true,
            'published_at' => now()->subDay()->format('Y-m-d\TH:i'),
            'translations' => [
                'ja' => ['slug' => 'iv-ja', 'title' => '対談', 'excerpt' => null, 'body' => '本文'],
                'en' => ['slug' => 'iv-en', 'title' => 'Talk', 'excerpt' => null, 'body' => 'Body'],
                'zh' => ['slug' => 'iv-zh', 'title' => '对谈', 'excerpt' => null, 'body' => '正文'],
            ],
        ];

        $this->actingAs($admin, 'admin')
            ->post(route('admin.interviews.store'), $payload)
            ->assertRedirect();

        $interview = Interview::query()->latest('id')->firstOrFail();

        $this->withUnencryptedCookie('locale', 'en')
            ->get(route('interviews.show', 'iv-en'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->where('post.title', 'Talk'));

        $this->actingAs($admin, 'admin')
            ->delete(route('admin.interviews.destroy', $interview))
            ->assertRedirect(route('admin.interviews.index'));
    }

    public function test_guests_cannot_access_admin_news(): void
    {
        $this->get(route('admin.news.index'))
            ->assertRedirect(route('admin.login'));
    }
}
