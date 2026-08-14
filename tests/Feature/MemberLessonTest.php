<?php

namespace Tests\Feature;

use App\Models\Lesson;
use App\Models\LessonCategory;
use App\Models\LessonViewLog;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class MemberLessonTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_cannot_access_lesson_pages(): void
    {
        $lesson = $this->publishedLesson();

        $this->get(route('lessons.index'))->assertRedirect(route('login'));
        $this->get(route('lessons.history'))->assertRedirect(route('login'));
        $this->get(route('lessons.show', $lesson))->assertRedirect(route('login'));
        $this->post(route('lessons.complete', $lesson))->assertRedirect(route('login'));
    }

    public function test_unverified_users_cannot_access_lesson_pages(): void
    {
        $user = User::factory()->unverified()->create();
        $lesson = $this->publishedLesson();

        $this->actingAs($user)->get(route('lessons.index'))
            ->assertRedirect(route('verification.notice'));

        $this->actingAs($user)->get(route('lessons.show', $lesson))
            ->assertRedirect(route('verification.notice'));
    }

    public function test_members_can_browse_categories_and_watch_a_lesson(): void
    {
        $user = User::factory()->create();
        $lesson = $this->publishedLesson('Lesson one', 'Body copy');
        $draft = Lesson::factory()->create([
            'lesson_category_id' => $lesson->lesson_category_id,
            'is_published' => false,
            'sort_order' => 2,
        ]);
        $draft->translations()->create([
            'locale' => 'en',
            'title' => 'Hidden draft',
            'body' => 'Nope',
        ]);

        $this->actingAs($user)
            ->withUnencryptedCookie('locale', 'en')
            ->get(route('lessons.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('member/lessons/index')
                ->has('categories', 1)
                ->where('categories.0.lessons.0.title', 'Lesson one')
                ->where('categories.0.lessons.0.started', false)
                ->where('categories.0.lessons.0.completed', false)
                ->missing('categories.0.lessons.1')
            );

        $this->actingAs($user)
            ->withUnencryptedCookie('locale', 'en')
            ->get(route('lessons.show', $lesson))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('member/lessons/show')
                ->where('lesson.title', 'Lesson one')
                ->where('lesson.body', 'Body copy')
                ->where('lesson.view.started', true)
                ->where('lesson.view.completed', false)
            );

        $this->assertDatabaseHas('lesson_view_logs', [
            'user_id' => $user->id,
            'lesson_id' => $lesson->id,
        ]);

        $this->assertNotNull(
            LessonViewLog::query()
                ->where('user_id', $user->id)
                ->where('lesson_id', $lesson->id)
                ->value('started_at')
        );

        $this->actingAs($user)
            ->get(route('lessons.show', $draft))
            ->assertNotFound();
    }

    public function test_view_logs_persist_start_and_complete(): void
    {
        $user = User::factory()->create();
        $lesson = $this->publishedLesson();

        $this->actingAs($user)->get(route('lessons.show', $lesson))->assertOk();

        $this->actingAs($user)
            ->from(route('lessons.show', $lesson))
            ->post(route('lessons.complete', $lesson))
            ->assertRedirect(route('lessons.show', $lesson));

        $log = LessonViewLog::query()
            ->where('user_id', $user->id)
            ->where('lesson_id', $lesson->id)
            ->firstOrFail();

        $this->assertNotNull($log->started_at);
        $this->assertNotNull($log->completed_at);

        $completedAt = $log->completed_at;

        $this->actingAs($user)
            ->from(route('lessons.show', $lesson))
            ->post(route('lessons.complete', $lesson))
            ->assertRedirect();

        $this->assertTrue(
            $completedAt->equalTo($log->fresh()?->completed_at)
        );
    }

    public function test_mypage_and_history_show_watch_history(): void
    {
        $user = User::factory()->create();
        $lesson = $this->publishedLesson('Watched lesson');

        LessonViewLog::factory()->completed()->create([
            'user_id' => $user->id,
            'lesson_id' => $lesson->id,
            'started_at' => now()->subHour(),
            'completed_at' => now(),
        ]);

        $this->actingAs($user)
            ->withUnencryptedCookie('locale', 'en')
            ->get(route('dashboard'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('dashboard')
                ->has('recentHistory', 1)
                ->where('recentHistory.0.title', 'Watched lesson')
                ->where('recentHistory.0.completed', true)
            );

        $this->actingAs($user)
            ->withUnencryptedCookie('locale', 'en')
            ->get(route('lessons.history'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('member/lessons/history')
                ->has('entries', 1)
                ->where('entries.0.title', 'Watched lesson')
                ->where('entries.0.completed', true)
            );
    }

    private function publishedLesson(string $title = 'Sample lesson', string $body = 'Notes'): Lesson
    {
        $category = LessonCategory::query()->create([
            'slug' => 'scalp-release',
            'sort_order' => 1,
        ]);

        foreach (['ja' => '頭皮ほぐし', 'en' => 'Scalp release', 'zh' => '头皮放松'] as $locale => $name) {
            $category->translations()->create([
                'locale' => $locale,
                'name' => $name,
            ]);
        }

        $lesson = Lesson::factory()->published()->create([
            'lesson_category_id' => $category->id,
            'sort_order' => 1,
            'video_url' => 'https://videos.example.com/sample.mp4',
        ]);

        foreach (['ja', 'en', 'zh'] as $locale) {
            $lesson->translations()->create([
                'locale' => $locale,
                'title' => $title,
                'body' => $body,
            ]);
        }

        return $lesson;
    }
}
