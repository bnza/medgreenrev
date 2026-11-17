<?php

namespace App\Service\Import;

use App\Dto\Input\ImportInputDtoInterface;
use App\Dto\Output\ImportResultDto;
use App\Service\Import\Media\ImportMediaPersisterInterface;
use App\Service\Import\Processor\EntityImportProcessorInterface;
use App\Service\Import\Progress\ImportProgressReporterInterface;
use App\Service\Import\Progress\NullImportProgressReporter;
use App\Service\Import\Reader\FileReaderInterface;
use App\Service\Import\Writer\ImportErrorWriterInterface;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\DependencyInjection\Attribute\AutowireIterator;

class GenericDataImportFacade implements GenericImportFacadeInterface
{
    /** @var list<EntityImportProcessorInterface> */
    private array $processors;

    /** @var list<FileReaderInterface> */
    private array $readers;

    /**
     * @param iterable<EntityImportProcessorInterface> $processors
     * @param iterable<FileReaderInterface>            $readers
     */
    public function __construct(
        #[AutowireIterator('app.import.processor')]
        iterable $processors,
        #[AutowireIterator('app.import.reader')]
        iterable $readers,
        private readonly ImportErrorWriterInterface $errorWriter,
        private readonly ImportMediaPersisterInterface $mediaPersister,
        private readonly EntityManagerInterface $entityManager,
    ) {
        $this->processors = is_array($processors) ? $processors : iterator_to_array($processors);
        $this->readers = is_array($readers) ? $readers : iterator_to_array($readers);
    }

    public function import(
        ImportInputDtoInterface $input,
        ?ImportProgressReporterInterface $progressReporter = null,
    ): ImportResultDto {
        $reporter = $progressReporter ?? new NullImportProgressReporter();
        $filePath = $input->getFilePath();
        $type = $input->getType();

        // 1. Verify File Existence & Permissions
        if (!file_exists($filePath)) {
            $errorMsg = sprintf('File "%s" does not exist.', $filePath);
            $result = new ImportResultDto(
                success: false,
                totalRows: 0,
                importedCount: 0,
                error: $errorMsg,
            );
            $reporter->onFinish($result);

            return $result;
        }

        if (!is_readable($filePath)) {
            $errorMsg = sprintf('File "%s" is not readable due to file permission restrictions.', $filePath);
            $result = new ImportResultDto(
                success: false,
                totalRows: 0,
                importedCount: 0,
                error: $errorMsg,
            );
            $reporter->onFinish($result);

            return $result;
        }

        // 2. Resolve File Reader
        $reader = $this->resolveReader($filePath);
        if (null === $reader) {
            $extension = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));
            $errorMsg = '' !== $extension
                ? sprintf('Unsupported file format ".%s". No matching file reader found for "%s".', $extension, $filePath)
                : sprintf('No matching file reader found supporting "%s".', $filePath);

            $result = new ImportResultDto(
                success: false,
                totalRows: 0,
                importedCount: 0,
                error: $errorMsg,
            );
            $reporter->onFinish($result);

