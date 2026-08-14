<?php

namespace Tests\Feature;

use App\Mail\ContactInquiryReceived;
use App\Models\Admin;
use App\Models\Contact;
use Database\Seeders\ContactSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ContactTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_can_submit_contact_form(): void
    {
        $response = $this->from(route('counseling'))
            ->post(route('contact.store'), [
                'name' => 'Test Guest',
                'email' => 'guest@example.com',
                'subject' => 'Question',
                'body' => 'I would like to know more about counseling.',
                'website' => '',
            ]);

        $response->assertRedirect(route('counseling'));

        $this->assertDatabaseHas('contacts', [
            'name' => 'Test Guest',
            'email' => 'guest@example.com',
            'subject' => 'Question',
            'status' => Contact::STATUS_NEW,
        ]);
    }

    public function test_honeypot_submission_is_ignored(): void
    {
        $this->from(route('counseling'))
            ->post(route('contact.store'), [
                'name' => 'Bot',
                'email' => 'bot@example.com',
                'subject' => 'Spam',
                'body' => 'Buy now',
                'website' => 'https://spam.example',
            ])
            ->assertRedirect(route('counseling'));

        $this->assertDatabaseMissing('contacts', [
            'email' => 'bot@example.com',
        ]);
    }

    public function test_optional_notification_email_is_sent_when_configured(): void
    {
        config(['contact.notification_email' => 'admin-notify@example.com']);
        Mail::fake();

        $this->post(route('contact.store'), [
            'name' => 'Notifier',
            'email' => 'notifier@example.com',
            'body' => 'Please contact me.',
            'website' => '',
        ])->assertRedirect();

        Mail::assertSent(ContactInquiryReceived::class, function (ContactInquiryReceived $mail): bool {
            return $mail->hasTo('admin-notify@example.com')
                && $mail->contact->email === 'notifier@example.com';
        });
    }

    public function test_contact_seeder_creates_sample_rows(): void
    {
        $this->seed(ContactSeeder::class);

        $this->assertSame(4, Contact::query()->count());
        $this->assertDatabaseHas('contacts', [
            'email' => 'alex.rivera@example.com',
            'status' => Contact::STATUS_IN_PROGRESS,
        ]);
    }

    public function test_admin_can_list_filter_and_update_contact_status(): void
    {
        $this->seed(ContactSeeder::class);
        $admin = Admin::factory()->create();
        $contact = Contact::query()->where('status', Contact::STATUS_NEW)->firstOrFail();

        $this->actingAs($admin, 'admin')
            ->get(route('admin.contacts.index', ['status' => Contact::STATUS_NEW]))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('admin/contacts/index')
                ->where('filters.status', Contact::STATUS_NEW)
                ->has('contacts.data')
            );

        $this->actingAs($admin, 'admin')
            ->get(route('admin.contacts.show', $contact))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('admin/contacts/show')
                ->where('contact.id', $contact->id)
            );

        $this->actingAs($admin, 'admin')
            ->put(route('admin.contacts.update', $contact), [
                'status' => Contact::STATUS_CLOSED,
            ])
            ->assertRedirect(route('admin.contacts.show', $contact));

        $this->assertDatabaseHas('contacts', [
            'id' => $contact->id,
            'status' => Contact::STATUS_CLOSED,
        ]);
    }

    public function test_guests_cannot_access_admin_contacts(): void
    {
        $contact = Contact::factory()->create();

        $this->get(route('admin.contacts.index'))
            ->assertRedirect(route('admin.login'));

        $this->get(route('admin.contacts.show', $contact))
            ->assertRedirect(route('admin.login'));
    }

    public function test_contact_route_redirects_to_counseling_form(): void
    {
        $this->get(route('contact'))
            ->assertRedirect(route('counseling').'#contact');
    }
}
