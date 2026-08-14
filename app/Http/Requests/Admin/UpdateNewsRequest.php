<?php

namespace App\Http\Requests\Admin;

use App\Concerns\ValidatesPostTranslations;
use App\Models\News;
use Illuminate\Foundation\Http\FormRequest;

class UpdateNewsRequest extends FormRequest
{
    use ValidatesPostTranslations;

    public function authorize(): bool
    {
        return $this->user('admin') !== null;
    }

    protected function prepareForValidation(): void
    {
        $this->preparePostBooleans();
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        /** @var News $news */
        $news = $this->route('news');

        return [
            ...$this->postMetaRules(),
            ...$this->translationRules('news_translations', $news->id, 'news_id'),
        ];
    }
}
