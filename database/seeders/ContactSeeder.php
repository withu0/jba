<?php

namespace Database\Seeders;

use App\Models\Contact;
use Illuminate\Database\Seeder;

class ContactSeeder extends Seeder
{
    /**
     * Seed sample contact inquiries for admin status workflow testing.
     */
    public function run(): void
    {
        /** @var list<array{name: string, email: string, subject: ?string, body: string, status: string}> $rows */
        $rows = require __DIR__.'/data/contacts.php';

        foreach ($rows as $row) {
            Contact::query()->updateOrCreate(
                ['email' => $row['email']],
                [
                    'name' => $row['name'],
                    'subject' => $row['subject'],
                    'body' => $row['body'],
                    'status' => $row['status'],
                ],
            );
        }
    }
}
