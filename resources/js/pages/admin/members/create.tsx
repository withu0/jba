import { Form, Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import MemberController from '@/actions/App/Http/Controllers/Admin/MemberController';
import { AdminMemberFormFields } from '@/components/admin-member-form-fields';
import { dashboard } from '@/routes/admin';
import { index as membersIndex } from '@/routes/admin/members';

export default function AdminMembersCreate() {
    const { t } = useTranslation();

    return (
        <>
            <Head title={t('admin.members.createTitle')} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="font-serif text-2xl font-bold text-ink">
                            {t('admin.members.createTitle')}
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {t('admin.members.formLead')}
                        </p>
                    </div>
                    <Link
                        href={membersIndex()}
                        className="text-sm text-brand-blue underline-offset-4 hover:underline"
                    >
                        {t('admin.members.backToList')}
                    </Link>
                </div>

                <Form
                    {...MemberController.store.form()}
                    resetOnSuccess={['password', 'password_confirmation']}
                    className="space-y-8"
                >
                    {({ processing, errors }) => (
                        <AdminMemberFormFields
                            passwordRequired
                            processing={processing}
                            errors={errors}
                            submitLabel={t('admin.members.create')}
                        />
                    )}
                </Form>
            </div>
        </>
    );
}

AdminMembersCreate.layout = {
    breadcrumbs: [
        { title: 'admin.nav.dashboard', href: dashboard() },
        { title: 'admin.nav.members', href: membersIndex() },
    ],
};
