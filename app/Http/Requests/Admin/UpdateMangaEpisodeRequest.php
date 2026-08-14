<?php

namespace App\Http\Requests\Admin;

use App\Concerns\ValidatesMangaInput;
use App\Models\MangaEpisode;
use Illuminate\Foundation\Http\FormRequest;

class UpdateMangaEpisodeRequest extends FormRequest
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
        $episode = $this->route('episode');
        $episodeId = $episode instanceof MangaEpisode ? $episode->id : null;

        return [
            ...$this->mangaEpisodeMetaRules($episodeId),
            ...$this->mangaEpisodeTranslationRules(),
        ];
    }
}
