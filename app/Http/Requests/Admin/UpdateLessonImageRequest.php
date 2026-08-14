<?php

namespace App\Http\Requests\Admin;

use App\Concerns\ValidatesLessonInput;
use Illuminate\Foundation\Http\FormRequest;

class UpdateLessonImageRequest extends FormRequest
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
        return [
            'image' => ['nullable', 'image', 'max:'.self::IMAGE_MAX_KILOBYTES],
            'sort_order' => ['nullable', 'integer', 'min:0', 'max:9999'],
            ...$this->captionTranslationRules(),
        ];
    }
}
