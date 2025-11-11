<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\KontakKaryawan>
 */
class KontakKaryawanFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'email_pribadi' => $this->faker->unique()->safeEmail(),
            'nomor_telepon' => $this->faker->phoneNumber(),
            'nama_bank' => $this->faker->randomElement(['BCA', 'Mandiri', 'BNI', 'BRI']),
            'nomor_rekening' => $this->faker->creditCardNumber(),
            'nama_pemilik_rekening' => $this->faker->name(),
        ];
    }
}
