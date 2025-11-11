<?php

namespace App\Http\Requests\CrewProfile;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class UpdateTaxRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return Auth::check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $idKaryawan = Auth::user()->id_karyawan;

        return [
            'nomor_npwp' => ['nullable', 'string', 'max:25', Rule::unique('identitas_karyawan', 'nomor_npwp')->ignore($idKaryawan, 'id_karyawan')],
            'nomor_bpjs_kesehatan' => ['nullable', 'string', 'max:25', Rule::unique('identitas_karyawan', 'nomor_bpjs_kesehatan')->ignore($idKaryawan, 'id_karyawan')],
            'nomor_bpjs_ketenagakerjaan' => ['nullable', 'string', 'max:25', Rule::unique('identitas_karyawan', 'nomor_bpjs_ketenagakerjaan')->ignore($idKaryawan, 'id_karyawan')],
        ];
    }
}
