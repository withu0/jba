<?php

namespace App\Models;

use Database\Factories\MangaEpisodeFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $manga_category_id
 * @property string $slug
 * @property int $sort_order
 * @property bool $is_published
 * @property-read int|null $pages_count
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['manga_category_id', 'slug', 'sort_order', 'is_published'])]
class MangaEpisode extends Model
{
    /** @use HasFactory<MangaEpisodeFactory> */
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
     * @return BelongsTo<MangaCategory, $this>
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(MangaCategory::class, 'manga_category_id');
    }

    /**
     * @return HasMany<MangaEpisodeTranslation, $this>
     */
    public function translations(): HasMany
    {
        return $this->hasMany(MangaEpisodeTranslation::class);
    }

    /**
     * @return HasMany<MangaPage, $this>
     */
    public function pages(): HasMany
    {
        return $this->hasMany(MangaPage::class)->orderBy('sort_order')->orderBy('id');
    }

    public function translationFor(?string $locale = null): ?MangaEpisodeTranslation
    {
        $locale ??= app()->getLocale();

        return $this->translations->firstWhere('locale', $locale)
            ?? $this->translations->firstWhere('locale', config('localization.default', 'ja'))
            ?? $this->translations->first();
    }

    public function resolveBookLocale(?string $locale = null): string
    {
        $locale ??= app()->getLocale();

        $hasPages = $this->relationLoaded('pages')
            ? $this->pages->contains(fn (MangaPage $page): bool => $page->locale === $locale)
            : $this->pages()->forLocale($locale)->exists();

        if ($hasPages) {
            return $locale;
        }

        return MangaPage::LOCALE_FALLBACKS[$locale] ?? $locale;
    }

    public function coverUrl(?string $locale = null): ?string
    {
        $locale ??= app()->getLocale();
        $resolved = $this->resolveBookLocale($locale);

        if ($this->relationLoaded('pages')) {
            return $this->pages
                ->where('locale', $resolved)
                ->sortBy([
                    ['sort_order', 'asc'],
                    ['id', 'asc'],
                ])
                ->first()
                ?->image_url;
        }

        return MangaPage::orderedForEpisode($this, $locale)->first()?->image_url;
    }
}
