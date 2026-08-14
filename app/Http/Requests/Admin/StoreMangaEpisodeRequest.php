<?php

namespace App\Http\Requests\Admin;

use App\Concerns\ValidatesMangaInput;
use Illuminate\Foundation\Http\FormRequest;

class StoreMangaEpisodeRequest extends FormRequest
{
    use ValidatesMangaInput;

    public function authorize(): bool
    {
        return $this->user('admin') !== null;
    }

    protected function prepareForValidation(): void
    {
        $this->prepareMangaBooleans();
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            ...$this->mangaEpisodeMetaRules(),
            ...$this->mangaEpisodeTranslationRules(),
        ];
    }
}
