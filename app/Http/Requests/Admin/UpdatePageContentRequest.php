<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePageContentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user('admin') !== null;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $locales = config('localization.supported', ['ja', 'en', 'zh']);

        $rules = [
            'translations' => ['required', 'array'],
        ];

        foreach ($locales as $locale) {
            $rules["translations.{$locale}"] = ['required', 'array'];
            $rules["translations.{$locale}.title"] = ['required', 'string', 'max:255'];
            $rules["translations.{$locale}.body"] = ['nullable', 'string'];
        }

        return $rules;
    }
}
