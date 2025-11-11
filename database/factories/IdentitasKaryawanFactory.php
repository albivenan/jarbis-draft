<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\IdentitasKaryawan>
 */
class IdentitasKaryawanFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nama_lengkap' => $this->faker->name(),
            'nik_ktp' => $this->faker->unique()->numerify('################'),
            'nik_perusahaan' => $this->faker->unique()->bothify('??-###'),
            'jenis_kelamin' => $this->faker->randomElement(['Laki-laki', 'Perempuan']),
            'tanggal_lahir' => $this->faker->date(),
            'tempat_lahir' => $this->faker->city(),
            'alamat_ktp' => $this->faker->address(),
            'alamat_domisili' => $this->faker->address(),
            'status_pernikahan' => $this->faker->randomElement(['Menikah', 'Belum Menikah']),
            'agama' => $this->faker->randomElement(['Islam', 'Kristen', 'Katolik', 'Hindu', 'Budha']),
            'golongan_darah' => $this->faker->randomElement(['A', 'B', 'AB', 'O']),
            'kewarganegaraan' => 'WNI',
            'pekerjaan_ktp' => 'Karyawan Swasta',
            'nomor_npwp' => $this->faker->unique()->numerify('##.###.###.#-###.###'),
            'nomor_bpjs_kesehatan' => $this->faker->unique()->numerify('############'),
            'nomor_bpjs_ketenagakerjaan' => $this->faker->unique()->numerify('###########'),
            'foto_profil_url' => $this->faker->imageUrl(),
        ];
    }
}
