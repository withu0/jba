<?php

namespace App\Concerns;

use Illuminate\Validation\Rule;

trait ValidatesPostTranslations
{
    /**
     * @return array<string, mixed>
     */
    protected function postMetaRules(): array
    {
        return [
            'is_published' => ['sometimes', 'boolean'],
            'published_at' => ['nullable', 'date'],
            'featured_image' => ['nullable', 'image', 'max:2048'],
            'remove_featured_image' => ['sometimes', 'boolean'],
            'translations' => ['required', 'array'],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    protected function translationRules(string $table, ?int $ignoreParentId = null, string $parentColumn = 'news_id'): array
    {
        $locales = config('localization.supported', ['ja', 'en', 'zh']);
        $rules = [];

        foreach ($locales as $locale) {
            $slugUnique = Rule::unique($table, 'slug')->where('locale', $locale);

            if ($ignoreParentId !== null) {
                $slugUnique->whereNot($parentColumn, $ignoreParentId);
            }

            $rules["translations.{$locale}"] = ['required', 'array'];
            $rules["translations.{$locale}.slug"] = ['required', 'string', 'max:255', 'alpha_dash', $slugUnique];
            $rules["translations.{$locale}.title"] = ['required', 'string', 'max:255'];
            $rules["translations.{$locale}.excerpt"] = ['nullable', 'string', 'max:1000'];
            $rules["translations.{$locale}.body"] = ['nullable', 'string'];
        }

        return $rules;
    }

    protected function preparePostBooleans(): void
    {
        if ($this->has('is_published')) {
            $this->merge([
                'is_published' => $this->boolean('is_published'),
            ]);
        }

        if ($this->has('remove_featured_image')) {
            $this->merge([
                'remove_featured_image' => $this->boolean('remove_featured_image'),
            ]);
        }
    }
}
