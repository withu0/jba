<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $manga_episode_id
 * @property string $locale
 * @property string $title
 * @property string|null $description
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['manga_episode_id', 'locale', 'title', 'description'])]
class MangaEpisodeTranslation extends Model
{
    /**
     * @return BelongsTo<MangaEpisode, $this>
     */
    public function episode(): BelongsTo
    {
        return $this->belongsTo(MangaEpisode::class, 'manga_episode_id');
    }
}
