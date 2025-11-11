<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class AdminUserSeeder extends Seeder
{
    public function run()
    {
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@brewbox.com',
            'password' => 'admin123', // Will be auto-hashed
            'number' => '1234567890',
            'is_admin' => true,
        ]);
    }
}
