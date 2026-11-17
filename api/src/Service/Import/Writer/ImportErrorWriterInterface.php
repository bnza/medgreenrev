<?php

namespace App\Service\Import\Writer;

interface ImportErrorWriterInterface
{
    /**
     * @param string $sourceFilePath Original file path (used for deriving basename)
     * @param list<string> $headers Original header columns
     * @param list<array<string, mixed>> $failedRows Rows containing original values plus 'error' column
     * @return string Path to the generated error file
     */
    public function writeErrors(string $sourceFilePath, array $headers, array $failedRows): string;
}
