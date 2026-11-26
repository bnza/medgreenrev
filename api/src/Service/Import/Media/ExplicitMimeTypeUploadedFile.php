<?php

declare(strict_types=1);

namespace App\Service\Import\Media;

use Symfony\Component\HttpFoundation\File\UploadedFile;

/**
 * An UploadedFile decorator that guarantees an explicitly verified MIME type
 * (e.g. 'text/csv' from FileReaderInterface) instead of relying on libmagic plain-text fallback.
 */
class ExplicitMimeTypeUploadedFile extends UploadedFile
{
    public function __construct(
        string $path,
        string $originalName,
        private readonly string $explicitMimeType,
        ?int $error = null,
        bool $test = false,
    ) {
        parent::__construct($path, $originalName, $explicitMimeType, $error, $test);
    }

    public function getMimeType(): ?string
    {
        return $this->explicitMimeType;
    }
}
