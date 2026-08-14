<?php

namespace App\Http\Controllers\Admin;

use App\Concerns\ManagesPublishablePosts;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreNewsRequest;
use App\Http\Requests\Admin\UpdateNewsRequest;
use App\Models\News;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class NewsController extends Controller
{
    use ManagesPublishablePosts;

    public function index(): Response
    {
        $posts = News::query()
            ->with('translations')
            ->orderByDesc('published_at')
            ->orderByDesc('id')
            ->paginate(15)
            ->through(fn (News $news): array => [
                'id' => $news->id,
                'is_published' => $news->is_published,
                'published_at' => $news->published_at?->toIso8601String(),
                'title' => $news->translationFor('ja')?->title
                    ?? $news->translations->first()?->title
                    ?? '#'.$news->id,
                'featured_image_url' => $news->featured_image_url,
            ]);

        return Inertia::render('admin/news/index', [
            'posts' => $posts,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/news/create', [
            'locales' => config('localization.supported', ['ja', 'en', 'zh']),
            'translations' => $this->emptyTranslations(),
        ]);
    }

    public function store(StoreNewsRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $news = News::query()->create($this->publishableAttributes($validated));
        $this->syncTranslations($news, $validated['translations']);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('News created.'),
        ]);

        return to_route('admin.news.edit', $news);
    }

    public function edit(News $news): Response
    {
        $news->load('translations');

        return Inertia::render('admin/news/edit', [
            'post' => [
                'id' => $news->id,
                'is_published' => $news->is_published,
                'published_at' => $news->published_at?->format('Y-m-d\TH:i'),
                'featured_image_url' => $news->featured_image_url,
                'translations' => $this->mapTranslationsForForm($news->translations),
            ],
            'locales' => config('localization.supported', ['ja', 'en', 'zh']),
        ]);
    }

    public function update(UpdateNewsRequest $request, News $news): RedirectResponse
    {
        $validated = $request->validated();

        $news->update($this->publishableAttributes($validated, $news));
        $this->syncTranslations($news, $validated['translations']);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('News saved.'),
        ]);

        return to_route('admin.news.edit', $news);
    }

    public function destroy(News $news): RedirectResponse
    {
        if ($news->featured_image_path) {
            Storage::disk('public')->delete($news->featured_image_path);
        }

        $news->delete();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('News deleted.'),
        ]);

        return to_route('admin.news.index');
    }

    protected function featuredImageDirectory(): string
    {
        return 'news';
    }
}
