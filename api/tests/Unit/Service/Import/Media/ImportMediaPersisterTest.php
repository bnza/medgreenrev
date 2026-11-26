<?php

declare(strict_types=1);

namespace App\Tests\Unit\Service\Import\Media;

use App\Entity\Auth\User;
use App\Entity\Vocabulary\MediaObject\Type;
use App\Service\Import\Media\ImportMediaPersister;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\EntityRepository;
use PHPUnit\Framework\TestCase;

class ImportMediaPersisterTest extends TestCase
{
    private EntityManagerInterface $entityManager;
    private ImportMediaPersister $persister;
    private string $tempDir;

    protected function setUp(): void
    {
        $this->entityManager = $this->createStub(EntityManagerInterface::class);
        $this->persister = new ImportMediaPersister($this->entityManager);

        $this->tempDir = sys_get_temp_dir().'/media_persister_test_'.uniqid();
        mkdir($this->tempDir, 0777, true);
    }

    protected function tearDown(): void
    {
        if (is_dir($this->tempDir)) {
            $files = glob($this->tempDir.'/*');
            if ($files) {
                foreach ($files as $file) {
                    unlink($file);
                }
            }
            rmdir($this->tempDir);
        }
    }

    public function testCreateMediaObjectSetsCsvMimeTypeForCsvFile(): void
    {
        $filePath = $this->tempDir.'/test_import.csv';
        file_put_contents($filePath, "col1,col2\nval1,val2\n");

        $type = new Type();
        $type->value = 'raw data';
        $type->group = 'data';

        $typeRepo = $this->createStub(EntityRepository::class);
        $typeRepo->method('findOneBy')
            ->willReturn($type);

        $this->entityManager->method('getRepository')
            ->willReturn($typeRepo);

        $user = new User();
        $tempFilePath = null;

        $mediaObject = $this->persister->createMediaObject(
            $filePath,
            $user,
            'Raw data imported Animal',
            'raw data',
            $tempFilePath,
            'text/csv'
        );

        $this->assertSame('text/csv', $mediaObject->getMimeType());
        $this->assertSame('text/csv', $mediaObject->getFile()?->getMimeType());
        $this->assertSame('Raw data imported Animal', $mediaObject->getDescription());
        $this->assertSame($user, $mediaObject->getUploadedBy());
        $this->assertNotNull($tempFilePath);
        $this->assertFileExists($tempFilePath);

        // Cleanup
        $this->persister->cleanup($mediaObject, $tempFilePath);
        $this->assertFileDoesNotExist($tempFilePath);
    }

    public function testCreateMediaObjectThrowsOnNonExistentFile(): void
    {
        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage('does not exist or is not readable');

        $user = new User();
        $tempFilePath = null;
        $this->persister->createMediaObject(
            $this->tempDir.'/non_existent.csv',
            $user,
            'Description',
            'raw data',
            $tempFilePath
        );
    }
}
