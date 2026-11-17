<?php

namespace App\Service\History\Import;

use App\Dto\Input\ImportInputDtoInterface;
use App\Dto\Output\ImportResultDto;
use App\Service\Import\Progress\ImportProgressReporterInterface;

interface HistoryImportFacadeInterface
{
    public function import(
        ImportInputDtoInterface $input,
        ?ImportProgressReporterInterface $progressReporter = null,
    ): ImportResultDto;
}
