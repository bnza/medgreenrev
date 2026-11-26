<?php

namespace App\Service\Import\Reader;

interface FileReaderInterface
{
    public function supports(string $filePath): bool;

    public function getMimeType(): string;

    /**
     * @return \Generator<int, array<string, mixed>> Yields 1-based row number and associative row data
     */
    public function read(string $filePath): \Generator;

    /**
     * @return list<string> Normalized headers
     */
    public function getHeaders(string $filePath): array;

    /**
     * Returns the total number of data rows in the file (excluding header).
     */
    public function countRows(string $filePath): int;
}
