<?php

namespace App\Tests\Unit\Service\Import;

use App\Service\Import\Reader\CsvFileReader;
use PHPUnit\Framework\TestCase;

class CsvFileReaderTest extends TestCase
{
    private CsvFileReader $reader;
    private string $tempDir;

    protected function setUp(): void
    {
        $this->reader = new CsvFileReader();
        $this->tempDir = sys_get_temp_dir() . '/csv_reader_test_' . uniqid();
        mkdir($this->tempDir, 0777, true);
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

    public function testSupportsCsv(): void
    {
        $csvFile = $this->tempDir . '/test.csv';
        file_put_contents($csvFile, "col1,col2\nval1,val2");

        $txtFile = $this->tempDir . '/test.txt';
        file_put_contents($txtFile, "col1,col2\nval1,val2");

        $this->assertTrue($this->reader->supports($csvFile));
        $this->assertTrue($this->reader->supports($this->tempDir . '/non_existent.csv'));
        $this->assertFalse($this->reader->supports($txtFile));
    }

    public function testGetHeadersAndDetectDelimiterWithComma(): void
    {
        $file = $this->tempDir . '/comma.csv';
        file_put_contents($file, "Location, Language , Animal ,Chronology_Lower\nRome,latin,Camel,100");

        $headers = $this->reader->getHeaders($file);

        $this->assertSame(['location', 'language', 'animal', 'chronology_lower'], $headers);
    }

    public function testGetHeadersAndDetectDelimiterWithSemicolon(): void
    {
        $file = $this->tempDir . '/semicolon.csv';
        file_put_contents($file, "Location;Language;Plant;Chronology_Lower;Reference\nParis;french;Oak;200;Source1");

        $headers = $this->reader->getHeaders($file);

        $this->assertSame(['location', 'language', 'plant', 'chronology_lower', 'reference'], $headers);
    }

    public function testGetHeadersStripsUtf8Bom(): void
    {
        $file = $this->tempDir . '/bom.csv';
        $bom = "\xEF\xBB\xBF";
        file_put_contents($file, $bom . "location,language,animal\nAthens,greek,Lion");

        $headers = $this->reader->getHeaders($file);

        $this->assertSame(['location', 'language', 'animal'], $headers);
    }

    public function testCountRows(): void
    {
        $file = $this->tempDir . '/count.csv';
        file_put_contents($file, "col1,col2\nval1,val2\nval3,val4\n\nval5,val6\n");

        $count = $this->reader->countRows($file);

        $this->assertSame(3, $count);
    }

    public function testReadYieldsAssociativeRows(): void
    {
        $file = $this->tempDir . '/data.csv';
        file_put_contents($file, "Location,Animal,Chronology_Lower\nRome,Camel,100\nParis,Lion,200\n");

        $rows = [];
        foreach ($this->reader->read($file) as $rowNum => $row) {
            $rows[$rowNum] = $row;
        }

        $this->assertCount(2, $rows);
        $this->assertSame([
            'location' => 'Rome',
            'animal' => 'Camel',
            'chronology_lower' => '100',
        ], $rows[1]);
        $this->assertSame([
            'location' => 'Paris',
            'animal' => 'Lion',
            'chronology_lower' => '200',
        ], $rows[2]);
    }
}
