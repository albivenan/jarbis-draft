<?php

namespace App\Http\Requests\CrewProfile;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class UpdateKtpRequest extends FormRequest
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
            'nama_lengkap' => ['required', 'string', 'max:255'],
            'nik_ktp' => ['required', 'string', 'digits:16', Rule::unique('identitas_karyawan', 'nik_ktp')->ignore($idKaryawan, 'id_karyawan')],
            'tempat_lahir' => ['required', 'string', 'max:255'],
            'tanggal_lahir' => ['required', 'date'],
            'jenis_kelamin' => ['required', Rule::in(['Laki-laki', 'Perempuan'])],
            'golongan_darah' => ['nullable', Rule::in(['A', 'B', 'AB', 'O'])],
            'agama' => ['required', 'string', 'max:255'],
            'status_pernikahan' => ['required', 'string', 'max:255'],
            'kewarganegaraan' => ['required', 'string', 'max:255'],
            'pekerjaan_ktp' => ['required', 'string', 'max:255'],
            'alamat_ktp' => ['required', 'string', 'max:500'],
        ];
    }
}
