<?php

namespace Tests\Feature\Admin;

use App\Models\Admin;
use App\Models\Contact;
use App\Models\Lesson;
use App\Models\LessonViewLog;
use App\Models\News;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_dashboard_shows_analysis_counts(): void
    {
        $admin = Admin::factory()->create();

        $popularViewers = User::factory()->count(3)->create();
        $otherViewer = User::factory()->create();
        User::factory()->create(['created_at' => now()->subMonth()]);

        $popular = Lesson::factory()->published()->create();
        $popular->translations()->create([
            'locale' => 'ja',
            'title' => 'Popular lesson',
            'body' => null,
        ]);
        $other = Lesson::factory()->create(['is_published' => false]);
        $other->translations()->create([
            'locale' => 'ja',
            'title' => 'Quiet lesson',
            'body' => null,
        ]);

        foreach ($popularViewers as $viewer) {
            LessonViewLog::factory()->create([
                'user_id' => $viewer->id,
                'lesson_id' => $popular->id,
                'created_at' => now(),
            ]);
        }
        LessonViewLog::factory()->completed()->create([
            'user_id' => $otherViewer->id,
            'lesson_id' => $other->id,
            'created_at' => now()->subDays(2),
            'completed_at' => now(),
        ]);

        News::factory()->published()->create();
        News::factory()->create();

        Contact::factory()->create(['subject' => 'Need counseling']);
        Contact::factory()->create([
            'status' => Contact::STATUS_CLOSED,
            'subject' => 'Already closed',
        ]);

        $this->actingAs($admin, 'admin')
            ->get(route('admin.dashboard'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('admin/dashboard')
                ->where('stats.members.total', 5)
                ->where('stats.members.this_month', 4)
                ->where('stats.lessons.total', 2)
                ->where('stats.lessons.published', 1)
                ->where('stats.news.total', 2)
                ->where('stats.news.published', 1)
                ->where('stats.contacts.total', 2)
                ->where('stats.contacts.new', 1)
                ->where('stats.lesson_views.this_month', 4)
                ->where('stats.lesson_views.completed_this_month', 1)
                ->has('lesson_view_chart', 14)
                ->where('popular_lessons.0.title', 'Popular lesson')
                ->where('popular_lessons.0.views', 3)
                ->has('recent_contacts', 2)
            );
    }
}
