<?php

namespace App\Service\Import\Reader;

class CsvFileReader implements FileReaderInterface
{
    public function supports(string $filePath): bool
    {
        $extension = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));

        return 'csv' === $extension;
    }

    public function detectDelimiter(string $filePath): string
    {
        $handle = fopen($filePath, 'r');
        if (false === $handle) {
            throw new \RuntimeException(sprintf('Cannot open file "%s" for reading.', $filePath));
        }

        $firstLine = fgets($handle);
        fclose($handle);

        if (false === $firstLine || '' === trim($firstLine)) {
            return ',';
        }

        $firstLine = $this->stripBom($firstLine);

        $delimiters = [',', ';', "\t"];
        $bestDelimiter = ',';
        $maxCount = 0;

        foreach ($delimiters as $delimiter) {
            $count = count(str_getcsv($firstLine, $delimiter, escape: ''));
            if ($count > $maxCount) {
                $maxCount = $count;
                $bestDelimiter = $delimiter;
            }
        }

        return $bestDelimiter;
    }

    /**
     * @return list<string>
     */
    public function getHeaders(string $filePath): array
    {
        if (!file_exists($filePath) || !is_readable($filePath)) {
            throw new \InvalidArgumentException(sprintf('File "%s" does not exist or is not readable.', $filePath));
        }

        $delimiter = $this->detectDelimiter($filePath);
        $handle = fopen($filePath, 'r');
        if (false === $handle) {
            throw new \RuntimeException(sprintf('Cannot open file "%s" for reading.', $filePath));
        }

        $rawHeaders = fgetcsv($handle, 0, $delimiter, escape: '');
        fclose($handle);

        if (false === $rawHeaders || empty($rawHeaders) || (1 === count($rawHeaders) && null === $rawHeaders[0])) {
            return [];
        }

        $headers = [];
        foreach ($rawHeaders as $idx => $header) {
            $header = (string) $header;
            if (0 === $idx) {
                $header = $this->stripBom($header);
            }
            $normalized = strtolower(trim($header));
            if ('' !== $normalized) {
                $headers[] = $normalized;
            }
        }

        return $headers;
    }

    public function countRows(string $filePath): int
    {
        if (!file_exists($filePath) || !is_readable($filePath)) {
            throw new \InvalidArgumentException(sprintf('File "%s" does not exist or is not readable.', $filePath));
        }

        $delimiter = $this->detectDelimiter($filePath);
        $handle = fopen($filePath, 'r');
        if (false === $handle) {
            throw new \RuntimeException(sprintf('Cannot open file "%s" for reading.', $filePath));
        }

        // Skip header
        fgetcsv($handle, 0, $delimiter, escape: '');

        $count = 0;
        while (false !== ($row = fgetcsv($handle, 0, $delimiter, escape: ''))) {
            if ($this->isEmptyRow($row)) {
                continue;
            }
            ++$count;
        }

        fclose($handle);

        return $count;
    }

    /**
     * @return \Generator<int, array<string, mixed>> Yields 1-based data row number and associative row data
     */
    public function read(string $filePath): \Generator
    {
        if (!file_exists($filePath) || !is_readable($filePath)) {
            throw new \InvalidArgumentException(sprintf('File "%s" does not exist or is not readable.', $filePath));
        }

        $headers = $this->getHeaders($filePath);
        if (empty($headers)) {
            return;
        }

        $delimiter = $this->detectDelimiter($filePath);
        $handle = fopen($filePath, 'r');
        if (false === $handle) {
            throw new \RuntimeException(sprintf('Cannot open file "%s" for reading.', $filePath));
        }

        // Skip header row
        fgetcsv($handle, 0, $delimiter, escape: '');

        $rowNumber = 1;
        while (false !== ($rawRow = fgetcsv($handle, 0, $delimiter, escape: ''))) {
            if ($this->isEmptyRow($rawRow)) {
                ++$rowNumber;
                continue;
            }

            $rowData = [];
            foreach ($headers as $index => $headerName) {
                $val = $rawRow[$index] ?? null;
                $rowData[$headerName] = null !== $val ? trim((string) $val) : null;
            }

            yield $rowNumber => $rowData;
            ++$rowNumber;
        }

        fclose($handle);
    }

    private function stripBom(string $text): string
    {
        return preg_replace('/^\xEF\xBB\xBF/', '', $text) ?? $text;
    }

    /**
     * @param array<int, mixed>|null $row
     */
    private function isEmptyRow(?array $row): bool
    {
        if (null === $row || empty($row)) {
            return true;
        }

        foreach ($row as $cell) {
            if (null !== $cell && '' !== trim((string) $cell)) {
                return false;
            }
        }

        return true;
    }
}
