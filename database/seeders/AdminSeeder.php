<?php

namespace Database\Seeders;

use App\Models\Admin;
use Illuminate\Database\Seeder;

class AdminSeeder extends Seeder
{
    /**
     * Seed the default CMS admin account.
     *
     * Credentials: admin@jba.local / password
     * See docs/implementation/SEEDING.md.
     */
    public function run(): void
    {
        Admin::query()->updateOrCreate(
            ['email' => 'admin@jba.local'],
            [
                'name' => 'JBA Admin',
                'password' => 'password',
            ],
        );
    }
}
