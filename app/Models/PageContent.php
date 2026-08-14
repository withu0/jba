<?php

namespace App\Models;

use Database\Factories\PageContentFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $key
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['key'])]
class PageContent extends Model
{
    /** @use HasFactory<PageContentFactory> */
    use HasFactory;

    public const KEYS = ['about', 'counseling', 'contraindications'];

    /**
     * @return HasMany<PageContentTranslation, $this>
     */
    public function translations(): HasMany
    {
        return $this->hasMany(PageContentTranslation::class);
    }

    public function translationFor(?string $locale = null): ?PageContentTranslation
    {
        $locale ??= app()->getLocale();

        return $this->translations->firstWhere('locale', $locale)
            ?? $this->translations->firstWhere('locale', config('localization.default', 'ja'))
            ?? $this->translations->first();
    }
}
