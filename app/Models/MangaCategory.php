<?php

namespace App\Models;

use Database\Factories\MangaCategoryFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $slug
 * @property int $sort_order
 * @property-read int|null $episodes_count
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['slug', 'sort_order'])]
class MangaCategory extends Model
{
    /** @use HasFactory<MangaCategoryFactory> */
    use HasFactory;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'sort_order' => 'integer',
        ];
    }

    /**
     * @return HasMany<MangaCategoryTranslation, $this>
     */
    public function translations(): HasMany
    {
        return $this->hasMany(MangaCategoryTranslation::class);
    }

    /**
     * @return HasMany<MangaEpisode, $this>
     */
    public function episodes(): HasMany
    {
        return $this->hasMany(MangaEpisode::class);
    }

    public function translationFor(?string $locale = null): ?MangaCategoryTranslation
    {
        $locale ??= app()->getLocale();

        return $this->translations->firstWhere('locale', $locale)
            ?? $this->translations->firstWhere('locale', config('localization.default', 'ja'))
            ?? $this->translations->first();
    }
}
