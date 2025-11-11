<?php

namespace App\Http\Requests\CrewProfile;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class UpdateContactRequest extends FormRequest
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
            'email_pribadi' => ['nullable', 'email', 'max:255', Rule::unique('kontak_karyawan', 'email_pribadi')->ignore($idKaryawan, 'id_karyawan')],
            'nomor_telepon' => ['required', 'string', 'max:20', Rule::unique('kontak_karyawan', 'nomor_telepon')->ignore($idKaryawan, 'id_karyawan')],
            'alamat_domisili' => ['required', 'string', 'max:500'],
        ];
    }
}
