<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $before_after_id
 * @property string $locale
 * @property string $title
 * @property string|null $caption
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['before_after_id', 'locale', 'title', 'caption'])]
class BeforeAfterTranslation extends Model
{
    /**
     * @return BelongsTo<BeforeAfter, $this>
     */
    public function beforeAfter(): BelongsTo
    {
        return $this->belongsTo(BeforeAfter::class);
    }
}
