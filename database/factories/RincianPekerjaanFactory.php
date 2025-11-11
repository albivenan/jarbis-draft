<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\RincianPekerjaan>
 */
class RincianPekerjaanFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'tanggal_bergabung' => $this->faker->date(),
            'status_karyawan' => $this->faker->randomElement(['Kontrak', 'Tetap']),
            'lokasi_kerja' => $this->faker->city(),
        ];
    }
}
