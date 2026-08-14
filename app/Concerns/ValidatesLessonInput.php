<?php

namespace App\Concerns;

use Illuminate\Validation\Rule;

trait ValidatesLessonInput
{
    use ResolvesContentLocales;

    /**
     * Uploaded videos are capped well above the typical PHP `upload_max_filesize`,
     * so the effective limit is whatever the web server allows.
     */
    protected const VIDEO_MAX_KILOBYTES = 204800;

    protected const IMAGE_MAX_KILOBYTES = 4096;

    /**
     * @return array<string, mixed>
     */
    protected function lessonMetaRules(): array
    {
        return [
            'lesson_category_id' => ['required', 'integer', Rule::exists('lesson_categories', 'id')],
            'sort_order' => ['nullable', 'integer', 'min:0', 'max:9999'],
            'is_published' => ['sometimes', 'boolean'],
            'video' => [
                'nullable',
                'file',
                'mimetypes:video/mp4,video/webm,video/ogg,video/quicktime',
                'max:'.self::VIDEO_MAX_KILOBYTES,
            ],
            'video_url' => ['nullable', 'string', 'url', 'max:2048'],
            'translations' => ['required', 'array'],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    protected function lessonTranslationRules(): array
    {
        $rules = [];

        foreach ($this->supportedLocales() as $locale) {
            $rules["translations.{$locale}"] = ['required', 'array'];
            $rules["translations.{$locale}.title"] = ['required', 'string', 'max:255'];
            $rules["translations.{$locale}.body"] = ['nullable', 'string'];
        }

        return $rules;
    }

    /**
     * @return array<string, mixed>
     */
    protected function captionTranslationRules(): array
    {
        $rules = ['translations' => ['nullable', 'array']];

        foreach ($this->supportedLocales() as $locale) {
            $rules["translations.{$locale}"] = ['nullable', 'array'];
            $rules["translations.{$locale}.caption"] = ['nullable', 'string', 'max:1000'];
        }

        return $rules;
    }

    protected function prepareLessonBooleans(): void
    {
        if ($this->has('is_published')) {
            $this->merge([
                'is_published' => $this->boolean('is_published'),
            ]);
        }

        if ($this->has('remove_video')) {
            $this->merge([
                'remove_video' => $this->boolean('remove_video'),
            ]);
        }
    }
}
