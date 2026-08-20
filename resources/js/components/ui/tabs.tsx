import * as React from 'react';
import { cn } from '@/lib/utils';

type TabsContextValue = {
    value: string;
    setValue: (value: string) => void;
    baseId: string;
};

const TabsContext = React.createContext<TabsContextValue | null>(null);

function useTabs() {
    const context = React.useContext(TabsContext);
    if (!context) {
        throw new Error('Tabs components must be used within <Tabs>.');
    }
    return context;
}

type TabsProps = {
    defaultValue: string;
    value?: string;
    onValueChange?: (value: string) => void;
    className?: string;
    children: React.ReactNode;
};

function Tabs({
    defaultValue,
    value: controlledValue,
    onValueChange,
    className,
    children,
}: TabsProps) {
    const [uncontrolledValue, setUncontrolledValue] =
        React.useState(defaultValue);
    const baseId = React.useId();
    const isControlled = controlledValue !== undefined;
    const value = isControlled ? controlledValue : uncontrolledValue;

    const setValue = React.useCallback(
        (next: string) => {
            if (!isControlled) {
                setUncontrolledValue(next);
            }
            onValueChange?.(next);
        },
        [isControlled, onValueChange],
    );

    return (
        <TabsContext.Provider value={{ value, setValue, baseId }}>
            <div data-slot="tabs" className={cn('space-y-4', className)}>
                {children}
            </div>
        </TabsContext.Provider>
    );
}

function TabsList({
    className,
    ...props
}: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot="tabs-list"
            role="tablist"
            className={cn(
                'inline-flex h-9 w-full flex-wrap items-center gap-1 rounded-md border border-border bg-muted/40 p-1 sm:w-auto',
                className,
            )}
            {...props}
        />
    );
}

type TabsTriggerProps = React.ComponentProps<'button'> & {
    value: string;
};

function TabsTrigger({
    value,
    className,
    children,
    ...props
}: TabsTriggerProps) {
    const { value: active, setValue, baseId } = useTabs();
    const isActive = active === value;

    return (
        <button
            type="button"
            role="tab"
            id={`${baseId}-tab-${value}`}
            aria-controls={`${baseId}-panel-${value}`}
            aria-selected={isActive}
            data-state={isActive ? 'active' : 'inactive'}
            data-slot="tabs-trigger"
            tabIndex={isActive ? 0 : -1}
            className={cn(
                'inline-flex h-7 flex-1 items-center justify-center rounded-sm px-3 text-sm font-medium whitespace-nowrap text-muted-foreground transition-colors sm:flex-none',
                'hover:text-ink focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none',
                'data-[state=active]:bg-background data-[state=active]:text-ink data-[state=active]:shadow-xs',
                className,
            )}
            onClick={() => setValue(value)}
            {...props}
        >
            {children}
        </button>
    );
}

type TabsContentProps = React.ComponentProps<'div'> & {
    value: string;
};

/**
 * Inactive panels stay mounted (hidden) so form inputs remain in the DOM
 * and are included on submit.
 */
function TabsContent({
    value,
    className,
    children,
    ...props
}: TabsContentProps) {
    const { value: active, baseId } = useTabs();
    const isActive = active === value;

    return (
        <div
            data-slot="tabs-content"
            role="tabpanel"
            id={`${baseId}-panel-${value}`}
            aria-labelledby={`${baseId}-tab-${value}`}
            hidden={!isActive}
            data-state={isActive ? 'active' : 'inactive'}
            className={cn(
                'space-y-4 focus-visible:outline-none',
                !isActive && 'hidden',
                className,
            )}
            {...props}
        >
            {children}
        </div>
    );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
