<?php

namespace App\Models;

use Database\Factories\LessonFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;

/**
 * @property int $id
 * @property int $lesson_category_id
 * @property string|null $video_path
 * @property string|null $video_url
 * @property int $sort_order
 * @property bool $is_published
 * @property-read string|null $video_file_url
 * @property-read int|null $images_count
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['lesson_category_id', 'video_path', 'video_url', 'sort_order', 'is_published'])]
class Lesson extends Model
{
    /** @use HasFactory<LessonFactory> */
    use HasFactory;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'sort_order' => 'integer',
            'is_published' => 'boolean',
        ];
    }

    /**
     * @param  Builder<static>  $query
     * @return Builder<static>
     */
    public function scopePublished(Builder $query): Builder
    {
        return $query->where('is_published', true);
    }

    /**
     * @return BelongsTo<LessonCategory, $this>
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(LessonCategory::class, 'lesson_category_id');
    }

    /**
     * @return HasMany<LessonTranslation, $this>
     */
    public function translations(): HasMany
    {
        return $this->hasMany(LessonTranslation::class);
    }

    /**
     * @return HasMany<LessonImage, $this>
     */
    public function images(): HasMany
    {
        return $this->hasMany(LessonImage::class)->orderBy('sort_order');
    }

    /**
     * @return HasMany<LessonViewLog, $this>
     */
    public function viewLogs(): HasMany
    {
        return $this->hasMany(LessonViewLog::class);
    }

    public function translationFor(?string $locale = null): ?LessonTranslation
    {
        $locale ??= app()->getLocale();

        return $this->translations->firstWhere('locale', $locale)
            ?? $this->translations->firstWhere('locale', config('localization.default', 'ja'))
            ?? $this->translations->first();
    }

    /**
     * Public URL for an uploaded video file. External `video_url` values are used as-is.
     *
     * @return Attribute<string|null, never>
     */
    protected function videoFileUrl(): Attribute
    {
        return Attribute::get(function (): ?string {
            if ($this->video_path === null || $this->video_path === '') {
                return null;
            }

            return Storage::disk('public')->url($this->video_path);
        });
    }
}
