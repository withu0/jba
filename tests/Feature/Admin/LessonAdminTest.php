<?php

namespace Tests\Feature\Admin;

use App\Models\Admin;
use App\Models\Lesson;
use App\Models\LessonCategory;
use App\Models\LessonCategoryTranslation;
use App\Models\LessonImage;
use Database\Seeders\LessonCategorySeeder;
use Database\Seeders\LessonSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class LessonAdminTest extends TestCase
{
    use RefreshDatabase;

    public function test_seeders_create_the_six_categories_and_a_lesson_each(): void
    {
        Storage::fake('public');

        $this->seed([LessonCategorySeeder::class, LessonSeeder::class]);

        $this->assertSame(6, LessonCategory::query()->count());
        $this->assertSame(18, LessonCategoryTranslation::query()->count());

        $this->assertDatabaseHas('lesson_category_translations', [
            'locale' => 'ja',
            'name' => '頭皮ほぐし',
        ]);

        $this->assertSame(6, Lesson::query()->count());
        $this->assertSame(5, Lesson::query()->published()->count());

        LessonCategory::query()->each(function (LessonCategory $category): void {
            $this->assertGreaterThan(0, $category->lessons()->count());
        });

        $this->assertGreaterThan(0, LessonImage::query()->count());
    }

    public function test_admin_can_create_a_lesson_with_a_video_upload(): void
    {
        Storage::fake('public');
        $admin = Admin::factory()->create();
        $category = $this->category();

        $this->actingAs($admin, 'admin')
            ->post(route('admin.lessons.store'), [
                'lesson_category_id' => $category->id,
                'is_published' => '1',
                'sort_order' => 1,
                'video' => UploadedFile::fake()->create('lesson.mp4', 512, 'video/mp4'),
                'translations' => $this->lessonTranslations(),
            ])
            ->assertRedirect();

        $lesson = Lesson::query()->latest('id')->firstOrFail();

        $this->assertTrue($lesson->is_published);
        $this->assertNotNull($lesson->video_path);
        $this->assertStringStartsWith("lessons/{$lesson->id}/", $lesson->video_path);
        Storage::disk('public')->assertExists($lesson->video_path);

        $this->assertDatabaseHas('lesson_translations', [
            'lesson_id' => $lesson->id,
            'locale' => 'en',
            'title' => 'Lesson title',
        ]);
    }

    public function test_admin_can_replace_and_remove_the_lesson_video(): void
    {
        Storage::fake('public');
        $admin = Admin::factory()->create();
        $category = $this->category();
        $lesson = Lesson::factory()->create(['lesson_category_id' => $category->id]);

        $this->actingAs($admin, 'admin')
            ->put(route('admin.lessons.update', $lesson), [
                'lesson_category_id' => $category->id,
                'is_published' => '0',
                'sort_order' => 2,
                'video' => UploadedFile::fake()->create('first.mp4', 128, 'video/mp4'),
                'translations' => $this->lessonTranslations(),
            ])
            ->assertRedirect(route('admin.lessons.edit', $lesson));

        $firstPath = $lesson->fresh()?->video_path;
        $this->assertNotNull($firstPath);
        Storage::disk('public')->assertExists($firstPath);

        $this->actingAs($admin, 'admin')
            ->put(route('admin.lessons.update', $lesson), [
                'lesson_category_id' => $category->id,
                'remove_video' => '1',
                'video_url' => 'https://videos.example.com/lesson.m3u8',
                'translations' => $this->lessonTranslations(),
            ])
            ->assertRedirect(route('admin.lessons.edit', $lesson));

        $lesson->refresh();

        $this->assertNull($lesson->video_path);
        $this->assertSame('https://videos.example.com/lesson.m3u8', $lesson->video_url);
        Storage::disk('public')->assertMissing($firstPath);
    }

    public function test_admin_can_manage_step_images_with_captions(): void
    {
        Storage::fake('public');
        $admin = Admin::factory()->create();
        $lesson = Lesson::factory()->create(['lesson_category_id' => $this->category()->id]);

        $this->actingAs($admin, 'admin')
            ->post(route('admin.lessons.images.store', $lesson), [
                'image' => UploadedFile::fake()->image('step.jpg'),
                'translations' => [
                    'ja' => ['caption' => '手順1'],
                    'en' => ['caption' => 'Step 1'],
                    'zh' => ['caption' => '步骤1'],
                ],
            ])
            ->assertRedirect(route('admin.lessons.edit', $lesson));

        $image = LessonImage::query()->latest('id')->firstOrFail();

        Storage::disk('public')->assertExists($image->image_path);
        $this->assertSame(1, $image->sort_order);
        $this->assertDatabaseHas('lesson_image_translations', [
            'lesson_image_id' => $image->id,
            'locale' => 'en',
            'caption' => 'Step 1',
        ]);

        $this->actingAs($admin, 'admin')
            ->put(route('admin.lesson-images.update', $image), [
                'sort_order' => 3,
                'translations' => [
                    'ja' => ['caption' => '手順1（改訂）'],
                    'en' => ['caption' => 'Step 1 (revised)'],
                    'zh' => ['caption' => '步骤1（修订）'],
                ],
            ])
            ->assertRedirect(route('admin.lessons.edit', $lesson->id));

        $this->assertDatabaseHas('lesson_image_translations', [
            'lesson_image_id' => $image->id,
            'locale' => 'en',
            'caption' => 'Step 1 (revised)',
        ]);

        $this->actingAs($admin, 'admin')
            ->delete(route('admin.lesson-images.destroy', $image))
            ->assertRedirect(route('admin.lessons.edit', $lesson->id));

        $this->assertDatabaseMissing('lesson_images', ['id' => $image->id]);
        Storage::disk('public')->assertMissing($image->image_path);
    }

    public function test_deleting_a_lesson_removes_its_stored_media(): void
    {
        Storage::fake('public');
        $admin = Admin::factory()->create();
        $lesson = Lesson::factory()->create(['lesson_category_id' => $this->category()->id]);

        $this->actingAs($admin, 'admin')
            ->post(route('admin.lessons.images.store', $lesson), [
                'image' => UploadedFile::fake()->image('step.jpg'),
            ])
            ->assertRedirect();

        $this->actingAs($admin, 'admin')
            ->delete(route('admin.lessons.destroy', $lesson))
            ->assertRedirect(route('admin.lessons.index'));

        $this->assertDatabaseMissing('lessons', ['id' => $lesson->id]);
        $this->assertEmpty(Storage::disk('public')->allFiles("lessons/{$lesson->id}"));
    }

    public function test_reordering_only_affects_lessons_in_the_same_category(): void
    {
        $admin = Admin::factory()->create();
        $first = $this->category('one', 1);
        $second = $this->category('two', 2);

        $a = Lesson::factory()->create(['lesson_category_id' => $first->id, 'sort_order' => 1]);
        $b = Lesson::factory()->create(['lesson_category_id' => $first->id, 'sort_order' => 2]);
        $other = Lesson::factory()->create(['lesson_category_id' => $second->id, 'sort_order' => 1]);

        $this->actingAs($admin, 'admin')
            ->post(route('admin.lessons.move-down', $a))
            ->assertRedirect();

        $this->assertSame(2, $a->fresh()?->sort_order);
        $this->assertSame(1, $b->fresh()?->sort_order);
        $this->assertSame(1, $other->fresh()?->sort_order);
    }

    public function test_admin_can_crud_lesson_categories(): void
    {
        $admin = Admin::factory()->create();

        $this->actingAs($admin, 'admin')
            ->post(route('admin.lesson-categories.store'), [
                'slug' => 'extra-technique',
                'sort_order' => 7,
                'translations' => [
                    'ja' => ['name' => '追加テクニック'],
                    'en' => ['name' => 'Extra technique'],
                    'zh' => ['name' => '追加技法'],
                ],
            ])
            ->assertRedirect(route('admin.lesson-categories.index'));

        $category = LessonCategory::query()->where('slug', 'extra-technique')->firstOrFail();

        $this->actingAs($admin, 'admin')
            ->put(route('admin.lesson-categories.update', $category), [
                'slug' => 'extra-technique',
                'sort_order' => 7,
                'translations' => [
                    'ja' => ['name' => '追加テクニック'],
                    'en' => ['name' => 'Renamed technique'],
                    'zh' => ['name' => '追加技法'],
                ],
            ])
            ->assertRedirect(route('admin.lesson-categories.edit', $category));

        $this->assertDatabaseHas('lesson_category_translations', [
            'lesson_category_id' => $category->id,
            'locale' => 'en',
            'name' => 'Renamed technique',
        ]);

        $this->actingAs($admin, 'admin')
            ->delete(route('admin.lesson-categories.destroy', $category))
            ->assertRedirect(route('admin.lesson-categories.index'));

        $this->assertDatabaseMissing('lesson_categories', ['id' => $category->id]);
    }

    public function test_categories_holding_lessons_cannot_be_deleted(): void
    {
        $admin = Admin::factory()->create();
        $category = $this->category();
        Lesson::factory()->create(['lesson_category_id' => $category->id]);

        $this->actingAs($admin, 'admin')
            ->from(route('admin.lesson-categories.index'))
            ->delete(route('admin.lesson-categories.destroy', $category))
            ->assertRedirect(route('admin.lesson-categories.index'));

        $this->assertDatabaseHas('lesson_categories', ['id' => $category->id]);
    }

    public function test_guests_cannot_access_the_lessons_admin(): void
    {
        $this->get(route('admin.lessons.index'))
            ->assertRedirect(route('admin.login'));

        $this->get(route('admin.lesson-categories.index'))
            ->assertRedirect(route('admin.login'));
    }

    private function category(string $slug = 'scalp-release', int $sortOrder = 1): LessonCategory
    {
        $category = LessonCategory::query()->create([
            'slug' => $slug,
            'sort_order' => $sortOrder,
        ]);

        foreach (['ja' => '頭皮ほぐし', 'en' => 'Scalp release', 'zh' => '头皮放松'] as $locale => $name) {
            $category->translations()->create(['locale' => $locale, 'name' => $name]);
        }

        return $category;
    }

    /**
     * @return array<string, array{title: string, body: string}>
     */
    private function lessonTranslations(): array
    {
        return [
            'ja' => ['title' => 'レッスンタイトル', 'body' => '本文'],
            'en' => ['title' => 'Lesson title', 'body' => 'Body'],
            'zh' => ['title' => '课程标题', 'body' => '正文'],
        ];
    }
}
