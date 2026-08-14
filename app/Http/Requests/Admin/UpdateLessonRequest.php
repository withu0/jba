<?php

namespace App\Http\Requests\Admin;

use App\Concerns\ValidatesLessonInput;
use Illuminate\Foundation\Http\FormRequest;

class UpdateLessonRequest extends FormRequest
{
    use ValidatesLessonInput;

    public function authorize(): bool
    {
        return $this->user('admin') !== null;
    }

    protected function prepareForValidation(): void
    {
        $this->prepareLessonBooleans();
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            ...$this->lessonMetaRules(),
            ...$this->lessonTranslationRules(),
            'remove_video' => ['sometimes', 'boolean'],
        ];
    }
}
