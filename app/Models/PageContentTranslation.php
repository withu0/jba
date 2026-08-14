<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $page_content_id
 * @property string $locale
 * @property string $title
 * @property string|null $body
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['page_content_id', 'locale', 'title', 'body'])]
class PageContentTranslation extends Model
{
    /**
     * @return BelongsTo<PageContent, $this>
     */
    public function pageContent(): BelongsTo
    {
        return $this->belongsTo(PageContent::class);
    }
}
