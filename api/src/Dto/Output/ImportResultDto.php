<?php

namespace App\Dto\Output;

use App\Entity\Data\MediaObject;

final readonly class ImportResultDto
{
    /**
     * @param list<array{row: int, errors: list<string>}> $validationErrors
     */
    public function __construct(
        public bool $success,
        public int $totalRows,
        public int $importedCount,
        public array $validationErrors = [],
        public ?string $errorFilePath = null,
        public ?MediaObject $mediaObject = null,
        public ?string $error = null,
    ) {
    }
}
