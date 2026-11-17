<?php

namespace App\Service\Import;

use App\Dto\Input\ImportInputDtoInterface;
use App\Dto\Output\ImportResultDto;
use App\Service\Import\Progress\ImportProgressReporterInterface;

interface GenericImportFacadeInterface
{
    public function import(
        ImportInputDtoInterface $input,
        ?ImportProgressReporterInterface $progressReporter = null,
    ): ImportResultDto;
}
