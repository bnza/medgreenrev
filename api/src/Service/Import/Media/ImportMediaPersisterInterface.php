<?php

namespace App\Service\Import\Media;

use App\Entity\Auth\User;
use App\Entity\Data\MediaObject;

interface ImportMediaPersisterInterface
{
    public function createMediaObject(
        string $filePath,
        User $uploadedBy,
        string $description,
        string $mediaType = 'raw data',
        ?string &$tempFilePath = null,
        ?string $mimeType = null,
    ): MediaObject;

    public function persistImportedFile(
        string $filePath,
        User $uploadedBy,
        string $description,
        string $mediaType = 'raw data',
        ?string $mimeType = null,
    ): MediaObject;

    public function cleanup(?MediaObject $mediaObject, ?string $tempFilePath = null): void;
}
