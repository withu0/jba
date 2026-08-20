<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BeforeAfter;
use App\Models\Contact;
use App\Models\Interview;
use App\Models\Lesson;
use App\Models\LessonViewLog;
use App\Models\MangaEpisode;
use App\Models\News;
use App\Models\User;
use Carbon\CarbonInterface;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the admin dashboard.
     */
    public function __invoke(): Response
    {
        $monthStart = now()->startOfMonth();
        $chartFrom = now()->subDays(13)->startOfDay();

        return Inertia::render('admin/dashboard', [
            'stats' => [
                'members' => [
                    'total' => User::query()->count(),
                    'this_month' => User::query()->where('created_at', '>=', $monthStart)->count(),
                ],
                'lessons' => [
                    'total' => Lesson::query()->count(),
                    'published' => Lesson::query()->published()->count(),
                ],
                'news' => [
                    'total' => News::query()->count(),
                    'published' => News::query()->published()->count(),
                ],
                'interviews' => [
                    'total' => Interview::query()->count(),
                    'published' => Interview::query()->published()->count(),
                ],
                'manga' => [
                    'total' => MangaEpisode::query()->count(),
                    'published' => MangaEpisode::query()->published()->count(),
                ],
                'before_after' => [
                    'total' => BeforeAfter::query()->count(),
                    'published' => BeforeAfter::query()->published()->count(),
                ],
                'contacts' => [
                    'total' => Contact::query()->count(),
                    'new' => Contact::query()->where('status', Contact::STATUS_NEW)->count(),
                ],
                'lesson_views' => [
                    'this_month' => LessonViewLog::query()->where('created_at', '>=', $monthStart)->count(),
                    'completed_this_month' => LessonViewLog::query()
                        ->whereNotNull('completed_at')
                        ->where('completed_at', '>=', $monthStart)
                        ->count(),
                ],
            ],
            'lesson_view_chart' => $this->lessonViewChart($chartFrom),
            'recent_contacts' => Contact::query()
                ->latest()
                ->limit(5)
                ->get(['id', 'name', 'email', 'subject', 'status', 'created_at'])
                ->map(fn (Contact $contact): array => [
                    'id' => $contact->id,
                    'name' => $contact->name,
                    'email' => $contact->email,
                    'subject' => $contact->subject,
                    'status' => $contact->status,
                    'created_at' => $contact->created_at?->toIso8601String(),
                ])
                ->all(),
            'popular_lessons' => Lesson::query()
                ->with('translations')
                ->withCount('viewLogs')
                ->has('viewLogs')
                ->orderByDesc('view_logs_count')
                ->limit(5)
                ->get()
                ->map(fn (Lesson $lesson): array => [
                    'id' => $lesson->id,
                    'title' => $lesson->translationFor()?->title,
                    'views' => $lesson->view_logs_count ?? 0,
                ])
                ->all(),
        ]);
    }

    /**
     * @return list<array{date: string, count: int}>
     */
    private function lessonViewChart(CarbonInterface $from): array
    {
        $counts = LessonViewLog::query()
            ->where('created_at', '>=', $from)
            ->get(['created_at'])
            ->countBy(fn (LessonViewLog $log): string => $log->created_at?->toDateString() ?? '');

        return collect(range(0, 13))
            ->map(function (int $offset) use ($from, $counts): array {
                $date = $from->copy()->addDays($offset)->toDateString();

                return [
                    'date' => $date,
                    'count' => (int) ($counts[$date] ?? 0),
                ];
            })
            ->all();
    }
}
