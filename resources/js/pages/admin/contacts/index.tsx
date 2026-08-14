import { Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { dashboard } from '@/routes/admin';
import {
    index as contactsIndex,
    show as contactsShow,
} from '@/routes/admin/contacts';

type ContactRow = {
    id: number;
    name: string;
    email: string;
    subject: string | null;
    status: string;
    created_at: string | null;
};

type Props = {
    contacts: {
        data: ContactRow[];
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    filters: {
        status: string | null;
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

export default function AdminContactsIndex({
    contacts,
    filters,
    statuses,
}: Props) {
    const { t, i18n } = useTranslation();

    return (
        <>
            <Head title={t('admin.contacts.title')} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div>
                    <h1 className="font-serif text-2xl font-bold text-ink">
                        {t('admin.contacts.title')}
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {t('admin.contacts.lead')}
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    <Button
                        type="button"
                        size="sm"
                        variant={
                            filters.status === null ? 'default' : 'outline'
                        }
                        asChild
                    >
                        <Link href={contactsIndex.url()}>
                            {t('admin.contacts.filterAll')}
                        </Link>
                    </Button>
                    {statuses.map((status) => (
                        <Button
                            key={status}
                            type="button"
                            size="sm"
                            variant={
                                filters.status === status
                                    ? 'default'
                                    : 'outline'
                            }
                            asChild
                        >
                            <Link
                                href={contactsIndex.url({
                                    query: { status },
                                })}
                            >
                                {t(`admin.contacts.status.${status}`)}
                            </Link>
                        </Button>
                    ))}
                </div>

                <div className="divide-y divide-border border border-border">
                    {contacts.data.map((contact) => (
                        <div
                            key={contact.id}
                            className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
                        >
                            <div className="min-w-0">
                                <div className="text-sm font-medium text-ink">
                                    {contact.subject?.trim() ||
                                        t('admin.contacts.noSubject')}
                                </div>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    {contact.name} · {contact.email} ·{' '}
                                    {t(
                                        `admin.contacts.status.${contact.status}`,
                                    )}{' '}
                                    ·{' '}
                                    {formatDate(
                                        contact.created_at,
                                        i18n.language,
                                    )}
                                </p>
                            </div>
                            <Link
                                href={contactsShow.url(contact.id)}
                                className="text-sm font-medium text-brand-blue underline-offset-4 hover:underline"
                            >
                                {t('admin.contacts.view')}
                            </Link>
                        </div>
                    ))}

                    {contacts.data.length === 0 && (
                        <p className="px-4 py-8 text-sm text-muted-foreground">
                            {t('admin.contacts.empty')}
                        </p>
                    )}
                </div>
            </div>
        </>
    );
}

AdminContactsIndex.layout = {
    breadcrumbs: [
        { title: 'admin.nav.dashboard', href: dashboard() },
        { title: 'admin.nav.contacts', href: contactsIndex() },
    ],
};
