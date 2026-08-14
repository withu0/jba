<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreBeforeAfterRequest;
use App\Http\Requests\Admin\UpdateBeforeAfterRequest;
use App\Models\BeforeAfter;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class BeforeAfterController extends Controller
{
    public function index(): Response
    {
        $pairs = BeforeAfter::query()
            ->with('translations')
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get()
            ->map(fn (BeforeAfter $pair): array => [
                'id' => $pair->id,
                'is_published' => $pair->is_published,
                'sort_order' => $pair->sort_order,
                'title' => $pair->translationFor('ja')?->title
                    ?? $pair->translations->first()?->title
                    ?? '#'.$pair->id,
                'before_image_url' => $pair->before_image_url,
                'after_image_url' => $pair->after_image_url,
            ]);

        return Inertia::render('admin/before-after/index', [
            'pairs' => $pairs,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/before-after/create', [
            'locales' => config('localization.supported', ['ja', 'en', 'zh']),
            'translations' => $this->emptyTranslations(),
            'nextSortOrder' => (int) BeforeAfter::query()->max('sort_order') + 1,
        ]);
    }

    public function store(StoreBeforeAfterRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $pair = BeforeAfter::query()->create([
            'is_published' => (bool) ($validated['is_published'] ?? false),
            'sort_order' => (int) ($validated['sort_order'] ?? 0),
            'before_image_path' => $this->storeImage($validated['before_image']),
            'after_image_path' => $this->storeImage($validated['after_image']),
        ]);

        $this->syncTranslations($pair, $validated['translations']);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Before/After pair created.'),
        ]);

        return to_route('admin.before-after.edit', $pair);
    }

    public function edit(BeforeAfter $beforeAfter): Response
    {
        $beforeAfter->load('translations');

        return Inertia::render('admin/before-after/edit', [
            'pair' => [
                'id' => $beforeAfter->id,
                'is_published' => $beforeAfter->is_published,
                'sort_order' => $beforeAfter->sort_order,
                'before_image_url' => $beforeAfter->before_image_url,
                'after_image_url' => $beforeAfter->after_image_url,
                'translations' => $this->mapTranslationsForForm($beforeAfter->translations),
            ],
            'locales' => config('localization.supported', ['ja', 'en', 'zh']),
        ]);
    }

    public function update(UpdateBeforeAfterRequest $request, BeforeAfter $beforeAfter): RedirectResponse
    {
        $validated = $request->validated();

        $attributes = [
            'is_published' => (bool) ($validated['is_published'] ?? false),
            'sort_order' => (int) ($validated['sort_order'] ?? $beforeAfter->sort_order),
        ];

        if (($validated['before_image'] ?? null) instanceof UploadedFile) {
            Storage::disk('public')->delete($beforeAfter->before_image_path);
            $attributes['before_image_path'] = $this->storeImage($validated['before_image']);
        }

        if (($validated['after_image'] ?? null) instanceof UploadedFile) {
            Storage::disk('public')->delete($beforeAfter->after_image_path);
            $attributes['after_image_path'] = $this->storeImage($validated['after_image']);
        }

        $beforeAfter->update($attributes);
        $this->syncTranslations($beforeAfter, $validated['translations']);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Before/After pair saved.'),
        ]);

        return to_route('admin.before-after.edit', $beforeAfter);
    }

    public function destroy(BeforeAfter $beforeAfter): RedirectResponse
    {
        Storage::disk('public')->delete([
            $beforeAfter->before_image_path,
            $beforeAfter->after_image_path,
        ]);

        $beforeAfter->delete();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Before/After pair deleted.'),
        ]);

        return to_route('admin.before-after.index');
    }

    public function moveUp(BeforeAfter $beforeAfter): RedirectResponse
    {
        $this->swapWithNeighbor($beforeAfter, 'up');

        return back();
    }

    public function moveDown(BeforeAfter $beforeAfter): RedirectResponse
    {
        $this->swapWithNeighbor($beforeAfter, 'down');

        return back();
    }

    /**
     * @param  'up'|'down'  $direction
     */
    private function swapWithNeighbor(BeforeAfter $pair, string $direction): void
    {
        $orderedIds = BeforeAfter::query()
            ->orderBy('sort_order')
            ->orderBy('id')
            ->pluck('id')
            ->all();

        $index = array_search($pair->id, $orderedIds, true);

        if ($index === false) {
            return;
        }

        $neighborIndex = $direction === 'up' ? $index - 1 : $index + 1;

        if (! array_key_exists($neighborIndex, $orderedIds)) {
            return;
        }

        [$orderedIds[$index], $orderedIds[$neighborIndex]] = [
            $orderedIds[$neighborIndex],
            $orderedIds[$index],
        ];

        DB::transaction(function () use ($orderedIds): void {
            foreach ($orderedIds as $position => $id) {
                BeforeAfter::query()
                    ->whereKey($id)
                    ->update(['sort_order' => $position + 1]);
            }
        });
    }

    private function storeImage(UploadedFile $file): string
    {
        return $file->store('before-after', 'public');
    }

    /**
     * @param  array<string, array{title: string, caption?: string|null}>  $translations
     */
    private function syncTranslations(BeforeAfter $pair, array $translations): void
    {
        foreach ($translations as $locale => $content) {
            $pair->translations()->updateOrCreate(
                ['locale' => $locale],
                [
                    'title' => $content['title'],
                    'caption' => $content['caption'] ?? null,
                ],
            );
        }
    }

    /**
     * @return array<string, array{title: string, caption: string}>
     */
    private function emptyTranslations(): array
    {
        $locales = config('localization.supported', ['ja', 'en', 'zh']);

        return collect($locales)->mapWithKeys(fn (string $locale): array => [
            $locale => [
                'title' => '',
                'caption' => '',
            ],
        ])->all();
    }

    /**
     * @param  iterable<int, object{locale: string, title: string, caption: ?string}>  $existing
     * @return array<string, array{title: string, caption: string}>
     */
    private function mapTranslationsForForm(iterable $existing): array
    {
        $locales = config('localization.supported', ['ja', 'en', 'zh']);
        $byLocale = collect($existing)->keyBy('locale');

        return collect($locales)->mapWithKeys(function (string $locale) use ($byLocale): array {
            $row = $byLocale->get($locale);

            return [
                $locale => [
                    'title' => $row->title ?? '',
                    'caption' => $row->caption ?? '',
                ],
            ];
        })->all();
    }
}
