import { cn } from '@/lib/utils';

type Props = {
    className?: string;
    variant?: 'black' | 'white';
};

export default function AppLogoIcon({ className, variant = 'black' }: Props) {
    if (variant === 'white') {
        return (
            <img
                src="/images/JBA_logo-white.svg"
                alt="JBA"
                className={cn(
                    'h-8 w-auto object-contain object-left',
                    className,
                )}
            />
        );
    }

    return (
        <>
            <img
                src="/images/JBA_logo-black.svg"
                alt="JBA"
                className={cn(
                    'h-8 w-auto object-contain object-left dark:hidden',
                    className,
                )}
            />
            <img
                src="/images/JBA_logo-white.svg"
                alt="JBA"
                className={cn(
                    'hidden h-8 w-auto object-contain object-left dark:block',
                    className,
                )}
            />
        </>
    );
}
