<?php

namespace App\Tests\Unit\Service\Import;

use App\Service\Import\Writer\CsvImportErrorWriter;
use PHPUnit\Framework\TestCase;

class CsvImportErrorWriterTest extends TestCase
{
    private string $tempDir;
    private CsvImportErrorWriter $writer;

    protected function setUp(): void
    {
        $this->tempDir = sys_get_temp_dir() . '/error_writer_test_' . uniqid();
        mkdir($this->tempDir, 0777, true);
        $this->writer = new CsvImportErrorWriter($this->tempDir, $this->tempDir);
    }

    protected function tearDown(): void
    {
        if (is_dir($this->tempDir)) {
            $files = glob($this->tempDir . '/*');
            if ($files) {
                foreach ($files as $file) {
                    unlink($file);
                }
            }
            rmdir($this->tempDir);
        }
    }

    public function testWriteErrorsGeneratesTimestampedCsv(): void
    {
        $sourceFile = '/path/to/historical_animals.csv';
        $headers = ['location', 'language', 'animal', 'chronology_lower', 'chronology_upper'];
        $failedRows = [
            [
                'location' => 'UnknownLocation',
                'language' => 'latin',
                'animal' => 'Elephant',
                'chronology_lower' => '500',
                'chronology_upper' => '400',
                'error' => 'Location "UnknownLocation" does not exist; chronologyLower cannot be greater than chronologyUpper',
            ],
            [
                'location' => 'Rome',
                'language' => 'invalid_lang',
                'animal' => 'Wolf',
                'chronology_lower' => '100',
                'chronology_upper' => '200',
                'error' => ['Language "invalid_lang" does not exist.'],
            ],
        ];

        $errorFilePath = $this->writer->writeErrors($sourceFile, $headers, $failedRows);

        $this->assertFileExists($errorFilePath);
        $this->assertStringContainsString('historical_animals_errors.csv', $errorFilePath);

        $handle = fopen($errorFilePath, 'r');
        $this->assertNotFalse($handle);

        $readHeaders = fgetcsv($handle, escape: '');
        $this->assertSame(['location', 'language', 'animal', 'chronology_lower', 'chronology_upper', 'error'], $readHeaders);

        $row1 = fgetcsv($handle, escape: '');
        $this->assertSame('UnknownLocation', $row1[0]);
        $this->assertSame('Location "UnknownLocation" does not exist; chronologyLower cannot be greater than chronologyUpper', $row1[5]);

        $row2 = fgetcsv($handle, escape: '');
        $this->assertSame('invalid_lang', $row2[1]);
        $this->assertSame('Language "invalid_lang" does not exist.', $row2[5]);

        fclose($handle);
    }
}
