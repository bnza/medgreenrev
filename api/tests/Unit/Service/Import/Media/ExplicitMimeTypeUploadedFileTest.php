<?php

declare(strict_types=1);

namespace App\Tests\Unit\Service\Import\Media;

use App\Service\Import\Media\ExplicitMimeTypeUploadedFile;
use PHPUnit\Framework\TestCase;

class ExplicitMimeTypeUploadedFileTest extends TestCase
{
    private string $tempFilePath;

    protected function setUp(): void
    {
        $this->tempFilePath = sys_get_temp_dir().'/explicit_mime_test_'.uniqid().'.csv';
        file_put_contents($this->tempFilePath, "col1,col2\nval1,val2\n");
    }

    protected function tearDown(): void
    {
        if (file_exists($this->tempFilePath)) {
            unlink($this->tempFilePath);
        }
    }

    public function testGetMimeTypeReturnsExplicitValue(): void
    {
        $file = new ExplicitMimeTypeUploadedFile(
            path: $this->tempFilePath,
            originalName: 'test.csv',
            explicitMimeType: 'text/csv',
            test: true,
        );

        $this->assertSame('text/csv', $file->getMimeType());
        $this->assertSame('test.csv', $file->getClientOriginalName());
    }
}
