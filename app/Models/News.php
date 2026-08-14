<?php

namespace App\Models;

use App\Concerns\PublishableContent;
use Database\Factories\NewsFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property bool $is_published
 * @property Carbon|null $published_at
 * @property string|null $featured_image_path
 * @property-read string|null $featured_image_url
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['is_published', 'published_at', 'featured_image_path'])]
class News extends Model
{
    /** @use HasFactory<NewsFactory> */
    use HasFactory;

    use PublishableContent;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_published' => 'boolean',
            'published_at' => 'datetime',
        ];
    }

    /**
     * @return HasMany<NewsTranslation, $this>
     */
    public function translations(): HasMany
    {
        return $this->hasMany(NewsTranslation::class);
    }

    public function translationFor(?string $locale = null): ?NewsTranslation
    {
        $locale ??= app()->getLocale();

        return $this->translations->firstWhere('locale', $locale)
            ?? $this->translations->firstWhere('locale', config('localization.default', 'ja'))
            ?? $this->translations->first();
    }
}
