import { Form, Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import ContactController from '@/actions/App/Http/Controllers/Admin/ContactController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { dashboard } from '@/routes/admin';
import { index as contactsIndex } from '@/routes/admin/contacts';

type Props = {
    contact: {
        id: number;
        name: string;
        email: string;
        subject: string | null;
        body: string;
        status: string;
        created_at: string | null;
        updated_at: string | null;
    };
    statuses: string[];
};

function formatDate(value: string | null, locale: string): string {
    if (!value) {
        return '—';
    }

    return new Intl.DateTimeFormat(locale, {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(value));
}

export default function AdminContactsShow({ contact, statuses }: Props) {
    const { t, i18n } = useTranslation();

    return (
        <>
            <Head title={t('admin.contacts.detailTitle')} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="font-serif text-2xl font-bold text-ink">
                            {contact.subject?.trim() ||
                                t('admin.contacts.noSubject')}
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {t('admin.contacts.detailLead')}
                        </p>
                    </div>
                    <Link
                        href={contactsIndex()}
                        className="text-sm text-brand-blue underline-offset-4 hover:underline"
                    >
                        {t('admin.contacts.backToList')}
                    </Link>
                </div>

                <dl className="grid gap-4 border border-border p-4 md:p-5">
                    <div>
                        <dt className="text-xs tracking-wide text-muted-foreground uppercase">
                            {t('admin.contacts.fieldName')}
                        </dt>
                        <dd className="mt-1 text-sm text-ink">
                            {contact.name}
                        </dd>
                    </div>
                    <div>
                        <dt className="text-xs tracking-wide text-muted-foreground uppercase">
                            {t('admin.contacts.fieldEmail')}
                        </dt>
                        <dd className="mt-1 text-sm text-ink">
                            <a
                                href={`mailto:${contact.email}`}
                                className="text-brand-blue underline-offset-4 hover:underline"
                            >
                                {contact.email}
                            </a>
                        </dd>
                    </div>
                    <div>
                        <dt className="text-xs tracking-wide text-muted-foreground uppercase">
                            {t('admin.contacts.fieldSubject')}
                        </dt>
                        <dd className="mt-1 text-sm text-ink">
                            {contact.subject?.trim() ||
                                t('admin.contacts.noSubject')}
                        </dd>
                    </div>
                    <div>
                        <dt className="text-xs tracking-wide text-muted-foreground uppercase">
                            {t('admin.contacts.fieldSubmitted')}
                        </dt>
                        <dd className="mt-1 text-sm text-ink">
                            {formatDate(contact.created_at, i18n.language)}
                        </dd>
                    </div>
                    <div>
                        <dt className="text-xs tracking-wide text-muted-foreground uppercase">
                            {t('admin.contacts.fieldMessage')}
                        </dt>
                        <dd className="mt-2 text-sm leading-relaxed whitespace-pre-line text-ink">
                            {contact.body}
                        </dd>
                    </div>
                </dl>

                <Form
                    {...ContactController.update.form(contact.id)}
                    options={{ preserveScroll: true }}
                    className="space-y-4 border border-border p-4 md:p-5"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="contact-status">
                                    {t('admin.contacts.fieldStatus')}
                                </Label>
                                <select
                                    id="contact-status"
                                    name="status"
                                    defaultValue={contact.status}
                                    className="h-9 w-full max-w-xs rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                >
                                    {statuses.map((status) => (
                                        <option key={status} value={status}>
                                            {t(
                                                `admin.contacts.status.${status}`,
                                            )}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.status} />
                            </div>

                            <Button type="submit" disabled={processing}>
                                {processing && <Spinner />}
                                {t('admin.contacts.saveStatus')}
                            </Button>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}

AdminContactsShow.layout = {
    breadcrumbs: [
        { title: 'admin.nav.dashboard', href: dashboard() },
        { title: 'admin.nav.contacts', href: contactsIndex() },
        { title: 'admin.contacts.detailTitle', href: contactsIndex() },
    ],
};
