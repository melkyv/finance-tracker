<?php

namespace Database\Factories;

use App\Enums\AccountType;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Model>
 */
class AccountFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'type' => $this->faker->randomElement(AccountType::getValues()),
            'name' => $this->faker->company(),
            'user_id' => 1, //User::factory(),
            'balance' => $this->faker->randomFloat(2, 0, 8000),
        ];
    }
}