<?php

namespace App\Concerns;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

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

        DB::transaction(function () use ($orderedIds, $record): void {
            foreach ($orderedIds as $position => $id) {
                $record->newQuery()
                    ->whereKey($id)
                    ->update(['sort_order' => $position + 1]);
            }
        });
    }
}
