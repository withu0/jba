import {
    DndContext,
    KeyboardSensor,
    PointerSensor,
    closestCenter,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
    SortableContext,
    arrayMove,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { useState } from 'react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

export type SortableItem = {
    id: number;
};

type Props<T extends SortableItem> = {
    items: T[];
    onReorder: (orderedIds: number[]) => void;
    renderItem: (item: T, index: number) => ReactNode;
    header?: ReactNode;
    colgroup?: ReactNode;
    className?: string;
    itemClassName?: string;
    disabled?: boolean;
};

function GripButton({
    disabled,
    attributes,
    listeners,
}: {
    disabled?: boolean;
    attributes: ReturnType<typeof useSortable>['attributes'];
    listeners: ReturnType<typeof useSortable>['listeners'];
}) {
    const { t } = useTranslation();

    return (
        <button
            type="button"
            className={cn(
                'flex size-full min-h-10 w-10 shrink-0 cursor-grab items-center justify-center text-muted-foreground transition-colors hover:bg-muted/50 hover:text-ink active:cursor-grabbing',
                disabled && 'pointer-events-none opacity-40',
            )}
            aria-label={t('admin.dragHandle')}
            {...attributes}
            {...listeners}
        >
            <GripVertical className="size-4" />
        </button>
    );
}

function SortableRow({
    id,
    children,
    className,
    disabled,
    asTable,
}: {
    id: number;
    children: ReactNode;
    className?: string;
    disabled?: boolean;
    asTable: boolean;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id, disabled });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const dragClass = isDragging
        ? 'relative z-10 bg-background shadow-md ring-1 ring-brand-blue/30'
        : 'bg-background';

    if (asTable) {
        return (
            <tr
                ref={setNodeRef}
                style={style}
                className={cn(dragClass, className)}
            >
                <td className="w-10 border-r border-border p-0">
                    <GripButton
                        disabled={disabled}
                        attributes={attributes}
                        listeners={listeners}
                    />
                </td>
                {children}
            </tr>
        );
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                'flex items-stretch gap-0 border-b border-border last:border-b-0',
                dragClass,
                className,
            )}
        >
            <div className="border-r border-border">
                <GripButton
                    disabled={disabled}
                    attributes={attributes}
                    listeners={listeners}
                />
            </div>
            <div className="min-w-0 flex-1">{children}</div>
        </div>
    );
}

export function AdminSortableList<T extends SortableItem>({
    items,
    onReorder,
    renderItem,
    header,
    colgroup,
    className,
    itemClassName,
    disabled = false,
}: Props<T>) {
    const [localItems, setLocalItems] = useState(items);
    const [syncedItems, setSyncedItems] = useState(items);
    const asTable = header !== undefined;

    if (items !== syncedItems) {
        setSyncedItems(items);
        setLocalItems(items);
    }

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 6 },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over || active.id === over.id) {
            return;
        }

        const oldIndex = localItems.findIndex(
            (item) => item.id === Number(active.id),
        );
        const newIndex = localItems.findIndex(
            (item) => item.id === Number(over.id),
        );

        if (oldIndex < 0 || newIndex < 0) {
            return;
        }

        const next = arrayMove(localItems, oldIndex, newIndex);
        setLocalItems(next);
        onReorder(next.map((item) => item.id));
    };

    if (localItems.length === 0) {
        return null;
    }

    const rows = localItems.map((item, index) => (
        <SortableRow
            key={item.id}
            id={item.id}
            className={itemClassName}
            disabled={disabled}
            asTable={asTable}
        >
            {renderItem(item, index)}
        </SortableRow>
    ));

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={localItems.map((item) => item.id)}
                strategy={verticalListSortingStrategy}
                disabled={disabled}
            >
                {asTable ? (
                    <div
                        className={cn('w-full overflow-x-auto border border-border', className)}
                    >
                        <table className="w-full table-fixed text-left text-sm">
                            <colgroup>
                                <col className="w-10" />
                                {colgroup}
                            </colgroup>
                            <thead className="border-b border-border bg-surface text-xs tracking-wide text-muted-foreground uppercase">
                                <tr>
                                    <th className="w-10 p-0" aria-hidden />
                                    {header}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {rows}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div
                        className={cn(
                            'overflow-hidden rounded-md border border-border',
                            className,
                        )}
                    >
                        {rows}
                    </div>
                )}
            </SortableContext>
        </DndContext>
    );
}
