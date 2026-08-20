<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreMemberRequest;
use App\Http\Requests\Admin\UpdateMemberRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class MemberController extends Controller
{
    public function index(): Response
    {
        $members = User::query()
            ->orderByDesc('id')
            ->paginate(15)
            ->through(fn (User $user): array => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => 'member',
                'email_verified_at' => $user->email_verified_at?->toIso8601String(),
                'created_at' => $user->created_at?->toIso8601String(),
            ]);

        return Inertia::render('admin/members/index', [
            'members' => $members,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/members/create');
    }

    public function store(StoreMemberRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $user = User::query()->create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => $validated['password'],
        ]);

        $user->markEmailAsVerified();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Member created.'),
        ]);

        return to_route('admin.members.edit', $user);
    }

    public function edit(User $user): Response
    {
        return Inertia::render('admin/members/edit', [
            'member' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ],
        ]);
    }

    public function update(UpdateMemberRequest $request, User $user): RedirectResponse
    {
        $validated = $request->validated();

        $attributes = [
            'name' => $validated['name'],
            'email' => $validated['email'],
        ];

        if (filled($validated['password'] ?? null)) {
            $attributes['password'] = $validated['password'];
        }

        $user->update($attributes);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Member saved.'),
        ]);

        return to_route('admin.members.edit', $user);
    }

    public function destroy(User $user): RedirectResponse
    {
        $user->delete();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Member deleted.'),
        ]);

        return to_route('admin.members.index');
    }
}
