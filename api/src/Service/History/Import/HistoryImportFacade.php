<?php

namespace App\Service\History\Import;

use App\Dto\Input\ImportInputDtoInterface;
use App\Dto\Output\ImportResultDto;
use App\Service\Import\GenericImportFacadeInterface;
use App\Service\Import\Progress\ImportProgressReporterInterface;

class HistoryImportFacade implements HistoryImportFacadeInterface
{
    public function __construct(
        private readonly GenericImportFacadeInterface $genericImportFacade,
    ) {
    }

    public function import(
        ImportInputDtoInterface $input,
        ?ImportProgressReporterInterface $progressReporter = null,
    ): ImportResultDto {
        return $this->genericImportFacade->import($input, $progressReporter);
    }
}
