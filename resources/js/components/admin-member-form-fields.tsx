import { useTranslation } from 'react-i18next';
import { AdminField, AdminFieldGrid } from '@/components/admin-form-layout';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';

type Props = {
    name?: string;
    email?: string;
    passwordRequired: boolean;
    processing: boolean;
    errors: Record<string, string>;
    submitLabel: string;
};

export function AdminMemberFormFields({
    name = '',
    email = '',
    passwordRequired,
    processing,
    errors,
    submitLabel,
}: Props) {
    const { t } = useTranslation();

    return (
        <>
            <section className="space-y-4 border border-border p-4 md:p-5">
                <AdminFieldGrid>
                    <AdminField>
                        <Label htmlFor="name">
                            {t('admin.members.fieldName')}
                        </Label>
                        <Input
                            id="name"
                            name="name"
                            defaultValue={name}
                            required
                            autoComplete="name"
                        />
                        <InputError message={errors.name} />
                    </AdminField>

                    <AdminField>
                        <Label htmlFor="email">
                            {t('admin.members.fieldEmail')}
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            name="email"
                            defaultValue={email}
                            required
                            autoComplete="email"
                        />
                        <InputError message={errors.email} />
                    </AdminField>
                </AdminFieldGrid>

                <AdminFieldGrid>
                    <AdminField>
                        <Label htmlFor="password">
                            {t('admin.members.fieldPassword')}
                        </Label>
                        <PasswordInput
                            id="password"
                            name="password"
                            required={passwordRequired}
                            autoComplete="new-password"
                        />
                        {!passwordRequired && (
                            <p className="text-xs text-muted-foreground">
                                {t('admin.members.passwordHint')}
                            </p>
                        )}
                        <InputError message={errors.password} />
                    </AdminField>

                    <AdminField>
                        <Label htmlFor="password_confirmation">
                            {t('admin.members.fieldPasswordConfirmation')}
                        </Label>
                        <PasswordInput
                            id="password_confirmation"
                            name="password_confirmation"
                            required={passwordRequired}
                            autoComplete="new-password"
                        />
                        <InputError message={errors.password_confirmation} />
                    </AdminField>
                </AdminFieldGrid>
            </section>

            <Button type="submit" disabled={processing}>
                {processing && <Spinner />}
                {submitLabel}
            </Button>
        </>
    );
}
