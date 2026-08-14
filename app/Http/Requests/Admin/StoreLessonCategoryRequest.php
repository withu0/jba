<?php

namespace App\Http\Requests\Admin;

use App\Concerns\ValidatesLessonInput;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreLessonCategoryRequest extends FormRequest
{
    use ValidatesLessonInput;

    public function authorize(): bool
    {
        return $this->user('admin') !== null;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $rules = [
            'slug' => ['required', 'string', 'max:255', 'alpha_dash', Rule::unique('lesson_categories', 'slug')],
            'sort_order' => ['nullable', 'integer', 'min:0', 'max:9999'],
            'translations' => ['required', 'array'],
        ];

        foreach ($this->supportedLocales() as $locale) {
            $rules["translations.{$locale}"] = ['required', 'array'];
            $rules["translations.{$locale}.name"] = ['required', 'string', 'max:255'];
        }

        return $rules;
    }
}
