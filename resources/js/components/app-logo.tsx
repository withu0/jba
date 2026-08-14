export default function AppLogo() {
    return (
        <>
            <img
                src="/images/JBA_logo-black.svg"
                alt="JBA"
                className="h-8 w-auto max-w-36 object-contain object-left dark:hidden"
            />
            <img
                src="/images/JBA_logo-white.svg"
                alt="JBA"
                className="hidden h-8 w-auto max-w-36 object-contain object-left dark:block"
            />
        </>
    );
}
