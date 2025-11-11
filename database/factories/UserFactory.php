<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'remember_token' => Str::random(10),
            'role' => 'employee', // Default role
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }

    /**
     * Set the user role to admin.
     */
    public function admin(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'admin',
        ]);
    }

    /**
     * Set the user role to direktur.
     */
    public function direktur(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'direktur',
        ]);
    }

    /**
     * Set the user role to HRD.
     */
    public function hrd(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'hrd',
        ]);
    }

    /**
     * Set the user role to finance.
     */
    public function finance(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'finance',
        ]);
    }

    /**
     * Set the user role to PPIC.
     */
    public function ppic(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'ppic',
        ]);
    }

    /**
     * Set the user role to employee.
     */
    public function employee(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'employee',
        ]);
    }
}
