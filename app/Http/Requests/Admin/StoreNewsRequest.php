<?php

namespace App\Http\Requests\Admin;

use App\Concerns\ValidatesPostTranslations;
use Illuminate\Foundation\Http\FormRequest;

class StoreNewsRequest extends FormRequest
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
        return [
            ...$this->postMetaRules(),
            ...$this->translationRules('news_translations'),
        ];
    }
}
