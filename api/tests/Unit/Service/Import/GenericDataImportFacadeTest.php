<?php

namespace App\Tests\Unit\Service\Import;

use App\Dto\Input\GenericImportInputDto;
use App\Entity\Auth\User;
use App\Entity\Data\MediaObject;
use App\Service\Import\GenericDataImportFacade;
use App\Service\Import\Media\ImportMediaPersisterInterface;
use App\Service\Import\Processor\EntityImportProcessorInterface;
use App\Service\Import\Processor\RowProcessResult;
use App\Service\Import\Progress\ImportProgressReporterInterface;
use App\Service\Import\Reader\FileReaderInterface;
use App\Service\Import\Writer\ImportErrorWriterInterface;
use Doctrine\ORM\EntityManagerInterface;
use PHPUnit\Framework\TestCase;

class GenericDataImportFacadeTest extends TestCase
{
    private FileReaderInterface $reader;
    private EntityImportProcessorInterface $processor;
    private ImportErrorWriterInterface $errorWriter;
    private ImportMediaPersisterInterface $mediaPersister;
    private EntityManagerInterface $entityManager;
    private GenericDataImportFacade $facade;
    private User $user;
    private string $tempDir;

    protected function setUp(): void
    {
        $this->reader = $this->createStub(FileReaderInterface::class);
        $this->processor = $this->createStub(EntityImportProcessorInterface::class);
        $this->errorWriter = $this->createStub(ImportErrorWriterInterface::class);
        $this->mediaPersister = $this->createStub(ImportMediaPersisterInterface::class);
        $this->entityManager = $this->createStub(EntityManagerInterface::class);

        $this->facade = new GenericDataImportFacade(
            processors: [$this->processor],
            readers: [$this->reader],
            errorWriter: $this->errorWriter,
            mediaPersister: $this->mediaPersister,
            entityManager: $this->entityManager,
        );

        $this->user = new User();
        $this->tempDir = sys_get_temp_dir() . '/facade_test_' . uniqid();
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

    public function testImportFileDoesNotExist(): void
    {
        $filePath = $this->tempDir . '/non_existent.csv';
        $input = new GenericImportInputDto(filePath: $filePath, type: 'animal', user: $this->user);

        $result = $this->facade->import($input);

        $this->assertFalse($result->success);
        $this->assertSame(0, $result->totalRows);
        $this->assertSame(0, $result->importedCount);
        $this->assertStringContainsString('does not exist', $result->error ?? '');
    }

    public function testImportUnsupportedFileFormat(): void
    {
        $filePath = $this->tempDir . '/test.unknown';
        touch($filePath);

        $input = new GenericImportInputDto(filePath: $filePath, type: 'animal', user: $this->user);

        $reader = $this->createStub(FileReaderInterface::class);
        $reader->method('supports')->willReturn(false);

        $facade = new GenericDataImportFacade(
            processors: [$this->processor],
            readers: [$reader],
            errorWriter: $this->errorWriter,
            mediaPersister: $this->mediaPersister,
            entityManager: $this->entityManager,
        );

        $result = $facade->import($input);

        $this->assertFalse($result->success);
        $this->assertStringContainsString('Unsupported file format', $result->error ?? '');
    }

    public function testImportUnsupportedProcessorType(): void
    {
        $filePath = $this->tempDir . '/test.csv';
        touch($filePath);

        $input = new GenericImportInputDto(filePath: $filePath, type: 'unsupported_type', user: $this->user);

        $reader = $this->createStub(FileReaderInterface::class);
        $reader->method('supports')->willReturn(true);

        $processor = $this->createStub(EntityImportProcessorInterface::class);
        $processor->method('supports')->willReturn(false);

        $facade = new GenericDataImportFacade(
            processors: [$processor],
            readers: [$reader],
            errorWriter: $this->errorWriter,
            mediaPersister: $this->mediaPersister,
            entityManager: $this->entityManager,
        );

        $result = $facade->import($input);

        $this->assertFalse($result->success);
        $this->assertStringContainsString('Unsupported import type "unsupported_type"', $result->error ?? '');
    }

    public function testImportHeaderReadException(): void
    {
        $filePath = $this->tempDir . '/corrupt.csv';
        touch($filePath);

        $input = new GenericImportInputDto(filePath: $filePath, type: 'animal', user: $this->user);

        $reader = $this->createStub(FileReaderInterface::class);
        $reader->method('supports')->willReturn(true);
        $reader->method('getHeaders')->willThrowException(new \RuntimeException('Corrupt file stream'));

        $processor = $this->createStub(EntityImportProcessorInterface::class);
        $processor->method('supports')->willReturn(true);

        $facade = new GenericDataImportFacade(
            processors: [$processor],
            readers: [$reader],
            errorWriter: $this->errorWriter,
            mediaPersister: $this->mediaPersister,
            entityManager: $this->entityManager,
        );

        $result = $facade->import($input);

        $this->assertFalse($result->success);
        $this->assertStringContainsString('Failed to read file headers: Corrupt file stream', $result->error ?? '');
    }

    public function testImportMissingHeaders(): void
    {
        $filePath = $this->tempDir . '/file.csv';
        touch($filePath);
        $input = new GenericImportInputDto(filePath: $filePath, type: 'animal', user: $this->user);

        $this->reader->method('supports')->willReturn(true);
        $this->processor->method('supports')->willReturn(true);

        $this->reader->method('getHeaders')->willReturn(['location', 'animal']);
        $this->processor->method('getRequiredHeaders')->willReturn(['location', 'language', 'animal']);

        $result = $this->facade->import($input);

        $this->assertFalse($result->success);
        $this->assertStringContainsString('Missing required header(s): language', $result->error ?? '');
        $this->assertStringContainsString('Missing required header(s): language', $result->validationErrors[0]['errors'][0]);
    }

    public function testImportEmptyFile(): void
    {
        $filePath = $this->tempDir . '/empty.csv';
        touch($filePath);
        $input = new GenericImportInputDto(filePath: $filePath, type: 'animal', user: $this->user);

        $this->reader->method('supports')->willReturn(true);
        $this->processor->method('supports')->willReturn(true);

        $this->reader->method('getHeaders')->willReturn(['location', 'language', 'animal']);
        $this->processor->method('getRequiredHeaders')->willReturn(['location', 'language', 'animal']);
        $this->reader->method('countRows')->willReturn(0);

        $result = $this->facade->import($input);

        $this->assertFalse($result->success);
        $this->assertSame('File contains no data rows to import.', $result->error);
    }

    public function testImportSuccessful(): void
    {
        $filePath = $this->tempDir . '/animals.csv';
        touch($filePath);
        $input = new GenericImportInputDto(
            filePath: $filePath,
            type: 'animal',
            user: $this->user,
        );

        $reader = $this->createStub(FileReaderInterface::class);
        $reader->method('supports')->willReturn(true);
        $reader->method('getHeaders')->willReturn(['location', 'language', 'animal', 'chronology_lower', 'chronology_upper']);
        $reader->method('countRows')->willReturn(2);

        $processor = $this->createMock(EntityImportProcessorInterface::class);
        $processor->method('supports')->willReturn(true);
        $processor->method('getRequiredHeaders')->willReturn(['location', 'language', 'animal']);
        $processor->method('getEntityLabel')->willReturn('Animal');

        $dummyEntity1 = new \stdClass();
        $dummyEntity2 = new \stdClass();

        $rows = [
            1 => ['location' => 'Rome', 'language' => 'latin', 'animal' => 'Camel', 'chronology_lower' => '100', 'chronology_upper' => '200'],
            2 => ['location' => 'Paris', 'language' => 'latin', 'animal' => 'Lion', 'chronology_lower' => '200', 'chronology_upper' => '300'],
        ];

        $generator = (function () use ($rows) {
            foreach ($rows as $k => $v) {
                yield $k => $v;
            }
        })();

        $reader->method('read')->willReturn($generator);

        $processor->expects($this->exactly(2))
            ->method('processRow')
            ->willReturnMap([
                [1, $rows[1], $input, new RowProcessResult(entity: $dummyEntity1)],
                [2, $rows[2], $input, new RowProcessResult(entity: $dummyEntity2)],
            ]);

        $entityManager = $this->createMock(EntityManagerInterface::class);
        $entityManager->expects($this->once())
            ->method('wrapInTransaction')
            ->willReturnCallback(function ($callback) {
                return $callback();
            });

        $entityManager->expects($this->exactly(3))->method('persist');
        $entityManager->expects($this->once())->method('flush');

        $mediaObject = new MediaObject();
        $mediaPersister = $this->createMock(ImportMediaPersisterInterface::class);
        $mediaPersister->expects($this->once())
            ->method('createMediaObject')
            ->with($filePath, $this->user, 'Raw data imported Animal', 'raw data')
            ->willReturn($mediaObject);

        $errorWriter = $this->createMock(ImportErrorWriterInterface::class);
        $errorWriter->expects($this->never())->method('writeErrors');

        $facade = new GenericDataImportFacade(
            processors: [$processor],
            readers: [$reader],
            errorWriter: $errorWriter,
            mediaPersister: $mediaPersister,
            entityManager: $entityManager,
        );

        $reporter = $this->createMock(ImportProgressReporterInterface::class);
        $reporter->expects($this->once())->method('onStart')->with(2);
        $reporter->expects($this->exactly(2))->method('onRowProcessed');
        $reporter->expects($this->once())->method('onFinish');

        $result = $facade->import($input, $reporter);

        $this->assertTrue($result->success);
        $this->assertSame(2, $result->totalRows);
        $this->assertSame(2, $result->importedCount);
        $this->assertEmpty($result->validationErrors);
        $this->assertNull($result->error);
        $this->assertSame($mediaObject, $result->mediaObject);
    }

    public function testImportValidationFailureExhaustiveErrorCollection(): void
    {
        $filePath = $this->tempDir . '/animals.csv';
        touch($filePath);
        $input = new GenericImportInputDto(
            filePath: $filePath,
            type: 'animal',
            user: $this->user,
        );

        $reader = $this->createStub(FileReaderInterface::class);
        $reader->method('supports')->willReturn(true);
        $reader->method('getHeaders')->willReturn(['location', 'language', 'animal']);
        $reader->method('countRows')->willReturn(3);

        $processor = $this->createMock(EntityImportProcessorInterface::class);
        $processor->method('supports')->willReturn(true);
        $processor->method('getRequiredHeaders')->willReturn(['location', 'language', 'animal']);

        $dummyEntity2 = new \stdClass();

        $rows = [
            1 => ['location' => 'UnknownLoc', 'language' => 'latin', 'animal' => 'Camel'],
            2 => ['location' => 'Rome', 'language' => 'latin', 'animal' => 'Lion'],
            3 => ['location' => 'Paris', 'language' => 'invalid_lang', 'animal' => 'Bear'],
        ];

        $generator = (function () use ($rows) {
            foreach ($rows as $k => $v) {
                yield $k => $v;
            }
        })();

        $reader->method('read')->willReturn($generator);

        $processor->expects($this->exactly(3))
            ->method('processRow')
            ->willReturnMap([
                [1, $rows[1], $input, new RowProcessResult(errors: ['Unknown location "UnknownLoc"'])],
                [2, $rows[2], $input, new RowProcessResult(entity: $dummyEntity2)],
                [3, $rows[3], $input, new RowProcessResult(errors: ['Unknown language "invalid_lang"'])],
            ]);

        $entityManager = $this->createMock(EntityManagerInterface::class);
        $entityManager->expects($this->never())->method('wrapInTransaction');
        $entityManager->expects($this->never())->method('persist');

        $mediaPersister = $this->createMock(ImportMediaPersisterInterface::class);
        $mediaPersister->expects($this->never())->method('createMediaObject');

        $errorWriter = $this->createMock(ImportErrorWriterInterface::class);
        $errorWriter->expects($this->once())
            ->method('writeErrors')
            ->with(
                $filePath,
                ['location', 'language', 'animal'],
                $this->callback(function ($failedRows) {
                    return count($failedRows) === 2
                        && $failedRows[0]['location'] === 'UnknownLoc'
                        && $failedRows[0]['error'] === 'Unknown location "UnknownLoc"'
                        && $failedRows[1]['language'] === 'invalid_lang'
                        && $failedRows[1]['error'] === 'Unknown language "invalid_lang"';
                })
            )
            ->willReturn('/var/imports/errors/20261117_112500_animals_errors.csv');

        $facade = new GenericDataImportFacade(
            processors: [$processor],
            readers: [$reader],
            errorWriter: $errorWriter,
            mediaPersister: $mediaPersister,
            entityManager: $entityManager,
        );

        $result = $facade->import($input);

        $this->assertFalse($result->success);
        $this->assertSame(3, $result->totalRows);
        $this->assertSame(0, $result->importedCount);
        $this->assertCount(2, $result->validationErrors);
        $this->assertSame('/var/imports/errors/20261117_112500_animals_errors.csv', $result->errorFilePath);
        $this->assertSame('Validation failed for 2 row(s).', $result->error);
    }
}
