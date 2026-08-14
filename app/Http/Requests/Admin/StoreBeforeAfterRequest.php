<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreBeforeAfterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user('admin') !== null;
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('is_published')) {
            $this->merge([
                'is_published' => $this->boolean('is_published'),
            ]);
        }
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $locales = config('localization.supported', ['ja', 'en', 'zh']);
        $rules = [
            'is_published' => ['sometimes', 'boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0', 'max:9999'],
            'before_image' => ['required', 'image', 'max:4096'],
            'after_image' => ['required', 'image', 'max:4096'],
            'translations' => ['required', 'array'],
        ];

        foreach ($locales as $locale) {
            $rules["translations.{$locale}"] = ['required', 'array'];
            $rules["translations.{$locale}.title"] = ['required', 'string', 'max:255'];
            $rules["translations.{$locale}.caption"] = ['nullable', 'string', 'max:1000'];
        }

        return $rules;
    }
}
