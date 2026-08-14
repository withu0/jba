<?php

namespace App\Http\Controllers\Admin;

use App\Concerns\ManagesPublishablePosts;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreInterviewRequest;
use App\Http\Requests\Admin\UpdateInterviewRequest;
use App\Models\Interview;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class InterviewController extends Controller
{
    use ManagesPublishablePosts;

    public function index(): Response
    {
        $posts = Interview::query()
            ->with('translations')
            ->orderByDesc('published_at')
            ->orderByDesc('id')
            ->paginate(15)
            ->through(fn (Interview $interview): array => [
                'id' => $interview->id,
                'is_published' => $interview->is_published,
                'published_at' => $interview->published_at?->toIso8601String(),
                'title' => $interview->translationFor('ja')?->title
                    ?? $interview->translations->first()?->title
                    ?? '#'.$interview->id,
                'featured_image_url' => $interview->featured_image_url,
            ]);

        return Inertia::render('admin/interviews/index', [
            'posts' => $posts,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/interviews/create', [
            'locales' => config('localization.supported', ['ja', 'en', 'zh']),
            'translations' => $this->emptyTranslations(),
        ]);
    }

    public function store(StoreInterviewRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $interview = Interview::query()->create($this->publishableAttributes($validated));
        $this->syncTranslations($interview, $validated['translations']);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Interview created.'),
        ]);

        return to_route('admin.interviews.edit', $interview);
    }

    public function edit(Interview $interview): Response
    {
        $interview->load('translations');

        return Inertia::render('admin/interviews/edit', [
            'post' => [
                'id' => $interview->id,
                'is_published' => $interview->is_published,
                'published_at' => $interview->published_at?->format('Y-m-d\TH:i'),
                'featured_image_url' => $interview->featured_image_url,
                'translations' => $this->mapTranslationsForForm($interview->translations),
            ],
            'locales' => config('localization.supported', ['ja', 'en', 'zh']),
        ]);
    }

    public function update(UpdateInterviewRequest $request, Interview $interview): RedirectResponse
    {
        $validated = $request->validated();

        $interview->update($this->publishableAttributes($validated, $interview));
        $this->syncTranslations($interview, $validated['translations']);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Interview saved.'),
        ]);

        return to_route('admin.interviews.edit', $interview);
    }

    public function destroy(Interview $interview): RedirectResponse
    {
        if ($interview->featured_image_path) {
            Storage::disk('public')->delete($interview->featured_image_path);
        }

        $interview->delete();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Interview deleted.'),
        ]);

        return to_route('admin.interviews.index');
    }

    protected function featuredImageDirectory(): string
    {
        return 'interviews';
    }
}
