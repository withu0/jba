<?php

namespace App\Concerns;

use Illuminate\Validation\Rule;

trait ValidatesMangaInput
{
    use ResolvesContentLocales;

    /**
     * @return array<string, mixed>
     */
    protected function mangaEpisodeMetaRules(?int $ignoreEpisodeId = null): array
    {
        $slug = [
            'required',
            'string',
            'max:255',
            'alpha_dash',
            Rule::unique('manga_episodes', 'slug')->ignore($ignoreEpisodeId),
        ];

        return [
            'manga_category_id' => ['required', 'integer', Rule::exists('manga_categories', 'id')],
            'slug' => $slug,
            'sort_order' => ['nullable', 'integer', 'min:0', 'max:9999'],
            'is_published' => ['sometimes', 'boolean'],
            'translations' => ['required', 'array'],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    protected function mangaEpisodeTranslationRules(): array
    {
        $rules = [];

        foreach ($this->supportedLocales() as $locale) {
            $rules["translations.{$locale}"] = ['required', 'array'];
            $rules["translations.{$locale}.title"] = ['required', 'string', 'max:255'];
            $rules["translations.{$locale}.description"] = ['nullable', 'string'];
        }

        return $rules;
    }

    protected function prepareMangaBooleans(): void
    {
        if ($this->has('is_published')) {
            $this->merge([
                'is_published' => $this->boolean('is_published'),
            ]);
        }
    }
}
