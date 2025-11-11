<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Create admin user
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@brewbox.com',
            'password' => 'admin123',
            'number' => '9876543210',
            'is_admin' => true,
        ]);

        // Create regular user
        User::create([
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'password123',
            'number' => '9876543211',
            'is_admin' => false,
        ]);

        // Create another regular user
        User::create([
            'name' => 'Jane Smith',
            'email' => 'jane@example.com',
            'password' => 'password123',
            'number' => '9876543212',
            'is_admin' => false,
        ]);

        echo "✓ Users created successfully\n";
    }
}
