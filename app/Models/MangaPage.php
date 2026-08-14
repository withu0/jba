<?php

namespace App\Models;

use Database\Factories\MangaPageFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;

/**
 * @property int $id
 * @property int $manga_episode_id
 * @property string $locale
 * @property string $image_path
 * @property int $sort_order
 * @property-read string|null $image_url
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['manga_episode_id', 'locale', 'image_path', 'sort_order'])]
class MangaPage extends Model
{
    /** @use HasFactory<MangaPageFactory> */
    use HasFactory;

    /**
     * Locales that fall back to another book when no pages exist.
     * zh UI uses en images when a Chinese book has not been uploaded.
     *
     * @var array<string, string>
     */
    public const LOCALE_FALLBACKS = [
        'zh' => 'en',
    ];

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
     * @return BelongsTo<MangaEpisode, $this>
     */
    public function episode(): BelongsTo
    {
        return $this->belongsTo(MangaEpisode::class, 'manga_episode_id');
    }

    /**
     * @param  Builder<static>  $query
     * @return Builder<static>
     */
    public function scopeForLocale(Builder $query, string $locale): Builder
    {
        return $query->where('locale', $locale);
    }

    /**
     * Ordered pages for an episode and UI locale, applying documented fallbacks (zh → en).
     *
     * @return EloquentCollection<int, MangaPage>
     */
    public static function orderedForEpisode(MangaEpisode $episode, ?string $locale = null): EloquentCollection
    {
        $locale ??= app()->getLocale();
        $resolved = static::resolveBookLocaleForEpisode($episode, $locale);

        return $episode->pages()
            ->forLocale($resolved)
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get();
    }

    /**
     * Resolve which page locale to serve for an episode.
     * If the preferred locale has no pages and a fallback is defined, use that.
     */
    public static function resolveBookLocaleForEpisode(MangaEpisode $episode, ?string $locale = null): string
    {
        $locale ??= app()->getLocale();

        $hasPages = $episode->pages()->forLocale($locale)->exists();

        if ($hasPages) {
            return $locale;
        }

        return static::LOCALE_FALLBACKS[$locale] ?? $locale;
    }

    /**
     * @return Attribute<string|null, never>
     */
    protected function imageUrl(): Attribute
    {
        return Attribute::get(function (): ?string {
            if ($this->image_path === '') {
                return null;
            }

            return Storage::disk('public')->url($this->image_path);
        });
    }
}
