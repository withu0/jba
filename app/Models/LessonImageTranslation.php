<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $lesson_image_id
 * @property string $locale
 * @property string|null $caption
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['lesson_image_id', 'locale', 'caption'])]
class LessonImageTranslation extends Model
{
    /**
     * @return BelongsTo<LessonImage, $this>
     */
    public function lessonImage(): BelongsTo
    {
        return $this->belongsTo(LessonImage::class);
    }
}
