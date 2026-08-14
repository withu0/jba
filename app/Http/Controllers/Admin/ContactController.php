<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateContactRequest;
use App\Models\Contact;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ContactController extends Controller
{
    public function index(Request $request): Response
    {
        $status = $request->string('status')->toString();
        $statusFilter = in_array($status, Contact::STATUSES, true) ? $status : null;

        $contacts = Contact::query()
            ->when($statusFilter, fn ($query) => $query->status($statusFilter))
            ->orderByDesc('created_at')
            ->orderByDesc('id')
            ->paginate(20)
            ->withQueryString()
            ->through(fn (Contact $contact): array => [
                'id' => $contact->id,
                'name' => $contact->name,
                'email' => $contact->email,
                'subject' => $contact->subject,
                'status' => $contact->status,
                'created_at' => $contact->created_at?->toIso8601String(),
            ]);

        return Inertia::render('admin/contacts/index', [
            'contacts' => $contacts,
            'filters' => [
                'status' => $statusFilter,
            ],
            'statuses' => Contact::STATUSES,
        ]);
    }

    public function show(Contact $contact): Response
    {
        return Inertia::render('admin/contacts/show', [
            'contact' => [
                'id' => $contact->id,
                'name' => $contact->name,
                'email' => $contact->email,
                'subject' => $contact->subject,
                'body' => $contact->body,
                'status' => $contact->status,
                'created_at' => $contact->created_at?->toIso8601String(),
                'updated_at' => $contact->updated_at?->toIso8601String(),
            ],
            'statuses' => Contact::STATUSES,
        ]);
    }

    public function update(UpdateContactRequest $request, Contact $contact): RedirectResponse
    {
        $contact->update([
            'status' => $request->validated('status'),
        ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Contact status updated.'),
        ]);

        return to_route('admin.contacts.show', $contact);
    }
}
