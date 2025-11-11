<?php

namespace App\Http\Requests\CrewProfile;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class UpdateBankRequest extends FormRequest
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
            'nama_bank' => ['required', 'string', 'max:255'],
            'nomor_rekening' => ['required', 'string', 'max:255', Rule::unique('kontak_karyawan', 'nomor_rekening')->ignore($idKaryawan, 'id_karyawan')],
            'nama_pemilik_rekening' => ['required', 'string', 'max:255'],
        ];
    }
}
