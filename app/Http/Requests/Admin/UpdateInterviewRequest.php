<?php

namespace App\Http\Requests\Admin;

use App\Concerns\ValidatesPostTranslations;
use App\Models\Interview;
use Illuminate\Foundation\Http\FormRequest;

class UpdateInterviewRequest extends FormRequest
{
    use ValidatesPostTranslations;

    public function authorize(): bool
    {
        return $this->user('admin') !== null;
    }

    protected function prepareForValidation(): void
    {
        $this->preparePostBooleans();
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        /** @var Interview $interview */
        $interview = $this->route('interview');

        return [
            ...$this->postMetaRules(),
            ...$this->translationRules('interview_translations', $interview->id, 'interview_id'),
        ];
    }
}
