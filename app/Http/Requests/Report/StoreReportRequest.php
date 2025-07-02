<?php

namespace App\Http\Requests\Report;

use Illuminate\Foundation\Http\FormRequest;

class StoreReportRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'type' => ['required', 'string', 'in:monthly,custom,yearly'],
            'from_date' => ['required', 'date'],
            'to_date' => ['required', 'date', 'after_or_equal:from_date'],
        ];
    }

    /**
     * Get custom validation messages.
     */
    public function messages(): array
    {
        return [
            'title.required' => 'Report title is required.',
            'title.max' => 'Report title cannot exceed 255 characters.',
            'type.required' => 'Report type is required.',
            'type.in' => 'Invalid report type selected.',
            'from_date.required' => 'Start date is required.',
            'from_date.date' => 'Start date must be a valid date.',
            'to_date.required' => 'End date is required.',
            'to_date.date' => 'End date must be a valid date.',
            'to_date.after_or_equal' => 'End date must be equal or after start date.',
        ];
    }
}
