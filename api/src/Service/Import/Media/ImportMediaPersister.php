<?php

namespace App\Service\Import\Media;

use App\Entity\Auth\User;
use App\Entity\Data\MediaObject;
use App\Entity\Vocabulary\MediaObject\Type;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Vich\UploaderBundle\Storage\StorageInterface;

class ImportMediaPersister implements ImportMediaPersisterInterface
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly ?StorageInterface $storage = null,
    ) {
    }

    public function createMediaObject(
        string $filePath,
        User $uploadedBy,
        string $description,
        string $mediaType = 'raw data',
        ?string &$tempFilePath = null,
    ): MediaObject {
        if (!file_exists($filePath) || !is_readable($filePath)) {
            throw new \InvalidArgumentException(sprintf('File "%s" does not exist or is not readable.', $filePath));
        }

        $typeRepo = $this->entityManager->getRepository(Type::class);
        $type = $typeRepo->findOneBy(['group' => 'data', 'value' => $mediaType]);

        if (null === $type) {
            throw new \RuntimeException(sprintf('MediaObject Type with group "data" and value "%s" not found.', $mediaType));
        }

        $sha256 = hash_file('sha256', $filePath);
        if (false === $sha256) {
            throw new \RuntimeException(sprintf('Failed to compute sha256 checksum for "%s".', $filePath));
        }

        // Create a temporary copy for VichUploader to move, preserving the original file on disk
        $extension = pathinfo($filePath, PATHINFO_EXTENSION);
        $tempFilePath = sys_get_temp_dir() . '/import_media_' . uniqid('', true) . ($extension ? '.' . $extension : '');
        if (!copy($filePath, $tempFilePath)) {
            throw new \RuntimeException(sprintf('Failed to create temporary copy of "%s".', $filePath));
        }

        $originalName = basename($filePath);
        $mimeType = @mime_content_type($filePath) ?: 'text/csv';
        $uploadedFile = new UploadedFile($tempFilePath, $originalName, $mimeType, null, true);

        $mediaObject = new MediaObject();
        $mediaObject->setType($type);
        $mediaObject->setFile($uploadedFile);
        $mediaObject->setDescription($description);
        $mediaObject->setUploadedBy($uploadedBy);
        $mediaObject->setUploadDate(new \DateTimeImmutable());
        $mediaObject->setSha256($sha256);
        $mediaObject->setPublic(false);

        return $mediaObject;
    }

    public function persistImportedFile(
        string $filePath,
        User $uploadedBy,
        string $description,
        string $mediaType = 'raw data',
    ): MediaObject {
        $tempFilePath = null;
        $mediaObject = null;
        try {
            $mediaObject = $this->createMediaObject($filePath, $uploadedBy, $description, $mediaType, $tempFilePath);
            $this->entityManager->persist($mediaObject);
            $this->entityManager->flush();

            return $mediaObject;
        } catch (\Throwable $e) {
            $this->cleanup($mediaObject, $tempFilePath);
            throw $e;
        }
    }

    public function cleanup(?MediaObject $mediaObject, ?string $tempFilePath = null): void
    {
        if (null !== $tempFilePath && file_exists($tempFilePath)) {
            @unlink($tempFilePath);
        }

        if (null !== $mediaObject) {
            $file = $mediaObject->getFile();
            if (null !== $file && file_exists($file->getPathname())) {
                @unlink($file->getPathname());
            }

            if (null !== $this->storage) {
                try {
                    $resolvedPath = $this->storage->resolvePath($mediaObject, 'file');
                    if (null !== $resolvedPath && file_exists($resolvedPath)) {
                        @unlink($resolvedPath);
                    }
                } catch (\Throwable) {
                    // Ignore resolution errors during cleanup
                }
            }
        }
    }
}