            return $result;
        }

        // 3. Resolve Entity Processor
        $processor = $this->resolveProcessor($type);
        if (null === $processor) {
            $errorMsg = sprintf('Unsupported import type "%s". No matching entity processor found.', $type);
            $result = new ImportResultDto(
                success: false,
                totalRows: 0,
                importedCount: 0,
                error: $errorMsg,
            );
            $reporter->onFinish($result);

            return $result;
        }

        // 4. Verify Required Headers
        try {
            $fileHeaders = $reader->getHeaders($filePath);
        } catch (\Throwable $e) {
            $errorMsg = sprintf('Failed to read file headers: %s', $e->getMessage());
            $result = new ImportResultDto(
                success: false,
                totalRows: 0,
                importedCount: 0,
                error: $errorMsg,
            );
            $reporter->onFinish($result);

            return $result;
        }

        $requiredHeaders = $processor->getRequiredHeaders($type);
        $missingHeaders = array_diff($requiredHeaders, $fileHeaders);

        if (!empty($missingHeaders)) {
            $errorMsg = sprintf('Missing required header(s): %s', implode(', ', $missingHeaders));
            $result = new ImportResultDto(
                success: false,
                totalRows: 0,
                importedCount: 0,
                validationErrors: [['row' => 1, 'errors' => [$errorMsg]]],
                error: $errorMsg,
            );
            $reporter->onFinish($result);

            return $result;
        }

        // 5. Count Total Data Rows
        try {
            $totalRows = $reader->countRows($filePath);
        } catch (\Throwable $e) {
            $errorMsg = sprintf('Failed to count file rows: %s', $e->getMessage());
            $result = new ImportResultDto(
                success: false,
                totalRows: 0,
                importedCount: 0,
                error: $errorMsg,
            );
            $reporter->onFinish($result);

            return $result;
        }

        if (0 === $totalRows) {
            $errorMsg = 'File contains no data rows to import.';
            $result = new ImportResultDto(
                success: false,
                totalRows: 0,
                importedCount: 0,
                validationErrors: [['row' => 1, 'errors' => [$errorMsg]]],
                error: $errorMsg,
            );
            $reporter->onFinish($result);

            return $result;
        }

        $reporter->onStart($totalRows);

        // 6. Exhaustive Validation & Entity Mapping
        try {
            $validEntities = [];
            $validationErrors = [];
            $failedRows = [];

            foreach ($reader->read($filePath) as $rowNumber => $rowData) {
                assert(is_int($rowNumber));
                $processResult = $processor->processRow($rowNumber, $rowData, $input);

                if ($processResult->isValid() && null !== $processResult->entity) {
                    $validEntities[] = $processResult->entity;
                    $reporter->onRowProcessed($rowNumber, $totalRows, true);
                } else {
                    $errors = $processResult->errors;
                    $validationErrors[] = [
                        'row' => $rowNumber,
                        'errors' => $errors,
                    ];
                    $failedRows[] = array_merge($rowData, [
                        'error' => implode('; ', $errors),
                    ]);
                    $reporter->onRowProcessed($rowNumber, $totalRows, false);
                }
            }

            // 7. Handle Validation Failure (Atomic Rollback & Error CSV Generation)
            if (!empty($validationErrors) || !empty($failedRows)) {
                $errorFilePath = $this->errorWriter->writeErrors($filePath, $fileHeaders, $failedRows);

                $result = new ImportResultDto(
                    success: false,
                    totalRows: $totalRows,
                    importedCount: 0,
                    validationErrors: $validationErrors,
                    errorFilePath: $errorFilePath,
                    mediaObject: null,
                    error: sprintf('Validation failed for %d row(s).', count($validationErrors)),
                );

                $reporter->onFinish($result);

                return $result;
            }

            // 8. Handle Success (Commit Transaction and Persist MediaObject)
            $this->entityManager->wrapInTransaction(function () use ($validEntities) {
                foreach ($validEntities as $entity) {
                    $this->entityManager->persist($entity);
                }
                $this->entityManager->flush();
            });

            $entityLabel = $processor->getEntityLabel($type);
            $mediaDescription = sprintf('Raw data imported %s', $entityLabel);
            $mediaObject = $this->mediaPersister->persistImportedFile(
                $filePath,
                $input->getUser(),
                $mediaDescription,
                'raw data',
            );

            $result = new ImportResultDto(
                success: true,
                totalRows: $totalRows,
                importedCount: count($validEntities),
                validationErrors: [],
                errorFilePath: null,
                mediaObject: $mediaObject,
                error: null,
            );

            $reporter->onFinish($result);

            return $result;
        } catch (\Throwable $e) {
            $result = new ImportResultDto(
                success: false,
                totalRows: $totalRows,
                importedCount: 0,
                error: sprintf('An error occurred during import execution: %s', $e->getMessage()),
            );

            $reporter->onFinish($result);

            return $result;
        }
    }

    private function resolveReader(string $filePath): ?FileReaderInterface
    {
        foreach ($this->readers as $reader) {
            if ($reader->supports($filePath)) {
                return $reader;
            }
        }

        return null;
    }

    private function resolveProcessor(string $type): ?EntityImportProcessorInterface
    {
        foreach ($this->processors as $processor) {
            if ($processor->supports($type)) {
                return $processor;
            }
        }

        return null;
    }
}
