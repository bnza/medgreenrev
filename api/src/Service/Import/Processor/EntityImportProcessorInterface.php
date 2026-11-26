<?php

namespace App\Service\Import\Processor;

use App\Dto\Input\ImportInputDtoInterface;

interface EntityImportProcessorInterface
{
    public function supports(string $type): bool;

    /**
     * @return string Human-readable label for the dataset (e.g. 'written source animal citations', 'written source plant citations') used in MediaObject description
     */
    public function getDatasetLabel(string $type): string;

    /**
     * @return list<string> Required header field names for validation
     */
    public function getRequiredHeaders(string $type): array;

    /**
     * Maps row data to entity and validates assertions.
     * Returns mapped entity on success or list of error strings on failure.
     *
     * @param int $rowNumber
     * @param array<string, mixed> $rowData
     * @param ImportInputDtoInterface $input
     * @return RowProcessResult
     */
    public function processRow(int $rowNumber, array $rowData, ImportInputDtoInterface $input): RowProcessResult;
}
