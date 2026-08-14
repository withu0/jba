<?php

namespace App\Models;

use Database\Factories\BeforeAfterFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;

/**
 * @property int $id
 * @property string $before_image_path
 * @property string $after_image_path
 * @property int $sort_order
 * @property bool $is_published
 * @property-read string|null $before_image_url
 * @property-read string|null $after_image_url
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['before_image_path', 'after_image_path', 'sort_order', 'is_published'])]
class BeforeAfter extends Model
{
    /** @use HasFactory<BeforeAfterFactory> */
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
     * @return HasMany<BeforeAfterTranslation, $this>
     */
    public function translations(): HasMany
    {
        return $this->hasMany(BeforeAfterTranslation::class);
    }

    public function translationFor(?string $locale = null): ?BeforeAfterTranslation
    {
        $locale ??= app()->getLocale();

        return $this->translations->firstWhere('locale', $locale)
            ?? $this->translations->firstWhere('locale', config('localization.default', 'ja'))
            ?? $this->translations->first();
    }

    /**
     * @return Attribute<string|null, never>
     */
    protected function beforeImageUrl(): Attribute
    {
        return Attribute::get(fn (): ?string => $this->storageUrl($this->before_image_path));
    }

    /**
     * @return Attribute<string|null, never>
     */
    protected function afterImageUrl(): Attribute
    {
        return Attribute::get(fn (): ?string => $this->storageUrl($this->after_image_path));
    }

    private function storageUrl(?string $path): ?string
    {
        if ($path === null || $path === '') {
            return null;
        }

        return Storage::disk('public')->url($path);
    }
}
