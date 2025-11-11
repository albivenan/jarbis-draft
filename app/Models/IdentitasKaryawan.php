<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use App\Models\Education;

class IdentitasKaryawan extends Model
{
    use HasFactory;

    protected $table = 'identitas_karyawan';
    protected $primaryKey = 'id_karyawan';

    protected $fillable = [
        'nama_lengkap',
        'nik_ktp',
        'nik_perusahaan',
        'tanggal_lahir',
        'tempat_lahir',
        'jenis_kelamin',
        'status_pernikahan',
        'agama',
        'golongan_darah',
        'kewarganegaraan',
        'pekerjaan_ktp',
        'nomor_npwp',
        'nomor_bpjs_kesehatan',
        'nomor_bpjs_ketenagakerjaan',
        'alamat_ktp',
        'alamat_domisili',
        'foto_profil_url',
        'id_departemen',
    ];

    protected $casts = [
        'tanggal_lahir' => 'date',
    ];

    /**
     * Get the user that owns the identity.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'id_karyawan', 'id_karyawan');
    }

    /**
     * Get the job details for the employee.
     */
    public function rincianPekerjaan(): HasOne
    {
        return $this->hasOne(RincianPekerjaan::class, 'id_karyawan', 'id_karyawan');
    }

    /**
     * Get the department of the employee through rincianPekerjaan.
     */
    public function getDepartemenAttribute()
    {
        return $this->directDepartemen;
    }

    /**
     * Get the contact information for the employee.
     */
    public function kontakKaryawan(): HasOne
    {
        return $this->hasOne(KontakKaryawan::class, 'id_karyawan', 'id_karyawan');
    }

    /**
     * Get the documents for the employee.
     */
    public function dokumen(): HasMany
    {
        return $this->hasMany(DokumenKaryawan::class, 'id_karyawan', 'id_karyawan');
    }

    /**
     * Get the emergency contacts for the employee.
     */
    public function kontakDarurat(): HasMany
    {
        return $this->hasMany(KontakDarurat::class, 'id_karyawan', 'id_karyawan');
    }

    /**
     * Get the education records for the employee.
     */
    public function education(): HasMany
    {
        return $this->hasMany(Education::class, 'id_karyawan', 'id_karyawan');
    }

    /**
     * Get the schedules for the employee.
     */
    public function jadwalKerja(): HasMany
    {
        return $this->hasMany(JadwalKerja::class, 'id_karyawan', 'id_karyawan');
    }

    /**
     * Get the attendance records for the employee.
     */
    public function presensi(): HasMany
    {
        return $this->hasMany(Presensi::class, 'id_karyawan', 'id_karyawan');
    }

    /**
     * Get the department that the employee belongs to directly.
     */
    public function directDepartemen(): BelongsTo
    {
        return $this->belongsTo(Departemen::class, 'id_departemen', 'id_departemen');
    }

    /**
     * Get today's schedule for the employee.
     */
    public function todaySchedule()
    {
        return $this->jadwalKerja()->whereDate('tanggal', today())->first();
    }

    /**
     * Get today's attendance for the employee.
     */
    public function todayAttendance()
    {
        return $this->presensi()->whereDate('tanggal', today())->first();
    }
}