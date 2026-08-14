<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $manga_category_id
 * @property string $locale
 * @property string $name
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['manga_category_id', 'locale', 'name'])]
class MangaCategoryTranslation extends Model
{
    /**
     * @return BelongsTo<MangaCategory, $this>
     */
    public function mangaCategory(): BelongsTo
    {
        return $this->belongsTo(MangaCategory::class);
    }
}
