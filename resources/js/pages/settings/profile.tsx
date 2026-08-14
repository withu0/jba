import { Form, Head, usePage } from '@inertiajs/react';
/* @chisel-email-verification */
import { Link } from '@inertiajs/react';
/* @end-chisel-email-verification */
import { useTranslation } from 'react-i18next';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import DeleteUser from '@/components/delete-user';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useInitials } from '@/hooks/use-initials';
import { edit } from '@/routes/profile';
import type { Auth } from '@/types';
/* @chisel-email-verification */
import { send } from '@/routes/verification';
/* @end-chisel-email-verification */

type PageProps = {
    auth: Auth;
};

export default function Profile(
    /* @chisel-email-verification */
    {
        mustVerifyEmail,
        status,
    }: {
        mustVerifyEmail: boolean;
        status?: string;
    },
    /* @end-chisel-email-verification */
) {
    const { auth } = usePage<PageProps>().props;
    const { t } = useTranslation();
    const getInitials = useInitials();
    const user = auth.user;

    if (!user) {
        return null;
    }

    return (
        <>
            <Head title={t('settings.profileSettings')} />

            <h1 className="sr-only">{t('settings.profileSettings')}</h1>

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title={t('settings.profile')}
                    description={t('settings.profileDescription')}
                />

                <Form
                    {...ProfileController.update.form()}
                    options={{
                        preserveScroll: true,
                        forceFormData: true,
                    }}
                    className="space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="avatar">
                                    {t('settings.avatar')}
                                </Label>

                                <div className="flex items-center gap-4">
                                    <Avatar className="size-16 overflow-hidden rounded-full border border-border">
                                        <AvatarImage
                                            src={user.avatar ?? undefined}
                                            alt={user.name}
                                        />
                                        <AvatarFallback className="bg-surface text-ink">
                                            {getInitials(user.name)}
                                        </AvatarFallback>
                                    </Avatar>

                                    <Input
                                        id="avatar"
                                        type="file"
                                        name="avatar"
                                        accept="image/*"
                                        className="mt-1 block w-full max-w-sm"
                                    />
                                </div>

                                <p className="text-xs text-muted-foreground">
                                    {t('settings.avatarHint')}
                                </p>

                                <InputError
                                    className="mt-2"
                                    message={errors.avatar}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="name">{t('auth.name')}</Label>

                                <Input
                                    id="name"
                                    className="mt-1 block w-full"
                                    defaultValue={user.name}
                                    name="name"
                                    required
                                    autoComplete="name"
                                    placeholder={t('auth.fullName')}
                                />

                                <InputError
                                    className="mt-2"
                                    message={errors.name}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">
                                    {t('auth.emailAddress')}
                                </Label>

                                <Input
                                    id="email"
                                    type="email"
                                    className="mt-1 block w-full"
                                    defaultValue={user.email}
                                    name="email"
                                    required
                                    autoComplete="username"
                                    placeholder={t('auth.emailAddress')}
                                />

                                <InputError
                                    className="mt-2"
                                    message={errors.email}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="bio">{t('settings.bio')}</Label>

                                <textarea
                                    id="bio"
                                    name="bio"
                                    rows={4}
                                    defaultValue={user.bio ?? ''}
                                    placeholder={t('settings.bioPlaceholder')}
                                    className="mt-1 flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
                                />

                                <InputError
                                    className="mt-2"
                                    message={errors.bio}
                                />
                            </div>

                            {/* @chisel-email-verification */}
                            {mustVerifyEmail &&
                                user.email_verified_at === null && (
                                    <div>
                                        <p className="-mt-4 text-sm text-muted-foreground">
                                            {t('settings.emailUnverified')}{' '}
                                            <Link
                                                href={send()}
                                                as="button"
                                                className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                            >
                                                {t(
                                                    'settings.resendVerification',
                                                )}
                                            </Link>
                                        </p>

                                        {status ===
                                            'verification-link-sent' && (
                                            <div className="mt-2 text-sm font-medium text-green-600">
                                                {t(
                                                    'settings.verificationLinkSentToEmail',
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                            {/* @end-chisel-email-verification */}

                            <div className="flex items-center gap-4">
                                <Button
                                    disabled={processing}
                                    data-test="update-profile-button"
                                >
                                    {t('common.save')}
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>

            <DeleteUser />
        </>
    );
}

Profile.layout = {
    breadcrumbs: [
        {
            title: 'settings.profileSettings',
            href: edit(),
        },
    ],
};
