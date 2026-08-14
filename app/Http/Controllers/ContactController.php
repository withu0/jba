<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreContactRequest;
use App\Mail\ContactInquiryReceived;
use App\Models\Contact;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class ContactController extends Controller
{
    /**
     * Dedicated contact URL lands on the counseling page form.
     */
    public function create(): RedirectResponse
    {
        return redirect()->route('counseling')->withFragment('contact');
    }

    public function store(StoreContactRequest $request): RedirectResponse
    {
        // Honeypot filled — pretend success without persisting.
        if (filled($request->input('website'))) {
            Inertia::flash('toast', [
                'type' => 'success',
                'message' => __('Thank you. Your message has been sent.'),
            ]);

            return back();
        }

        $contact = Contact::query()->create([
            'name' => $request->validated('name'),
            'email' => $request->validated('email'),
            'subject' => $request->validated('subject'),
            'body' => $request->validated('body'),
            'status' => Contact::STATUS_NEW,
        ]);

        $notifyTo = config('contact.notification_email');

        if (is_string($notifyTo) && $notifyTo !== '') {
            Mail::to($notifyTo)->send(new ContactInquiryReceived($contact));
        }

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Thank you. Your message has been sent.'),
        ]);

        return back();
    }
}
