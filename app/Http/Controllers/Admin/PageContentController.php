<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdatePageContentRequest;
use App\Models\PageContent;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PageContentController extends Controller
{
    /**
     * List fixed CMS pages.
     */
    public function index(): Response
    {
        $pages = PageContent::query()
            ->with('translations')
            ->whereIn('key', PageContent::KEYS)
            ->get()
            ->sortBy(fn (PageContent $page): int => array_search($page->key, PageContent::KEYS, true) ?: 999)
            ->values()
            ->map(fn (PageContent $page): array => [
                'id' => $page->id,
                'key' => $page->key,
                'titles' => $page->translations
                    ->mapWithKeys(fn ($t) => [$t->locale => $t->title])
                    ->all(),
            ]);

        return Inertia::render('admin/pages/index', [
            'pages' => $pages,
        ]);
    }

    /**
     * Edit a fixed CMS page (all locales).
     */
    public function edit(PageContent $page): Response
    {
        abort_unless(in_array($page->key, PageContent::KEYS, true), 404);

        $page->load('translations');

        $locales = config('localization.supported', ['ja', 'en', 'zh']);

        $translations = collect($locales)->mapWithKeys(function (string $locale) use ($page): array {
            $existing = $page->translations->firstWhere('locale', $locale);

            return [
                $locale => [
                    'title' => $existing?->title ?? '',
                    'body' => $existing?->body ?? '',
                ],
            ];
        })->all();

        return Inertia::render('admin/pages/edit', [
            'page' => [
                'id' => $page->id,
                'key' => $page->key,
                'translations' => $translations,
            ],
            'locales' => $locales,
        ]);
    }

    /**
     * Update translations for a fixed CMS page.
     */
    public function update(UpdatePageContentRequest $request, PageContent $page): RedirectResponse
    {
        abort_unless(in_array($page->key, PageContent::KEYS, true), 404);

        foreach ($request->validated('translations') as $locale => $content) {
            $page->translations()->updateOrCreate(
                ['locale' => $locale],
                [
                    'title' => $content['title'],
                    'body' => $content['body'] ?? null,
                ],
            );
        }

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Page saved.'),
        ]);

        return to_route('admin.pages.edit', $page);
    }
}
