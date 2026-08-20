<?php

namespace Tests\Feature\Admin;

use App\Models\Admin;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class MemberAdminTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_cannot_access_member_admin(): void
    {
        $this->get(route('admin.members.index'))
            ->assertRedirect(route('admin.login'));
    }

    public function test_members_cannot_access_member_admin(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get(route('admin.members.index'))
            ->assertRedirect(route('admin.login'));

        $this->assertGuest('admin');
        $this->assertAuthenticatedAs($user);
    }

    public function test_admin_can_create_a_member(): void
    {
        $admin = Admin::factory()->create();

        $response = $this->actingAs($admin, 'admin')
            ->post(route('admin.members.store'), [
                'name' => 'New Member',
                'email' => 'member@example.com',
                'password' => 'password',
                'password_confirmation' => 'password',
            ]);

        $user = User::query()->where('email', 'member@example.com')->firstOrFail();

        $response->assertRedirect(route('admin.members.edit', $user));

        $this->assertSame('New Member', $user->name);
        $this->assertTrue(Hash::check('password', $user->password));
        $this->assertNotNull($user->email_verified_at);
        $this->assertAuthenticatedAs($admin, 'admin');
        $this->assertGuest('web');
    }

    public function test_admin_cannot_create_a_member_with_a_duplicate_email(): void
    {
        $admin = Admin::factory()->create();
        User::factory()->create(['email' => 'taken@example.com']);

        $this->actingAs($admin, 'admin')
            ->from(route('admin.members.create'))
            ->post(route('admin.members.store'), [
                'name' => 'Duplicate',
                'email' => 'taken@example.com',
                'password' => 'password',
                'password_confirmation' => 'password',
            ])
            ->assertRedirect(route('admin.members.create'))
            ->assertSessionHasErrors('email');
    }

    public function test_admin_can_update_a_member_without_changing_the_password(): void
    {
        $admin = Admin::factory()->create();
        $user = User::factory()->create([
            'name' => 'Old Name',
            'email' => 'old@example.com',
        ]);
        $originalHash = $user->password;

        $this->actingAs($admin, 'admin')
            ->put(route('admin.members.update', $user), [
                'name' => 'Updated Name',
                'email' => 'updated@example.com',
            ])
            ->assertRedirect(route('admin.members.edit', $user));

        $user->refresh();

        $this->assertSame('Updated Name', $user->name);
        $this->assertSame('updated@example.com', $user->email);
        $this->assertSame($originalHash, $user->password);
    }

    public function test_admin_can_update_a_member_password(): void
    {
        $admin = Admin::factory()->create();
        $user = User::factory()->create();

        $this->actingAs($admin, 'admin')
            ->put(route('admin.members.update', $user), [
                'name' => $user->name,
                'email' => $user->email,
                'password' => 'new-password',
                'password_confirmation' => 'new-password',
            ])
            ->assertRedirect(route('admin.members.edit', $user));

        $this->assertTrue(Hash::check('new-password', $user->refresh()->password));
    }

    public function test_admin_can_delete_a_member(): void
    {
        $admin = Admin::factory()->create();
        $user = User::factory()->create();

        $this->actingAs($admin, 'admin')
            ->delete(route('admin.members.destroy', $user))
            ->assertRedirect(route('admin.members.index'));

        $this->assertDatabaseMissing('users', ['id' => $user->id]);
    }

    public function test_admin_can_view_members_index(): void
    {
        $admin = Admin::factory()->create();
        $user = User::factory()->create([
            'name' => 'Listed Member',
            'email' => 'listed@example.com',
        ]);

        $this->actingAs($admin, 'admin')
            ->get(route('admin.members.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('admin/members/index')
                ->where('members.data.0.id', $user->id)
                ->where('members.data.0.role', 'member')
                ->where('members.data.0.email', 'listed@example.com')
            );
    }
}
