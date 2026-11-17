<?php

namespace App\Service\Import\Progress;

use App\Dto\Output\ImportResultDto;

class NullImportProgressReporter implements ImportProgressReporterInterface
{
    public function onStart(int $totalRows): void
    {
    }

    public function onRowProcessed(int $currentRow, int $totalRows, bool $isValid): void
    {
    }

    public function onFinish(ImportResultDto $result): void
    {
    }
}
