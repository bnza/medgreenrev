<?php

namespace App\Service\Import\Writer;

use Symfony\Component\DependencyInjection\Attribute\Autowire;

class CsvImportErrorWriter implements ImportErrorWriterInterface
{
    private readonly string $errorDir;

    public function __construct(
        #[Autowire('%kernel.project_dir%')]
        string $projectDir,
        ?string $errorDir = null,
    ) {
        $this->errorDir = $errorDir ?? rtrim($projectDir, '/') . '/var/imports/errors';
    }

    /**
     * @param string $sourceFilePath
     * @param list<string> $headers Original header columns
     * @param list<array<string, mixed>> $failedRows Rows with original values plus 'error' column
     * @return string Path to generated error file
     */
    public function writeErrors(string $sourceFilePath, array $headers, array $failedRows): string
    {
        if (!is_dir($this->errorDir)) {
            if (!mkdir($this->errorDir, 0777, true) && !is_dir($this->errorDir)) {
                throw new \RuntimeException(sprintf('Cannot create error directory "%s".', $this->errorDir));
            }
        }

        $basename = pathinfo($sourceFilePath, PATHINFO_FILENAME);
        $timestamp = date('Ymd_His');
        $errorFileName = sprintf('%s_%s_errors.csv', $timestamp, $basename);
        $errorFilePath = $this->errorDir . '/' . $errorFileName;

        $handle = fopen($errorFilePath, 'w');
        if (false === $handle) {
            throw new \RuntimeException(sprintf('Cannot open error file "%s" for writing.', $errorFilePath));
        }

        // Write CSV headers (original headers + error column)
        $outputHeaders = $headers;
        if (!in_array('error', $outputHeaders, true)) {
            $outputHeaders[] = 'error';
        }

        fputcsv($handle, $outputHeaders, escape: '');

        // Write failed rows
        foreach ($failedRows as $row) {
            $csvRow = [];
            foreach ($outputHeaders as $header) {
                $val = $row[$header] ?? '';
                if (is_array($val)) {
                    $val = implode('; ', $val);
                }
                $csvRow[] = (string) $val;
            }
            fputcsv($handle, $csvRow, escape: '');
        }

        fclose($handle);

        return $errorFilePath;
    }

    public function getErrorDir(): string
    {
        return $this->errorDir;
    }
}
