<?php

namespace App\Concerns;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

trait ReordersSortableRecords
{
    /**
     * Swap a record with its neighbour and rewrite `sort_order` sequentially
     * across the whole scope so gaps and duplicates cannot accumulate.
     *
     * @template TModel of Model
     *
     * @param  Builder<TModel>  $scope  Query matching every sibling in the ordered set.
     * @param  TModel  $record
     * @param  'up'|'down'  $direction
     */
    protected function swapWithNeighbor(Builder $scope, Model $record, string $direction): void
    {
        $orderedIds = array_values(
            (clone $scope)
                ->orderBy('sort_order')
                ->orderBy('id')
                ->pluck('id')
                ->all()
        );

        $index = array_search($record->getKey(), $orderedIds, true);

        if ($index === false) {
            return;
        }

        $neighborIndex = $direction === 'up' ? $index - 1 : $index + 1;

        if (! array_key_exists($neighborIndex, $orderedIds)) {
            return;
        }

        [$orderedIds[$index], $orderedIds[$neighborIndex]] = [
            $orderedIds[$neighborIndex],
            $orderedIds[$index],
        ];

        $this->applyOrderedIds($scope, $record, $orderedIds);
    }

    /**
     * Persist an arbitrary sibling order (e.g. after drag-and-drop).
     *
     * @template TModel of Model
     *
     * @param  Builder<TModel>  $scope
     * @param  TModel  $prototype  Any model of the same type (used for query builder).
     * @param  list<int|string>  $orderedIds
     */
    protected function applyOrderedIds(Builder $scope, Model $prototype, array $orderedIds): void
    {
        $existingIds = array_map(
            'intval',
            (clone $scope)
                ->orderBy('sort_order')
                ->orderBy('id')
                ->pluck('id')
                ->all()
        );

        $normalized = array_values(array_map('intval', $orderedIds));

        $sortedExisting = $existingIds;
        $sortedIncoming = $normalized;
        sort($sortedExisting);
        sort($sortedIncoming);

        if ($sortedExisting !== $sortedIncoming) {
            throw ValidationException::withMessages([
                'ids' => __('The ordered list does not match the current records.'),
            ]);
        }

        DB::transaction(function () use ($normalized, $prototype): void {
            foreach ($normalized as $position => $id) {
                $prototype->newQuery()
                    ->whereKey($id)
                    ->update(['sort_order' => $position + 1]);
            }
        });
    }
}
