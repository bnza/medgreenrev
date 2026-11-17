<?php

namespace App\Service\Import\Progress;

use App\Dto\Output\ImportResultDto;

interface ImportProgressReporterInterface
{
    /**
     * Called before processing rows, once the total count is determined.
     */
    public function onStart(int $totalRows): void;

    /**
     * Called after each row is validated and processed.
     */
    public function onRowProcessed(int $currentRow, int $totalRows, bool $isValid): void;

    /**
     * Called when the import finishes (committed or rolled back).
     */
    public function onFinish(ImportResultDto $result): void;
}
