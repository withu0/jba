<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $lesson_category_id
 * @property string $locale
 * @property string $name
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['lesson_category_id', 'locale', 'name'])]
class LessonCategoryTranslation extends Model
{
    /**
     * @return BelongsTo<LessonCategory, $this>
     */
    public function lessonCategory(): BelongsTo
    {
        return $this->belongsTo(LessonCategory::class);
    }
}
