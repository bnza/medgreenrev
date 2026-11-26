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
    ): MediaObject;

    public function persistImportedFile(
        string $filePath,
        User $uploadedBy,
        string $description,
        string $mediaType = 'raw data',
    ): MediaObject;

    public function cleanup(?MediaObject $mediaObject, ?string $tempFilePath = null): void;
}
