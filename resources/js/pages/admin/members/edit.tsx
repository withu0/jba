import { Form, Head, Link, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import MemberController from '@/actions/App/Http/Controllers/Admin/MemberController';
import { AdminMemberFormFields } from '@/components/admin-member-form-fields';
import { Button } from '@/components/ui/button';
import { dashboard } from '@/routes/admin';
import { index as membersIndex } from '@/routes/admin/members';

type Props = {
    member: {
        id: number;
        name: string;
        email: string;
    };
};

export default function AdminMembersEdit({ member }: Props) {
    const { t } = useTranslation();

    const handleDelete = () => {
        if (!window.confirm(t('admin.members.deleteConfirm'))) {
            return;
        }

        router.delete(MemberController.destroy.url(member.id));
    };

    return (
        <>
            <Head title={t('admin.members.editTitle')} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="font-serif text-2xl font-bold text-ink">
                            {t('admin.members.editTitle')}
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {t('admin.members.formLead')}
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link
                            href={membersIndex()}
                            className="text-sm text-brand-blue underline-offset-4 hover:underline"
                        >
                            {t('admin.members.backToList')}
                        </Link>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleDelete}
                        >
                            {t('common.delete')}
                        </Button>
                    </div>
                </div>

                <Form
                    {...MemberController.update.form(member.id)}
                    resetOnSuccess={['password', 'password_confirmation']}
                    options={{ preserveScroll: true }}
                    className="space-y-8"
                >
                    {({ processing, errors }) => (
                        <AdminMemberFormFields
                            name={member.name}
                            email={member.email}
                            passwordRequired={false}
                            processing={processing}
                            errors={errors}
                            submitLabel={t('admin.members.save')}
                        />
                    )}
                </Form>
            </div>
        </>
    );
}

AdminMembersEdit.layout = {
    breadcrumbs: [
        { title: 'admin.nav.dashboard', href: dashboard() },
        { title: 'admin.nav.members', href: membersIndex() },
    ],
};
