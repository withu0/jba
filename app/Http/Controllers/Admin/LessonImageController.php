<?php

namespace App\Http\Controllers\Admin;

use App\Concerns\ReordersSortableRecords;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreLessonImageRequest;
use App\Http\Requests\Admin\UpdateLessonImageRequest;
use App\Models\Lesson;
use App\Models\LessonImage;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class LessonImageController extends Controller
{
    use ReordersSortableRecords;

    public function store(StoreLessonImageRequest $request, Lesson $lesson): RedirectResponse
    {
        $validated = $request->validated();
        $sortOrder = (int) ($validated['sort_order'] ?? 0);

        if ($sortOrder <= 0) {
            $sortOrder = (int) $lesson->images()->max('sort_order') + 1;
        }

        /** @var LessonImage $image */
        $image = $lesson->images()->create([
            'image_path' => $validated['image']->store("lessons/{$lesson->id}/images", 'public'),
            'sort_order' => $sortOrder,
        ]);

        $this->syncCaptions($image, $validated['translations'] ?? []);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Step image added.'),
        ]);

        return to_route('admin.lessons.edit', $lesson);
    }

    public function update(UpdateLessonImageRequest $request, LessonImage $image): RedirectResponse
    {
        $validated = $request->validated();
        $lessonId = $image->lesson_id;

        $attributes = [
            'sort_order' => (int) ($validated['sort_order'] ?? $image->sort_order),
        ];

        if (($validated['image'] ?? null) instanceof UploadedFile) {
            Storage::disk('public')->delete($image->image_path);
            $attributes['image_path'] = $validated['image']->store("lessons/{$lessonId}/images", 'public');
        }

        $image->update($attributes);
        $this->syncCaptions($image, $validated['translations'] ?? []);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Step image saved.'),
        ]);

        return to_route('admin.lessons.edit', $lessonId);
    }

    public function destroy(LessonImage $image): RedirectResponse
    {
        $lessonId = $image->lesson_id;

        Storage::disk('public')->delete($image->image_path);
        $image->delete();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Step image deleted.'),
        ]);

        return to_route('admin.lessons.edit', $lessonId);
    }

    public function moveUp(LessonImage $image): RedirectResponse
    {
        $this->swapWithNeighbor($this->siblingsOf($image), $image, 'up');

        return back();
    }

    public function moveDown(LessonImage $image): RedirectResponse
    {
        $this->swapWithNeighbor($this->siblingsOf($image), $image, 'down');

        return back();
    }

    /**
     * @return Builder<LessonImage>
     */
    private function siblingsOf(LessonImage $image): Builder
    {
        return LessonImage::query()->where('lesson_id', $image->lesson_id);
    }

    /**
     * @param  array<string, array{caption?: string|null}>  $translations
     */
    private function syncCaptions(LessonImage $image, array $translations): void
    {
        foreach ($translations as $locale => $content) {
            $image->translations()->updateOrCreate(
                ['locale' => $locale],
                ['caption' => $content['caption'] ?? null],
            );
        }
    }
}
