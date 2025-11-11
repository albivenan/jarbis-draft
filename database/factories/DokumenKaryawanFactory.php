<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\DokumenKaryawan>
 */
class DokumenKaryawanFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nama_dokumen' => $this->faker->word(),
            'jenis_dokumen' => $this->faker->randomElement(['Identitas', 'Pendidikan', 'Sertifikat']),
            'tanggal_unggah' => $this->faker->date(),
            'url' => $this->faker->url(),
        ];
    }
}
