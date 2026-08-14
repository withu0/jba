<?php

namespace App\Http\Controllers\Admin;

use App\Concerns\ReordersSortableRecords;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreMangaPageRequest;
use App\Models\MangaEpisode;
use App\Models\MangaPage;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use RuntimeException;

class MangaPageController extends Controller
{
    use ReordersSortableRecords;

    public function store(StoreMangaPageRequest $request, MangaEpisode $episode): RedirectResponse
    {
        $validated = $request->validated();
        $locale = $validated['locale'];
        $sortOrder = (int) ($validated['sort_order'] ?? 0);

        if ($sortOrder <= 0) {
            $sortOrder = (int) $episode->pages()->forLocale($locale)->max('sort_order') + 1;
        }

        $episode->pages()->create([
            'locale' => $locale,
            'sort_order' => $sortOrder,
            'image_path' => $this->storeImage($validated['image'], $episode, $locale),
        ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Manga page uploaded.'),
        ]);

        return to_route('admin.manga.edit', [
            'episode' => $episode,
            'locale' => $locale,
        ]);
    }

    public function destroy(MangaPage $page): RedirectResponse
    {
        $episodeId = $page->manga_episode_id;
        $locale = $page->locale;

        Storage::disk('public')->delete($page->image_path);
        $page->delete();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Manga page deleted.'),
        ]);

        return to_route('admin.manga.edit', [
            'episode' => $episodeId,
            'locale' => $locale,
        ]);
    }

    public function moveUp(MangaPage $page): RedirectResponse
    {
        $this->swapWithNeighbor($this->siblingsOf($page), $page, 'up');

        return to_route('admin.manga.edit', [
            'episode' => $page->manga_episode_id,
            'locale' => $page->locale,
        ]);
    }

    public function moveDown(MangaPage $page): RedirectResponse
    {
        $this->swapWithNeighbor($this->siblingsOf($page), $page, 'down');

        return to_route('admin.manga.edit', [
            'episode' => $page->manga_episode_id,
            'locale' => $page->locale,
        ]);
    }

    /**
     * @return Builder<MangaPage>
     */
    private function siblingsOf(MangaPage $page): Builder
    {
        return MangaPage::query()
            ->where('manga_episode_id', $page->manga_episode_id)
            ->forLocale($page->locale);
    }

    private function storeImage(UploadedFile $file, MangaEpisode $episode, string $locale): string
    {
        $path = $file->store("manga/{$episode->id}/{$locale}", 'public');

        if ($path === false) {
            throw new RuntimeException("Unable to store the manga page for episode {$episode->id}.");
        }

        return $path;
    }
}
