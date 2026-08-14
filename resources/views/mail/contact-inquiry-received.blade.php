New contact inquiry

Name: {{ $contact->name }}
Email: {{ $contact->email }}
Subject: {{ $contact->subject ?: '(none)' }}
Status: {{ $contact->status }}
Submitted: {{ $contact->created_at?->toDateTimeString() }}

Message:
{{ $contact->body }}
