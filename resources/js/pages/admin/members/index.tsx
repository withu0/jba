import { Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { dashboard } from '@/routes/admin';
import {
    create as membersCreate,
    edit as membersEdit,
    index as membersIndex,
} from '@/routes/admin/members';

type MemberRow = {
    id: number;
    name: string;
    email: string;
    role: 'member';
    email_verified_at: string | null;
    created_at: string | null;
};

type Props = {
    members: {
        data: MemberRow[];
        links: Array<{ url: string | null; label: string; active: boolean }>;
        prev_page_url: string | null;
        next_page_url: string | null;
        last_page: number;
    };
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

export default function AdminMembersIndex({ members }: Props) {
    const { t, i18n } = useTranslation();

    return (
        <>
            <Head title={t('admin.members.title')} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="font-serif text-2xl font-bold text-ink">
                            {t('admin.members.title')}
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {t('admin.members.lead')}
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={membersCreate.url()}>
                            {t('admin.members.create')}
                        </Link>
                    </Button>
                </div>

                <div className="overflow-x-auto border border-border">
                    <table className="min-w-160 w-full text-left text-sm">
                        <thead className="border-b border-border bg-surface text-xs tracking-wide text-muted-foreground uppercase">
                            <tr>
                                <th className="px-4 py-3 font-medium">
                                    {t('admin.members.columnName')}
                                </th>
                                <th className="px-4 py-3 font-medium">
                                    {t('admin.members.columnEmail')}
                                </th>
                                <th className="px-4 py-3 font-medium">
                                    {t('admin.members.columnRole')}
                                </th>
                                <th className="px-4 py-3 font-medium">
                                    {t('admin.members.columnStatus')}
                                </th>
                                <th className="px-4 py-3 font-medium">
                                    {t('admin.members.columnCreated')}
                                </th>
                                <th className="px-4 py-3 text-right font-medium">
                                    {t('admin.members.columnActions')}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {members.data.map((member) => (
                                <tr key={member.id} className="bg-background">
                                    <td className="px-4 py-3 font-medium text-ink">
                                        {member.name}
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        {member.email}
                                    </td>
                                    <td className="px-4 py-3">
                                        {t(
                                            `admin.members.roles.${member.role}`,
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        {member.email_verified_at
                                            ? t('admin.members.statusVerified')
                                            : t(
                                                  'admin.members.statusUnverified',
                                              )}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                                        {formatDate(
                                            member.created_at,
                                            i18n.language,
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <Link
                                            href={membersEdit.url(member.id)}
                                            className="text-sm font-medium text-brand-blue underline-offset-4 hover:underline"
                                        >
                                            {t('admin.members.edit')}
                                        </Link>
                                    </td>
                                </tr>
                            ))}

                            {members.data.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-4 py-8 text-center text-sm text-muted-foreground"
                                    >
                                        {t('admin.members.empty')}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {members.last_page > 1 && (
                    <div className="flex justify-end gap-2">
                        {members.prev_page_url && (
                            <Button asChild size="sm" variant="outline">
                                <Link href={members.prev_page_url}>
                                    {t('admin.members.prevPage')}
                                </Link>
                            </Button>
                        )}
                        {members.next_page_url && (
                            <Button asChild size="sm" variant="outline">
                                <Link href={members.next_page_url}>
                                    {t('admin.members.nextPage')}
                                </Link>
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}

AdminMembersIndex.layout = {
    breadcrumbs: [
        { title: 'admin.nav.dashboard', href: dashboard() },
        { title: 'admin.nav.members', href: membersIndex() },
    ],
};
