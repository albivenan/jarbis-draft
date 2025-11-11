<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\KontakDarurat>
 */
class KontakDaruratFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nama' => $this->faker->name(),
            'hubungan' => $this->faker->randomElement(['Istri', 'Suami', 'Ayah', 'Ibu', 'Saudara']),
            'nomor_telepon' => $this->faker->phoneNumber(),
        ];
    }
}
